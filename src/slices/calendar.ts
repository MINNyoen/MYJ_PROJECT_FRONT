import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { calendarApi } from 'api/calendar-api';
import type { AppThunk } from 'store';
import type { CalendarEvent, CalendarEventCd, CalendarGoalUsers } from 'types/calendar';

interface CalendarState {
  events: CalendarEvent[];
  eventsCd: CalendarEventCd[];
  eventGoals: CalendarGoalUsers;
}

const initialState: CalendarState = {
  events: [],
  eventsCd: [],
  eventGoals: {}
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    getEventsCd(
      state: CalendarState,
      action: PayloadAction<CalendarEventCd[]>
    ): void {
      state.eventsCd = action.payload;
    },
    getGoals(
      state: CalendarState,
      action: PayloadAction<CalendarGoalUsers>
    ): void {
      state.eventGoals = action.payload;
    },
    getEvents(
      state: CalendarState,
      action: PayloadAction<CalendarEvent[]>
    ): void {
      state.events = action.payload;
    },
  }
});

export const { reducer } = slice;

export const getEventsCd = (): AppThunk => async (dispatch): Promise<void> => {
  const data = await calendarApi.getEventsCd();
  dispatch(slice.actions.getEventsCd(data));
};

export const getEvents = (date: string, filterList: number[]): AppThunk => async (dispatch): Promise<void> => {
  const data = await calendarApi.getEvents(date, filterList);
  dispatch(slice.actions.getEvents(data));
};

export const getGoals = (date: string): AppThunk => async (dispatch): Promise<void> => {
  const data = await calendarApi.getGoals(date);
  dispatch(slice.actions.getGoals(data));
};
