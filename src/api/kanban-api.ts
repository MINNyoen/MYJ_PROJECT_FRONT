import type { Board, Card, CheckItem, Checklist, Column, Comment } from 'types/kanban';
import { deepCopy } from 'utils/deep-copy';
import { commonApi } from './common-api';
import { transFormData } from 'utils/transFromData';

let board : Board = {
  cards: [],
  columns: [],
  members: []
};

const dataSetting = (response : any) => {
  board = {
    cards: [],
    columns: [],
    members: []
  };
  response.cards.map((item: any)=>{
    if(item != undefined) {
      let checkLists : Checklist[] = [];
      if(item.checklists !== null) {
        item.checklists.map((checkList : any)=> {
          let checkItems : CheckItem[] = [];
          if(checkList.checkItems !== null) {
            checkList.checkItems.map((checkItem : any)=>{
              checkItems.push({
                id: checkItem.id.toString(),
                checklistId: checkItem.checklistId.toString(),
                name: checkItem.name,
                state: checkItem.state
              })
            })
          }
          checkLists.push({
            id: checkList.id.toString(),
            checkItems : checkItems,
            name: checkList.name
          })
        })
      }
      board.cards.push({
        id: item.id.toString(),
        columnId: item.columnId.toString(),
        attachments: item.attachments === "" ? [] : item.attachments.split(","),
        comments: item.comments === null ? [] : item.comments,
        cover: item.cover,
        description: item.description,
        due: item.due,
        isSubscribed: item.isSubscribed,
        labels: item.labels === "" ? [] : item.labels.split(","),
        memberIds: item.memberIds === "" ? [] : item.memberIds.split(","),
        name: item.name,
        checklists: checkLists
      })
    }
  });
  response.columns.map((item: any)=>{
    board.columns.push({
      id: item.id.toString(),
      cardIds: item.cardIds === "" ? [] : item.cardIds.split(","),
      name: item.name
    })
  });
  response.members.map((item: any)=>{
    board.members.push({
      id: item.userSid.toString(),
      avatar: null,
      name: item.userName
    })
  });
  return board;
}

// You'll see here that we start with a deep clone of the board.
// The reason for that is to create a db session wannabe strategy.
// If something fails, we do not affect the original data until everything worked as expected.
const now = new Date();

class KanbanApi {

  async getBoard(): Promise<Board> {
    await commonApi("get","/kanban/getKanbanList").then((response)=>{
      dataSetting(response);
   });
    return Promise.resolve(deepCopy(board));
  }

