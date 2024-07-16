import type { Board } from 'types/board';

const now = new Date();

class BoardsApi {
  getBoards(): Promise<Board[]> {
    return Promise.resolve([]);
  }
}

export const BoardApi = new BoardsApi();
