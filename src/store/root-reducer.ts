import { combineReducers } from '@reduxjs/toolkit';
import { reducer as commonReducer } from 'slices/common'
import { reducer as calendarReducer } from 'slices/calendar';
import { reducer as chatReducer } from 'slices/chat';
import { reducer as kanbanReducer } from 'slices/kanban'

export const rootReducer = combineReducers({
  common: commonReducer,
  calendar: calendarReducer,
  chat: chatReducer,
  kanban: kanbanReducer
});
