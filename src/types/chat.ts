export interface Contact {
  userSid: string;
  avatar: string;
  isActive: boolean;
  lastActivity?: number;
  userNm: string;
}

export interface Message {
  id: string;
  attachments?: string;
  body: string;
  contentType: string;
  createdAt: number;
  authorId: string;
}

export interface Thread {
  roomId: string;
  messages: Message[];
  participants: Contact[];
  type: 'ONE_TO_ONE' | 'GROUP';
  chatUnread: number;
}
