import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { chatApi } from 'api/chat-api';
import { MutableRefObject } from 'react';
import type { AppThunk } from 'store';
import type { Contact, Message, Thread } from 'types/chat';
import { User } from 'types/user';
import { objFromArray } from 'utils/obj-from-array';

interface ChatState {
  activeThreadId?: string;
  contacts: {
    byId: Record<string, Contact>;
    allIds: string[];
  };
  threads: {
    byId: Record<string, Thread>;
    allIds: string[];
  };
}

const initialState: ChatState = {
  activeThreadId: undefined,
  contacts: {
    byId: {},
    allIds: []
  },
  threads: {
    byId: {},
    allIds: []
  }
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    getContacts(state: ChatState, action: PayloadAction<Contact[]>): void {
      const contacts = action.payload;

      state.contacts.byId = objFromArray(contacts, 'userSid');
      state.contacts.allIds = Object.keys(state.contacts.byId);
    },
    getThreads(state: ChatState, action: PayloadAction<Thread[]>): void {
      const threads = action.payload;

      state.threads.byId = objFromArray(threads, 'roomId');
      state.threads.allIds = Object.keys(state.threads.byId);
    },
    getThread(state: ChatState, action: PayloadAction<Thread | null>): void {
      const thread = action.payload;

      if (thread) {
        state.threads.byId[thread.roomId!] = thread;

        if (!state.threads.allIds.includes(thread.roomId!)) {
          state.threads.allIds.unshift(thread.roomId!);
        }
      }
    },
    markThreadAsSeen(state: ChatState, action: PayloadAction<string>): void {
      const threadId = action.payload;
      const thread = state.threads.byId[threadId];
    },
    setActiveThread(state: ChatState, action: PayloadAction<string | undefined>): void {
      state.activeThreadId = action.payload;
    },
    addMessage(state: ChatState,
      action: PayloadAction<{ message: Message, roomId: string }>): void {
      const { roomId, message } = action.payload;
      const thread = state.threads.byId[roomId];

      if (thread) {
        thread.messages.push(message);
      }
    }
  }
});

export const { reducer } = slice;

export const getContacts = (): AppThunk => async (dispatch): Promise<void> => {
  const data = await chatApi.getContacts();

  dispatch(slice.actions.getContacts(data));
};

export const getThreads = (): AppThunk => async (dispatch): Promise<void> => {
  const data = await chatApi.getThreads();

  dispatch(slice.actions.getThreads(data));
};

export const getThread = (threadKey: string): AppThunk => async (dispatch): Promise<string | undefined> => {
  const data = await chatApi.getThread(threadKey);

  dispatch(slice.actions.getThread(data));
  return data?.roomId;
};

export const markThreadAsSeen = (threadId: string): AppThunk => async (dispatch): Promise<void> => {
  await chatApi.markThreadAsSeen(threadId);

  dispatch(slice.actions.markThreadAsSeen(threadId));
};

export const setActiveThread = (threadId?: string): AppThunk => (dispatch): void => {
  dispatch(slice.actions.setActiveThread(threadId));
};

export const addMessage = ({
  roomId,
  recipientIds,
  body,
  user,
  stompClient
}: { roomId: string; recipientIds?: string[]; body: string; user: User; stompClient?: MutableRefObject<any> }): AppThunk => async (dispatch): Promise<string> => {

  const data = await chatApi.addMessage({
    roomId,
    recipientIds,
    body,
    user,
    stompClient
  });

  return data.roomId;
};


export const receiveMessage = ({
  roomId,
  messageId,
  body,
  contentType,
  createdAt,
  authorId
}: { roomId: string; messageId: string; body: string; contentType: string; createdAt: number; authorId: string; }, user: User): AppThunk => async (dispatch): Promise<string> => {
  
  dispatch(slice.actions.addMessage({
    roomId : roomId,
    message : {
      id: messageId,
      body,
      contentType,
      createdAt,
      authorId
    }
  }));
  
  if(Number(authorId) !== user.userSid) {
    await chatApi.markThreadAsSeen(messageId);
  }

  return roomId;
};
