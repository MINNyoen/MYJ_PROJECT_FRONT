import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { boardApi } from 'api/board-api';
import type { AppThunk } from 'store';
import type { Board } from '../types/board';
import { Paging } from 'types/board copy';

interface BoardState {
  boardList: Board[];
  selectedBoard: Board | undefined;
}

const initialState: BoardState = {
  boardList: [],
  selectedBoard: undefined
};

const slice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    getBoard(
      state: BoardState,
      action: PayloadAction<Board[]>
    ): void {
      state.boardList = action.payload;
    },
    boardDetail(
      state: BoardState,
      action: PayloadAction<Board>
    ): void {
      state.selectedBoard = action.payload;
    }
  }
});

export const { reducer } = slice;

export const getBoard = (keyWord : string, type: string, paging: Paging): AppThunk => async (dispatch): Promise<void> => {
  const data = await boardApi.getBoard(keyWord, type, paging);
  await dispatch(slice.actions.getBoard(data));
};

export const getBoardDetail = (seq : string): AppThunk => async (dispatch): Promise<void> => {
  const data = await boardApi.getBoardDetail(seq);
  await dispatch(slice.actions.boardDetail(data));
};