  createColumn({ name }: { name: string }): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {
        // Create the new column
        const column: Column = {
          id: '',
          name,
          cardIds: []
        };
        await commonApi("post","/kanban/insertColumn", undefined, transFormData(column),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          dataSetting(response);
        })
        
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
      resolve(deepCopy(board));
    });
  }

  updateColumn({
    column,
    update
  }: { column: Column; update: { name: string; }; }): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {
        let columnCopy = deepCopy(column);

        if(columnCopy != undefined) {
        // Update the column
        Object.assign(columnCopy, update);
        }

        await commonApi("put","/kanban/updateColumn", undefined, transFormData(columnCopy),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          dataSetting(response);
        })
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
      resolve(deepCopy(board));
    });
  }

  deleteColumn(columnId: string, cardIds: string[]): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("get","/kanban/deleteColumn",{
          columnId: columnId,
          cardIds: cardIds.toString()
        }).then((response)=>{
          dataSetting(response);
        })
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
      resolve(deepCopy(board));
    });
  }

  createCard({
    column,
    name
  }: { column: Column; name: string; }): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {

        // Find the column where the new card will be added
        const columnCopy = deepCopy(column);

        if (!column) {
          reject(new Error('Column not found'));
          return;
        }

        // Create the new card
        const card: Card | any = {
          attachments: '',
          columnId: columnCopy.id,
          cover: '',
          description: '',
          isSubscribed: false,
          labels: '',
          memberIds: '',
          name
        };

        await commonApi("post","/kanban/insertCard", undefined, transFormData(card), {'Content-Type': `multipart/form-data;`}).then((response)=>{
          columnCopy.cardIds.push(response.cardId);
        });

        // Create the new Column
        const columnData: Column | any = {
          id : columnCopy.id,
          cardIds : columnCopy.cardIds.toString(),
          name : columnCopy.name
        };

        await commonApi("put","/kanban/updateColumn", undefined, transFormData(columnData), {'Content-Type': `multipart/form-data;`}).then((response)=>{
          dataSetting(response);
        });

      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
      resolve(deepCopy(board));
    });
  }

  updateCard({ card, update }: {
    card: Card;
    update: {
      name?: string;
      description?: string;
      isSubscribed?: boolean;
      labels?: string[];
    }
  }): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {

        Object.assign(card, update);

        // Create the new card
        const cardData: Card | any = {
          id: card.id,
          attachments: card.attachments.toString(),
          columnId: card.columnId,
          cover: card.cover,
          description: card.description,
          isSubscribed: card.isSubscribed,
          labels: card.labels.toString(),
          memberIds: card.memberIds.toString(),
          name: card.name
        };

        await commonApi("put","/kanban/updateCard", undefined, transFormData(cardData),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          dataSetting(response);
        })

      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
      resolve(deepCopy(board));
    });
  }

  moveCard({
    card,
    position,
    firstColumn,
    secondColumn,
    columnId
  }: { card: Card; position: number; firstColumn: Column; secondColumn: Column; columnId?: string;}): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {

        // Find the source column of the card
        const sourceList = deepCopy(firstColumn);

        // Remove the cardId reference from the source list
        sourceList.cardIds = sourceList.cardIds.filter((_cardId: string) => _cardId !== card.id);

        if (columnId) {
          // Find the destination column for the card
          const destinationList = deepCopy(secondColumn);

          // Add the cardId reference to the destination list
          destinationList.cardIds.splice(position, 0, card.id);

          const newColumnData: Column | any = {
            id:destinationList.id,
            name:destinationList.name,
            cardIds:destinationList.cardIds.toString()
          }

          await commonApi("put","/kanban/updateColumn", undefined, transFormData(newColumnData),{'Content-Type': `multipart/form-data;`});

          const pastColumnData: Column | any = {
            id:sourceList.id,
            name:sourceList.name,
            cardIds:sourceList.cardIds.toString()
          }

          await commonApi("put","/kanban/updateColumn", undefined, transFormData(pastColumnData),{'Content-Type': `multipart/form-data;`});

          const cardData: Card | any = {
            id: card.id,
            attachments: card.attachments.toString(),
            columnId: destinationList.id,
            cover: card.cover,
            description: card.description,
            isSubscribed: card.isSubscribed,
            labels: card.labels.toString(),
            memberIds: card.memberIds.toString(),
            name: card.name
          };

          await commonApi("put","/kanban/updateCard", undefined, transFormData(cardData),{'Content-Type': `multipart/form-data;`}).then((response)=>{
            dataSetting(response);
          })
        } else {
          // If columnId is not provided, it means that we move the card in the same list
          sourceList.cardIds.splice(position, 0, card.id);

          const columnData: Column | any = {
            id:sourceList.id,
            name:sourceList.name,
            cardIds:sourceList.cardIds.toString()
          }

          await commonApi("put","/kanban/updateColumn", undefined, transFormData(columnData),{'Content-Type': `multipart/form-data;`}).then((response)=>{
            dataSetting(response);
          })
        }
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
      resolve(deepCopy(board));
    });
  }

  deleteCard(card: Card, column: Column): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {
        // Make a deep copy
        const clonedCard: Card = deepCopy(card);
        const checkListIds : string[] = [];
        card.checklists.map((checklist)=>{
          checkListIds.push(checklist.id);
        });

        // Remove the card from board
        await commonApi("get","/kanban/deleteCard",{
          cardId: clonedCard.id,
          checkListIds: checkListIds.toString()
        });

        // If for some reason it does not exist, there's no problem. Maybe something broke before.
        const cloneColumn = deepCopy(column);
        if (cloneColumn) {
          cloneColumn.cardIds = cloneColumn.cardIds.filter((_cardId: string) => _cardId !== card.id);
        }

        const columnData: Column | any = {
          id:column.id,
          name:column.name,
          cardIds:cloneColumn.cardIds.toString()
        }

        await commonApi("put","/kanban/updateColumn", undefined, transFormData(columnData),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          dataSetting(response);
        })

      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
      resolve(deepCopy(board));
    });
  }

  addComment({ card, message }: { card: Card; message: string; }): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {

        // Create the new comment
        const comment = {
          cardId: card.id,
          message
        };

        await commonApi("post","/kanban/addComment", undefined, transFormData(comment),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          dataSetting(response);
        })

      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
      resolve(deepCopy(board));
    });
  }

  addChecklist({ card, name }: { card: Card; name: string; }): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {

        // Create the new checklist
        const checklist: Checklist | any = {
          cardId: card.id,
          name
        };

        await commonApi("post","/kanban/addChecklist", undefined, transFormData(checklist),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          dataSetting(response);
        })
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
      resolve(deepCopy(board));
    });
  }

  updateChecklist({
    card,
    checklistId,
    update
  }: { card: Card; checklistId: string; update: { name: string }; }): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {

        // Create the new checklist
        const checklist: Checklist | any = {
          id: checklistId,
          cardId: card.id,
          name: update.name
        };

        await commonApi("put","/kanban/updateChecklist", undefined, transFormData(checklist),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          dataSetting(response);
        })

      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
      resolve(deepCopy(board));
    });
  }

  deleteChecklist({
    checklistId
  }: {checklistId: string; }): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {

        await commonApi("delete","/kanban/deleteChecklist", {checklistId: checklistId}).then((response)=>{
          dataSetting(response);
        })

      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
      resolve(deepCopy(board));
    });
  }

  addCheckItem({
    checklistId,
    name
  }: {checklistId: string; name: string; }): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {
        // Create the new check item
        const checkItem: CheckItem | any = {
          checklistId,
          name,
          state: 'incomplete'
        };

        await commonApi("post","/kanban/addCheckItem", undefined, transFormData(checkItem),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          dataSetting(response);
        })

      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
      resolve(deepCopy(board));
    });
  }

  updateCheckItem({
    cardId,
    checklistId,
    checkItemId,
    update
  }: {
    cardId: string;
    checklistId: string;
    checkItemId: string;
    update: {
      name?: string;
      state?: 'complete' | 'incomplete';
    };
  }): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {

        // Create the new check item
        const checkItem: CheckItem | any = {
          id: checkItemId,
          checklistId,
          name: update.name,
          state: update.state
        };

        await commonApi("put","/kanban/updateCheckItem", undefined, transFormData(checkItem),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          dataSetting(response);
        })

      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
      resolve(deepCopy(board));
    });
  }

  deleteCheckItem({
    checkItemId
  }: {
    checkItemId: string;
  }): Promise<Board> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("get","/kanban/deleteCheckItem", {id: checkItemId}).then((response)=>{
          dataSetting(response);
        })
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
      resolve(deepCopy(board));
    });
  }
}

export const kanbanApi = new KanbanApi();
