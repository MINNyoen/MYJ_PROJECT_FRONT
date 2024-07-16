export interface Login {
  loginId: string;
  pwd: string;
  remember: boolean;
}

export interface User {
  userSid?: number;
  loginId: string;
  pwd: string;
  userNm: string;
  birthDt: Date;
  avatar: string;
}

