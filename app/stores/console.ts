import { makeAutoObservable, observable } from 'mobx';
import service from '@app/config/service';
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';
import { getI18n } from '@vesoft-inc/i18n';
import { safeParse } from '@app/utils/function';
import { NgqlRes } from '@app/utils/websocket';
import { getRootStore } from '.';
import { ban, keyWords, operators } from '@app/config/nebulaQL';
import gpt from './gpt';

const { intl } = getI18n();

export const splitQuery = (query: string) => {
  const _query = query.split('\n').filter((i) => !i.trim().startsWith('//') && !i.trim().startsWith('#'));
  const result = _query.reduce((acc, cur) => {
    const line = cur.trim();
    const last = acc[acc.length - 1];
    if (last?.endsWith('\\')) {
      acc[acc.length - 1] = acc[acc.length - 1].slice(0, -1) + line;
    } else if (last && !last.endsWith(';') && !last.startsWith(':')) {
      acc[acc.length - 1] += ' ' + line;
    } else {
      acc.push(line);
    }
    return acc;
  }, []);
  return result.map((line) => (line.startsWith(':') ? line.replace(/;$/gm, '') : line));
};

export type HistoryResult = NgqlRes & {
  id: string;
  gql: string;
  space?: string;
  spaceVidType?: string;
};

const DEFAULT_GQL = 'SHOW SPACES;';
export class ConsoleStore {
  runGQLLoading = false;
  currentGQL = DEFAULT_GQL;
  currentSpace: string = localStorage.getItem('currentSpace') || '';
  results: HistoryResult[] = safeParse(sessionStorage.getItem('consoleResults')) || [];
  paramsMap = null as any;
  favorites = [] as {
    id: string;
    content: string;
  }[];
  showCompletion = false;
  completionList = [] as { type: string, text: string }[];
  activeCompletionIndex = 0;
  constructor() {
    makeAutoObservable(this, {
      results: observable.ref,
      currentSpace: observable,
      paramsMap: observable,
      currentGQL: observable,
      favorites: observable,
    });
    this.addKeyboardEvent();
  }
  get rootStore() {
    return getRootStore();
  }
  resetModel = () => {
    const shadowStore = new ConsoleStore();
    for (const key in shadowStore) {
      if (typeof shadowStore[key] !== 'function') {
        this[key] = shadowStore[key];
      }
    }
  };

  update = (param: Partial<ConsoleStore>) => {
    Object.keys(param).forEach((key) => (this[key] = param[key]));
  };

  updateCurrentSpace = (space: string) => {
    this.currentSpace = space;
    localStorage.setItem('currentSpace', space || '');
  };

  runGQL = async (payload: { gql: string; editorValue?: string }) => {
    const { gql, editorValue } = payload;
    this.update({ runGQLLoading: true });
    try {
      let spaceVidType = undefined as unknown as string;
      if (this.currentSpace) {
        const { data } = await this.rootStore.schema.getSpaceInfo(this.currentSpace);
        spaceVidType = data?.tables?.[0]?.['Vid Type'];
        if (!spaceVidType) {
          return;
        }
      }
      const gqlList = splitQuery(gql);
      const { code, data } = await service.batchExecNGQL(
        {
          gqls: gqlList
            .filter((item) => item !== '')
            .map((item) => {
              return item.endsWith('\\') ? item.slice(0, -1) : item;
            }),
          space: this.currentSpace,
        },
        {
          trackEventConfig: {
            category: 'console',
            action: 'run_gql',
          },
        },
      );
      if (code !== 0) {
        return;
      }
      data?.forEach((item) => {
        item.id = uuidv4();
        item.space = item.data?.space;
        item.spaceVidType = spaceVidType;
      });
      const paramUpdated = gqlList.some((item) => {
        const reg = /^\s*:param/gim;
        return reg.test(item);
      });
      paramUpdated && this.getParams();
      const _results = [...(data?.reverse() || []), ...this.results];
      this.update({
        results: _results,
        currentGQL: editorValue || gql,
      });
      sessionStorage.setItem('consoleResults', JSON.stringify(_results));
    } finally {
      window.setTimeout(() => this.update({ runGQLLoading: false }), 300);
    }
  };

  getParams = async () => {
    const results = await service.execNGQL({ gql: ':params' });
    this.update({ paramsMap: results.data?.localParams || {} });
  };
  saveFavorite = async (content: string) => {
    const res = await service.saveFavorite(
      { content },
      {
        trackEventConfig: {
          category: 'console',
          action: 'save_favorite',
        },
      },
    );
    if (res.code === 0) {
      message.success(intl.get('sketch.saveSuccess'));
    }
  };
  deleteFavorite = async (id?: string) => {
    const res = id !== undefined ? await service.deleteFavorite(id) : await service.deleteAllFavorites();
    if (res.code === 0) {
      message.success(intl.get('common.deleteSuccess'));
    }
  };

  getFavoriteList = async () => {
    const res = await service.getFavoriteList();
    if (res.code === 0) {
      this.update({
        favorites: res.data.items,
      });
    }
    return res;
  };

  calcCompletions(cm: any) {
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);
    const str = token.string;
    if (str === '') {
      this.resetCompletion()
      return;
    }

    const list = [];
    keyWords.forEach(item => {
      if (item.indexOf(str) === 0&&item!==str) {
        list.push({
          type: 'keyword',
          text: item,
        })
      }
    });
    operators.forEach(item => {
      if (item.indexOf(str) === 0&&item!==str) {
        list.push({
          type: 'operator',
          text: item,
        })
      }
    });
    ban.forEach(item => {
      if (item.indexOf(str) === 0&&item!==str) {
        list.push({
          type: 'ban',
          text: item,
        })
      }
    });
    this.completionList = list.slice(0, 5);
    this.showCompletion = !!list.length;
    this.activeCompletionIndex = 0;
  }

  insertCompletion(cm,index:number=this.activeCompletionIndex) {
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);
    const item = [...this.completionList, ...gpt.completionList][index];
    const start = item.type === 'copilot' ? { ...cur } : { line: cur.line, ch: token.start };
    const end =  item.type === 'copilot' ? cur : { line: cur.line, ch: token.end };
    cm.replaceRange(item.text,start,end, 'complete');
    cm.scrollIntoView();
  }

  resetCompletion() {
     this.update({
      showCompletion: false,
      completionList: [],
      activeCompletionIndex: 0,
     })
    gpt.update({
      completionList: [],
    })
  }

  addKeyboardEvent() {
    document.addEventListener('keyup', (e) => {
      if (!this.showCompletion) return;
      e.preventDefault();
      if (e.key === 'ArrowUp' && this.activeCompletionIndex > 0) {
        this.activeCompletionIndex = this.activeCompletionIndex - 1;
      }
      if (e.key === 'ArrowDown' && this.activeCompletionIndex < this.completionList.length+gpt.completionList.length - 1) {
        this.activeCompletionIndex = this.activeCompletionIndex + 1;
      }
    })
  }
}

const consoleStore = new ConsoleStore();

export default consoleStore;
