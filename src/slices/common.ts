import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'store';

interface CommonState {
  isLoaded: boolean;
  authCheck: boolean;
}

const initialState: CommonState = {
  isLoaded: true,
  authCheck: false
};

const slice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    changeLoading(
      state: CommonState,
      action: PayloadAction<boolean>
    ): void {
      state.isLoaded = action.payload;
    },
    changeCheck(
      state: CommonState,
      action: PayloadAction<boolean>
    ): void {
      state.authCheck = action.payload;
    }
  }
});

export const { reducer } = slice;

export const changeLoading = (bool: boolean): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.changeLoading(bool));
};

export const changeCheck = (bool: boolean): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.changeCheck(bool));
};

