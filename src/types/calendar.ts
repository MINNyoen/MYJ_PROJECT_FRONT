export interface CalendarEvent {
  //추가
  seq: number;
  userSid: number;
  content: string;
  loc: string;
  allDay: boolean;

  schdlNm: string;
  schdlCategory: string;
  schdlCd: number;
  color: string;
  schdlIcon: string;
  schdlIconColor: string;
  
  startDt: number;
  endDt: number;

  start: number;
  end: number;

  regDt: string;
  regId: number;
  updDt: string;
  updId: number;
  
}

export interface CalendarEventCd {
  schdlCategory: string;
  schdlColor: string;
  schdlCd: number;
  schdlIcon: string;
  schdlIconColor: string;
}

export interface CalendarGoal {
  goalContent?: string;
  goalDate : string;
  goalSid : number;
  goalUser : string;
}

export interface CalendarGoalUsers {
  MinNyeon?: CalendarGoal;
  YeonJin?: CalendarGoal;
}

export type CalendarView =
  | 'dayGridMonth'
  | 'timeGridWeek'
  | 'timeGridDay'
  | 'listWeek';
