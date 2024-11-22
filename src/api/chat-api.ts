import type { Contact, Thread, Message } from 'types/chat';
import { deepCopy } from 'utils/deep-copy';
import { commonApi } from 'utils/common-api';
import { User } from 'types/user';
import { MutableRefObject } from 'react';



class ChatApi {
  getContacts(query?: string): Promise<Contact[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const contactsList : Contact[] = [];
        await commonApi("get","/user/getUserList",{query: query}).then((response)=>{
          response.map((item: any)=>{
            const contact : Contact = {
              userSid: item.userSid,
              avatar: process.env.NEXT_PUBLIC_BACKEND_URL + item.avatar,
              isActive: item.loginState,
              lastActivity: item.lastLogoutDt,
              userNm: item.userNm
            }
            contactsList.push(contact);
          })
        });
        resolve(deepCopy(contactsList));
      } catch (err) {
        console.error('[Chat Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  getThreads(): Promise<Thread[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const chatThreadsList : Thread[] = [];
        await commonApi("get","/chat/getChatThreads").then((response)=>{
          response.map((item: any)=>{
            const messages : Message[] = [];
            item.messages.map((rMessage: any) => {
              const message : Message = {
                id: rMessage.chatId,
                body: rMessage.body,
                contentType: rMessage.type,
                createdAt: new Date(rMessage.regDt).getTime(),
                authorId: rMessage.regId
              }
              messages.push(message);
            })

            const participants : Contact[] = [];
            item.participants.map((rParticipant: any) => {
              const participant : Contact = {
                userSid: rParticipant.userSid,
                avatar: rParticipant.avatar ? process.env.NEXT_PUBLIC_BACKEND_URL + rParticipant.avatar : undefined,
                isActive: rParticipant.loginState,
                lastActivity: new Date(rParticipant.lastActivity).getTime(),
                userNm: rParticipant.userNm
              }
              participants.push(participant);
            })
            
            const chatThread : Thread = {
              roomId: item.roomId,
              messages: messages,
              participants: participants,
              type: participants.length > 2 ? 'ONE_TO_ONE' : 'GROUP',
              unreadCount: item.unreadCount ? item.unreadCount : 0
            }
            chatThreadsList.push(chatThread);
          })
        });
        resolve(deepCopy(chatThreadsList)); //chatThreadsList
      } catch (err) {
        console.error('[Chat Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  getThread(roomId: string): Promise<Thread> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("get","/chat/getChatThread",{roomId: roomId}).then((response)=>{

          const messages : Message[] = [];
          response.messages.map((rMessage: any) => {
            const message : Message = {
              id: rMessage.chatId,
              body: rMessage.body,
              contentType: rMessage.type,
              createdAt: new Date(rMessage.regDt).getTime(),
              authorId: rMessage.regId
            }
            messages.push(message);
          })

          const participants : Contact[] = [];
          response.participants.map((rParticipant: any) => {
              const participant : Contact = {
                userSid: rParticipant.userSid,
                avatar: rParticipant.avatar ? process.env.NEXT_PUBLIC_BACKEND_URL + rParticipant.avatar : undefined,
                isActive: rParticipant.loginState,
                lastActivity: new Date(rParticipant.lastActivity).getTime(),
                userNm: rParticipant.userNm
              }
              participants.push(participant);
          })

          const chatThread : Thread = {
            roomId: response.roomId.toString(),
            messages: messages,
            participants: participants,
            type: participants.length > 2 ? 'ONE_TO_ONE' : 'GROUP',
            unreadCount: response.unreadCount ? response.unreadCount : 0
          }
          resolve(deepCopy(chatThread));
        });

      } catch (err) {
        console.error('[Chat Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  markThreadAsSeen(roomId: string): Promise<true> {
    return new Promise(async (resolve, reject) => {
      try {
        // await commonApi("put","/chat/readChatThread",{roomId: roomId}).then((response)=>{
        //   if(response) {
        //     resolve(true);
        //   }
        // });
      } catch (err) {
        console.error('[Chat Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  getChatThreadByParticipants(recipientIds: string[]): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        let urlParam = "";
        recipientIds.map((recipientId, index)=> {
          urlParam += "participants=" + recipientId;
          urlParam += index === (recipientIds.length-1) ? "" : "&";
        })
        await commonApi("get","/chat/getChatThreadByParticipants?" + urlParam,{}).then((response)=>{
          if(response) {
            resolve(response.roomId);
          }
        });
      } catch (err) {
        console.error('[Chat Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }


  addMessage({
    roomId,
    recipientIds,
    body,
    user,
    stompClient
  }: { roomId: string; recipientIds?: string[]; body: string; user: User; stompClient: MutableRefObject<any>; }): Promise<Thread> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!(roomId || recipientIds)) {
          reject(new Error('Room ID or recipient IDs has to be provided'));
          return;
        }

        const message: any = {
          body,
          contentType: 'text',
          authorId: user.userSid
        };

        stompClient.current.send(`/pub/chat/createChatMessage/`+roomId, {}, JSON.stringify(message));
        
      } catch (err) {
        console.error('[Chat Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const chatApi = new ChatApi();
