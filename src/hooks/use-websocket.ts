import { useContext } from 'react';
import { WebsocketContext } from 'contexts/websocket-context';
import type { WebsocketContextValue } from 'contexts/websocket-context';

export const useWebSocket = (): WebsocketContextValue => useContext(WebsocketContext);
