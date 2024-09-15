import type { Board } from 'types/board';
import { deepCopy } from 'utils/deep-copy';
import { commonApi } from './common-api';
import { transFormData } from 'utils/transFromData';
import { Paging } from 'types/paging';


class BoardApi {

  async getBoard(keyWord : string | undefined, type: string, paging: Paging): Promise<{boardList: Board[], paging: Paging}> {
    let boardList : Board[] = [];
    await commonApi("get","/board/getBoardList",{...paging, 
      keyWord: keyWord,
      type: type
    }).then((response)=>{
      boardList = response.boardList;
      paging = response.paging;
   });
   return Promise.resolve({boardList, paging});
  }

  async getBoardDetail(seq : string): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("get","/board/boardDetail",{seq: seq}).then((response)=>{
          return resolve(deepCopy(response.board));
       });
      } catch (err) {
        console.error('[Board Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async boardInsert(title : string, content: string, files : File[]): Promise<number> {
    return new Promise(async (resolve, reject) => {
      let board = {title, content}
      let formData = transFormData(board);
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      try {
        await commonApi("post","/board/boardInsert", undefined, formData,{'Content-Type': `multipart/form-data;`}).then((response)=>{
          return resolve(deepCopy(response));
       });
      } catch (err) {
        console.error('[Board Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async boardUpdate(seq: number, title : string, content: string, files : File[], deleteFileList: number[]): Promise<number> {
    return new Promise(async (resolve, reject) => {
      let board = {seq, title, content, deleteFileList}
      let formData = transFormData(board);
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      try {
        await commonApi("put","/board/boardUpdate", undefined,formData,{'Content-Type': `multipart/form-data;`}).then((response)=>{
          return resolve(deepCopy(response));
       });
      } catch (err) {
        console.error('[Board Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
  
  async boardDelete(seq : string): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("delete","/board/boardDelete",{seq: seq}).then((response)=>{
          return resolve(deepCopy(response));
       });
      } catch (err) {
        console.error('[Board Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const boardApi = new BoardApi();
