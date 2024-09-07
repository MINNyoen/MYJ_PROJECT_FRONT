import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { kanbanApi } from 'api/kanban-api';
import type { AppThunk } from 'store';
import type { Board, Card, Column, Member } from '../types/kanban';
import { objFromArray } from 'utils/obj-from-array';

interface KanbanState {
  columns: {
    byId: Record<string, Column>;
    allIds: string[];
  };
  cards: {
    byId: Record<string, Card>;
    allIds: string[];
  };
}

const initialState: KanbanState = {
  columns: {
    byId: {},
    allIds: []
  },
  cards: {
    byId: {},
    allIds: []
  }
};

const slice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    getBoard(
      state: KanbanState,
      action: PayloadAction<Board>
    ): void {
      const board = action.payload;

      state.columns.byId = objFromArray(board.columns);
      state.columns.allIds = Object.keys(state.columns.byId);
      state.cards.byId = objFromArray(board.cards);
      state.cards.allIds = Object.keys(state.cards.byId);
    },
    moveCard(
      state: KanbanState,
      action: PayloadAction<{ card: Card; position: number; columnId?: string }>
    ): void {
      const { card, position, columnId } = action.payload;
      const sourceColumnId = state.cards.byId[card.id].columnId;

      // Remove card from source column
      state.columns.byId[sourceColumnId].cardIds = (
        state.columns.byId[sourceColumnId].cardIds.filter((_cardId) => _cardId !== card.id)
      );

      // If columnId exists, it means that we have to add the card to the new column
      if (columnId) {
        // Change card's columnId reference
        state.cards.byId[card.id].columnId = columnId;
        // Push the cardId to the specified position
        state.columns.byId[columnId].cardIds.splice(position, 0, card.id);
      } else {
        // Push the cardId to the specified position
        state.columns.byId[sourceColumnId].cardIds.splice(position, 0, card.id);
      }
    },
  }
});

export const { reducer } = slice;

export const getBoard = (): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.getBoard();
  await dispatch(slice.actions.getBoard(data));
};

export const createColumn = (name: string): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.createColumn({ name });
  dispatch(slice.actions.getBoard(data));
};

export const updateColumn = (
  column: Column,
  update: { name: string; }
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.updateColumn({ column, update });
  dispatch(slice.actions.getBoard(data));
};

export const deleteColumn = (columnId: string, cardIds: string[]): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.deleteColumn(columnId, cardIds);
  dispatch(slice.actions.getBoard(data));
};

export const createCard = (
  column: Column,
  name: string
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.createCard({ column, name });
  dispatch(slice.actions.getBoard(data));
};

export const updateCard = (
  card: Card,
  update: {
    name?: string;
    description?: string;
    isSubscribed?: boolean;
    labels?: string[];
  }
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.updateCard({ card, update });
  dispatch(slice.actions.getBoard(data));
};

export const moveCard = (
  card: Card,
  position: number,
  firstColumn: Column,
  secondColumn: Column,
  columnId?: string
): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.moveCard({
    card,
    position,
    columnId
  }));
  const data = await kanbanApi.moveCard({ card, position, firstColumn, secondColumn, columnId, });
  dispatch(slice.actions.getBoard(data));
};

export const deleteCard = (card: Card, column: Column): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.deleteCard(card, column);
  dispatch(slice.actions.getBoard(data));
};

export const addComment = (
  card: Card,
  message: string
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.addComment({ card, message });
  dispatch(slice.actions.getBoard(data));
};

export const deleteComment = (
  commentId: string
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.deleteComment(commentId);
  dispatch(slice.actions.getBoard(data));
};

export const addChecklist = (
  card: Card,
  name: string
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.addChecklist({ card, name });
  dispatch(slice.actions.getBoard(data));
};

export const updateChecklist = (
  card: Card,
  checklistId: string,
  update: { name: string; }
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.updateChecklist({ card, checklistId, update });
  dispatch(slice.actions.getBoard(data));
};

export const deleteChecklist = (
  checklistId: string
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.deleteChecklist({ checklistId });
  dispatch(slice.actions.getBoard(data));
};

export const addCheckItem = (
  checklistId: string,
  name: string
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.addCheckItem({checklistId, name });
  dispatch(slice.actions.getBoard(data));
};

export const updateCheckItem = (
  cardId: string,
  checklistId: string,
  checkItemId: string,
  update: {
    name?: string;
    state?: 'complete' | 'incomplete';
  }
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.updateCheckItem({ cardId, checklistId, checkItemId, update });
  dispatch(slice.actions.getBoard(data));
};

export const deleteCheckItem = (
  checkItemId: string
): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.deleteCheckItem({checkItemId });
  dispatch(slice.actions.getBoard(data));
};
