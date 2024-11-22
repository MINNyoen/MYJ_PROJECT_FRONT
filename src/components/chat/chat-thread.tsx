import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Divider } from '@mui/material';
import { addMessage, getThread, markThreadAsSeen, setActiveThread } from 'slices/chat';
import { useDispatch, useSelector } from 'store';
import type { RootState } from 'store';
import type { Thread } from 'types/chat';
import { Scrollbar } from 'components/scrollbar';
import { ChatMessageAdd } from './chat-message-add';
import { ChatMessages } from './chat-messages';
import { ChatThreadToolbar } from './chat-thread-toolbar';
import path from 'components/path.json';
import { useAuth } from 'hooks/use-auth';
import { connectWebSocket, disconnect } from 'utils/websocket-config';

interface ChatThreadProps {
  threadKey: string;
}

const threadSelector = (state: RootState): Thread | undefined => {
  const { threads, activeThreadId } = state.chat;

  return threads.byId[activeThreadId as string];
};

export const ChatThread: FC<ChatThreadProps> = (props) => {
  const { threadKey } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const thread = useSelector((state) => threadSelector(state));
  const messagesRef = useRef<any>(null);
  const { user } = useAuth();
  // STOMP 클라이언트를 위한 ref. 웹소켓 연결을 유지하기 위해 사용
  const stompClient = useRef<any>(null);

  //Subscribe한 CallbackFunction
  const connect = (response: any) => {
    console.log(response);
  };


  const getDetails = async (): Promise<void> => {
    try {

    await dispatch(getThread(threadKey));
  
    // @ts-ignore
    dispatch(setActiveThread(threadKey));
    // @ts-ignore
    dispatch(markThreadAsSeen(threadKey));
    } catch (err) {
      // If thread key is not a valid key (thread id or contact id)
      // the server throws an error, this means that the user tried a shady route
      // and we redirect them on the home view
      console.error(err);
      router.push(path.pages.minyeonjin.community.chatting).catch(console.error);
    }
  };

  useEffect(
    () => {
      connectWebSocket(stompClient, `/sub/chatroom/${threadKey}`, connect);
      getDetails();
      
      // 컴포넌트 언마운트 시 웹소켓 연결 해제
      return () => disconnect(stompClient);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [threadKey]
  );

  useEffect(() => {
      if (thread?.messages && messagesRef?.current) {
        const scrollElement = messagesRef.current.getScrollElement();

        scrollElement.scrollTop = messagesRef.current.el.scrollHeight;
      }
    },
    [thread]
  );

  const handleSendMessage = async (body: string): Promise<void> => {
    try {
      if (stompClient && thread) {
        user && await dispatch(addMessage({
          roomId: thread.roomId,
          body,
          user,
          stompClient
        }));
      }

      if (messagesRef?.current) {
        const scrollElement = messagesRef.current.getScrollElement();

        scrollElement.scrollTo({
          top: messagesRef.current.el.scrollHeight,
          behavior: 'smooth'
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflow: 'hidden'
      }}
      {...props}
    >
      <ChatThreadToolbar participants={thread?.participants ? thread?.participants : []} />
      <Box
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        <Scrollbar
          ref={messagesRef}
          sx={{ maxHeight: '100%' }}
        >
          <ChatMessages
            messages={thread?.messages || []}
            participants={thread?.participants || []}
          />
        </Scrollbar>
      </Box>
      <Divider />
      <ChatMessageAdd
        disabled={false}
        onSend={handleSendMessage}
      />
    </Box>
  );
};

ChatThread.propTypes = {
  threadKey: PropTypes.string.isRequired
};
