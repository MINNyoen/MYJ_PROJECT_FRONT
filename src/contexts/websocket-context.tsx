import { createContext, useEffect, useRef, useState } from 'react';
import type { FC, MutableRefObject, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Stomp } from '@stomp/stompjs';
import { useAuth } from 'hooks/use-auth';



export interface WebsocketContextValue {
  stompClient?: MutableRefObject<any>;
  connectWebSubscribe?: (subscribeUrl: string, subscribeCallbackFC: (response: any) => void) => string;
  connectWebUnSubscribe?: (id: string, stompClient?: MutableRefObject<any>) => void;
}

interface WebsocketProviderProps {
  children?: ReactNode;
}

export const WebsocketContext = createContext<WebsocketContextValue>({
  stompClient: undefined,
  connectWebSubscribe : undefined,
  connectWebUnSubscribe : undefined
});

export const WebsocketProvider: FC<WebsocketProviderProps> = (props) => {
  const { children } = props;
  const auth = useAuth();
  const [onConnect, setOnConnect] = useState<Boolean>(false);
  // STOMP 클라이언트를 위한 ref. 웹소켓 연결을 유지하기 위해 사용
  const stompClient = useRef<any>(null);

  // 웹소켓 연결 설정
  const connectWebSubscribe = (subscribeUrl: string, subscribeCallbackFC : (response: any) => void) => {
    let connectInfo = {id : ""};
    if(stompClient.current && stompClient.current.active) {
      connectInfo = stompClient.current.subscribe(subscribeUrl, subscribeCallbackFC);
    }
    return connectInfo?.id;
  };

  // 웹소켓 연결 해제
  const connectWebUnSubscribe = (id: string) => {
      stompClient.current && stompClient.current.unsubscribe(id);
  };
  
  const connectWs = async () => {
    if(auth.isAuthenticated) {
      const socket = process.env.NEXT_PUBLIC_BACKEND_URL_WS && new WebSocket(process.env.NEXT_PUBLIC_BACKEND_URL_WS);

      stompClient.current = Stomp.over(socket);
      stompClient.current.connect({}, () => {
        setOnConnect(true);
      });
    }
    else {
      stompClient.current && stompClient.current.disconnect();
    }
  };

  useEffect(
     () => {
      connectWs();
    },[auth.isAuthenticated]
  );

  return ((auth.isAuthenticated ? onConnect : true) && (
    <WebsocketContext.Provider
      value={{
        stompClient,
        connectWebSubscribe,
        connectWebUnSubscribe
      }}
    >
      {children}
    </WebsocketContext.Provider>
    )
  );
};

WebsocketProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const WebsocketConsumer = WebsocketContext.Consumer;
