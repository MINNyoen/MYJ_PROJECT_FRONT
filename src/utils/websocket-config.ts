import { Stomp } from '@stomp/stompjs';
import { MutableRefObject } from 'react';

  const socket = process.env.NEXT_PUBLIC_BACKEND_URL_WS && new WebSocket(process.env.NEXT_PUBLIC_BACKEND_URL_WS);

  // 웹소켓 연결 설정
  export const connectWebSocket = (stompClient: MutableRefObject<any>, subscribeUrl: string, subscribeCallbackFC: (response: any) => void) => {
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(subscribeUrl, subscribeCallbackFC);
    });
  };

  // 웹소켓 연결 해제
  export const disconnect = (stompClient: MutableRefObject<any>) => {
    if (stompClient.current) {
      stompClient.current.disconnect();
    }
  };