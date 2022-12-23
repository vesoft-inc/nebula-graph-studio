import { v4 as uuidv4 } from 'uuid';
import { safeParse } from './function';

interface MessageReceive {
  header: {
    msgId: string;
    sendTime: number;
  };
  body: {
    msgType: string;
    content: Record<string, unknown>;
  };
}

export const WsHeartbeatReq = '1';
export const WsHeartbeatRes = '2';

export class NgqlRunner {
  socket: WebSocket | undefined = undefined;

  socketUrl: string | URL | undefined;
  socketProtocols: string | string[] | undefined;

  socketMessageListeners: Array<(e: MessageEvent) => void> = [];

  socketIsConnecting = false;
  socketConnectingPromise: Promise<boolean> | undefined;
  socketPingTimeInterval: number | undefined;

  constructor() {
    const urlItem = localStorage.getItem('socketUrl');
    const protocolsItem = localStorage.getItem('socketProtocols');

    urlItem && (this.socketUrl = safeParse<string>(urlItem));
    protocolsItem && (this.socketProtocols = safeParse<string>(protocolsItem));
  }

  addSocketMessageListener = (listener: (e: MessageEvent) => void) => {
    this.socket?.addEventListener('message', listener);
    this.socketMessageListeners.push(listener);
  };

  rmSocketMessageListener = (listener: (e: MessageEvent) => void) => {
    this.socket?.removeEventListener('message', listener);
    this.socketMessageListeners = this.socketMessageListeners.filter(l => l !== listener);
  };

  clearSocketMessageListener = () => {
    this.socketMessageListeners.forEach((l) => {
      this.socket?.removeEventListener('message', l);
    });
    this.socketMessageListeners = [];
  };

  connect = (url: string | URL, protocols?: string | string[]) => {
    if (this.socketIsConnecting) {
      return this.socketConnectingPromise;
    }
    this.socketIsConnecting = true;
    this.socketConnectingPromise = new Promise<boolean>((resolve) => {
      const socket = new WebSocket(url, protocols);
      socket.onopen = () => {
        console.log('=====ngqlSocket open');
        this.socket = socket;
        this.socketUrl = url;
        this.socketProtocols = protocols;

        localStorage.setItem('socketUrl', JSON.stringify(url));
        protocols && localStorage.setItem('socketProtocols', JSON.stringify(protocols));

        if (this.socketPingTimeInterval) {
          clearTimeout(this.socketPingTimeInterval);
        }
        this.socketPingTimeInterval = window.setInterval(this.ping, 1000 * 30);
        this.socketIsConnecting = false;
        this.socketConnectingPromise = undefined;

        socket.onerror = undefined;
        socket.onclose = undefined;
        
        // reconnect
        this.socket.addEventListener('close', this.onDisconnect);
        this.socket.addEventListener('error', this.onDisconnect);

        resolve(true);
      };
      socket.onerror = (e) => {
        console.error('=====ngqlSocket error', e);
        this.socketIsConnecting = false;
        this.socketConnectingPromise = undefined;
        resolve(false);
      };
      socket.onclose = () => {
        console.log('=====ngqlSocket close');
        this.socket = undefined;
      };
    })
    return this.socketConnectingPromise;
  };

  reConnect = () => {
    return this.connect(this.socketUrl, this.socketProtocols);
  };

  onDisconnect = () => {
    this.socket?.removeEventListener('close', this.onDisconnect);
    this.socket?.removeEventListener('error', this.onDisconnect);
    this.clearSocketMessageListener();
    this.socket?.close();

    clearTimeout(this.socketPingTimeInterval);
    this.socketPingTimeInterval = undefined;
    this.socket = undefined;

    setTimeout(this.reConnect, 1000);
  }

  desctory = () => {
    clearTimeout(this.socketPingTimeInterval);
    this.clearSocketMessageListener();
    this.socket?.close();
    this.socket = undefined;
    this.socketUrl = undefined;
    this.socketProtocols = undefined;
  };

  ping = () => {
    this.socket?.readyState === WebSocket.OPEN && this.socket.send(WsHeartbeatReq);
  };

  runNgql = async ({ gql }: { gql: string }, _config: any) => {
    const message = {
      header: {
        msgId: uuidv4(),
        version: '1.0',
      },
      body: {
        product: 'Studio',
        msgType: 'ngql',
        content: { gql },
      },
    };

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      await this.reConnect();
    }

    return new Promise((resolve) => {
      const receiveMsg = (e: MessageEvent<string>) => {
        if (e.data === WsHeartbeatRes) {
          return;
        }
        const msgReceive = safeParse<MessageReceive>(e.data);
        if (msgReceive?.header?.msgId === message.header.msgId) {
          resolve(msgReceive.body.content);
          this.rmSocketMessageListener(receiveMsg);
        }
      };

      this.socket?.send(JSON.stringify(message));
      this.addSocketMessageListener(receiveMsg);
    });
  };
}

const ngqlRunner = new NgqlRunner();

export default ngqlRunner;
