import { makeAutoObservable, observable } from 'mobx';
import service from '@app/config/service';
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';
import { getI18n } from '@vesoft-inc/i18n';
import { safeParse } from '@app/utils/function';
import { NgqlRes } from '@app/utils/websocket';
import { getRootStore } from '.';

const { intl } = getI18n();

export const splitQuery = (query: string) => {
  const _query = query.split('\n').filter(i => !i.trim().startsWith('//') && !i.trim().startsWith('#'));
  const result = _query.reduce((acc, cur) => {
    const { gqlList, paramList } = acc;
    const line = cur.trim();
    if(line.startsWith(':')) {
      paramList.push(line.replace(/;$/gm, ''));
    } else {
      // if line ends with `\`, then it is a multi-line query
      const last = gqlList[gqlList.length - 1];
      if(last?.endsWith('\\')) {
        gqlList[gqlList.length - 1] = gqlList[gqlList.length - 1].slice(0, -1) + line;
      } else if (last && !last.endsWith(';')) {
        gqlList[gqlList.length - 1] += ' ' + line;
      } else {
        gqlList.push(line);
      }
    }
    return acc;
  }, { gqlList: [] as string[], paramList: [] as string[] });
  return result;
};

export type HistoryResult = NgqlRes & {
  id: string;
  gql: string;
  space?: string;
  spaceVidType?: string;
}

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
  constructor() {
    makeAutoObservable(this, {
      results: observable.ref,
      currentSpace: observable,
      paramsMap: observable,
      currentGQL: observable,
      favorites: observable,
    });
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
    localStorage.setItem('currentSpace', space);
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
      const { gqlList, paramList } = splitQuery(gql);
      const { code, data } = await service.batchExecNGQL(
        {
          gqls: gqlList
            .filter((item) => item !== '')
            .map((item) => {
              return item.endsWith('\\') ? item.slice(0, -1) : item;
            }),
          paramList,
          space: this.currentSpace,
        },
        {
          trackEventConfig: {
            category: 'console',
            action: 'run_gql',
          },
        },
      );
      if(code === 0) {
        data?.forEach((item) => {
          item.id = uuidv4();
          item.space = this.currentSpace;
          item.spaceVidType = spaceVidType;
        });
        const updateQuerys = paramList.filter((item) => {
          const reg = /^\s*:params/gim;
          return !reg.test(item);
        });
        if (updateQuerys.length > 0) {
          await this.getParams();
        }
        const _results = [...data?.reverse(), ...this.results];
        this.update({
          results: _results,
          currentGQL: editorValue || gql,
        });
        sessionStorage.setItem('consoleResults', JSON.stringify(_results));
      }
    } finally {
      window.setTimeout(() => this.update({ runGQLLoading: false }), 300);
    }
  };

  getParams = async () => {
    const results = await service.execNGQL({ gql: '', paramList: [':params'] });
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
}

const consoleStore = new ConsoleStore();

export default consoleStore;
