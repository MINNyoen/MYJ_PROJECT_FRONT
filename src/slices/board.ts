import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { boardApi } from 'api/board-api';
import type { AppThunk } from 'store';
import type { Board } from '../types/board';
import { Paging } from 'types/paging';

interface BoardState {
  boardList: Board[];
  selectedBoard: Board | undefined;
  boardPaging: Paging;
}

const initialState: BoardState = {
  boardList: [],
  selectedBoard: undefined,
  boardPaging: {
    page: 1,
    recordSize: 10,
    pageSize: 5,
    totalRow: 0,
    totalPage: 0,
    startPage: 0,
    endPage: 0
  }
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
    },
    initBoardDetail(
      state: BoardState,
      action: PayloadAction<undefined>
    ): void {
      state.selectedBoard = action.payload;
    },
    pagingUpdate(
      state: BoardState,
      action: PayloadAction<Paging>
    ): void {
      state.boardPaging = action.payload;
    }
  }
});

export const { reducer } = slice;

export const getBoard = (keyWord : string | undefined, type: string, paging: Paging): AppThunk => async (dispatch): Promise<void> => {
  const data = await boardApi.getBoard(keyWord, type, paging);
  await dispatch(slice.actions.getBoard(data.boardList));
  await dispatch(slice.actions.pagingUpdate(data.paging));
};

export const getBoardDetail = (seq : string): AppThunk => async (dispatch): Promise<void> => {
  const data = await boardApi.getBoardDetail(seq);
  await dispatch(slice.actions.boardDetail(data));
};

export const initBoardDetail = (): AppThunk => async (dispatch): Promise<void> => {
  await dispatch(slice.actions.initBoardDetail(undefined));
};