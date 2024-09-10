import type { Board } from 'types/board';
import { deepCopy } from 'utils/deep-copy';
import { commonApi } from './common-api';
import { transFormData } from 'utils/transFromData';
import { Paging } from 'types/board copy';


class BoardApi {

  async getBoard(keyWord : string, type: string, paging: Paging): Promise<Board[]> {
    let boardList : Board[] = [];
    await commonApi("get","/board/getBoardList",{
      keyWord: keyWord,
      type: type
    }).then((response)=>{
      boardList = response;
   });
   return Promise.resolve(deepCopy(boardList));
  }

  async getBoardDetail(seq : string): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("get","/board/getBoardList",{seq: seq}).then((response)=>{
          return Promise.resolve(deepCopy(response));
       });
      } catch (err) {
        console.error('[Board Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async boardInsert(board : Board): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("post","/board/boardInsert", undefined, transFormData(board),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          return Promise.resolve(deepCopy(response));
       });
      } catch (err) {
        console.error('[Board Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async boardUpdate(board : Board): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("put","/board/boardUpdate", undefined, transFormData(board),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          return Promise.resolve(deepCopy(response));
       });
      } catch (err) {
        console.error('[Board Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
  
  async boardDelete(seq : string): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("delete","/board/boardDelete",{seq: seq}).then((response)=>{
          return Promise.resolve(deepCopy(response));
       });
      } catch (err) {
        console.error('[Board Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async plusView(seq : string): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("put","/board/plusView", {seq: seq}).then((response)=>{
          return Promise.resolve(deepCopy(response));
       });
      } catch (err) {
        console.error('[Board Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async boardFiledownload(fileSeq : string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("get","/board/filedownload", {fileSeq: fileSeq});
      } catch (err) {
        console.error('[Board Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

}

export const boardApi = new BoardApi();
