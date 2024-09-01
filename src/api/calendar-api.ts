import type { CalendarEvent, CalendarEventCd, CalendarGoal, CalendarGoalUsers } from '../types/calendar';
import { deepCopy } from 'utils/deep-copy';
import { commonApi } from './common-api';
import moment from 'moment';
import converter from 'xml-js';
import { transFormData } from 'utils/transFromData';

class CalendarApi {

  async getEventsCd(): Promise<CalendarEventCd[]> {
    let eventCdList: CalendarEventCd[] = [];
     await commonApi("get","/schedule/getScheduleCd", undefined).then((response)=>{
      response.map((item: any)=>{
        eventCdList.push({
          schdlCategory: item.schdlCategory,
          schdlColor: "#" + item.schdlColor,
          schdlCd: item.schdlCd,
          schdlIcon: item.schdlIcon,
          schdlIconColor: "#" + item.schdlIconColor
        })
      })
    });
    return Promise.resolve(deepCopy(eventCdList));
  }

  async getEvents(date: string, filterList: number[]): Promise<CalendarEvent[]> {
    let eventList: CalendarEvent[] = [];
     await commonApi("get","/schedule/selectSchedule", {
      calendarStartDate: date,
      schdlCdFilter: filterList
    }).then(async (response)=>{
      response = response ? response : [];
      response.map((item : any)=>{
        eventList.push({
          seq: item.seq,
          userSid: item.userSid,
          loc: item.loc,
          content: item.content,
          startDt: new Date(item.startDt).getTime(),
          start: new Date(item.startDt).getTime(),
          end: new Date(moment(item.endDt).add(1, 'days').format()).getTime(),
          endDt: new Date(item.endDt).getTime(),
          allDay: item.allDay,
          regDt: item.regDt,
          regId: item.regId,
          updDt: item.updDt,
          updId: item.updId,
          color: "#"+item.schdlColor,
          schdlCd: item.schdlCd,
          schdlNm: item.schdlNm,
          schdlIcon: item.schdlIcon,
          schdlIconColor: "#"+item.schdlIconColor,
          schdlCategory: item.schdlCategory
        });
      })
    });
    const holiday = await this.getholidays(date);
    //날짜 정해서 매년 + 
    const addDays : {title:string, day: string}[]= [];
    let ceilDay;
    let floorDay;
    let thisDay;
    if(process.env.NEXT_PUBLIC_MYJ_DATE){
      let nowCount = moment(new Date(date)).diff(moment(new Date(process.env.NEXT_PUBLIC_MYJ_DATE)), 'days') + 2;
      let ceil = Math.ceil(nowCount/100)*100;
      ceilDay = moment(new Date(process.env.NEXT_PUBLIC_MYJ_DATE)).add(ceil - 1, 'days').format("YYYY-MM-DD");
      let floor = Math.floor(nowCount/100)*100;
      floorDay = moment(new Date(process.env.NEXT_PUBLIC_MYJ_DATE)).add(floor - 1, 'days').format("YYYY-MM-DD");
      thisDay = moment(new Date(process.env.NEXT_PUBLIC_MYJ_DATE)).year(moment(new Date()).year()).format("YYYY-MM-DD");
      let year = moment(new Date()).year() - moment(new Date(process.env.NEXT_PUBLIC_MYJ_DATE)).year();
      addDays.push({title:ceil + "일", day:ceilDay});
      addDays.push({title:floor + "일", day:floorDay});
      addDays.push({title:"MYJ " + year + "주년", day:thisDay});
    }
    addDays.forEach((item) => {
      let eventDay: CalendarEvent = {
        seq: 0,
        userSid: 0,
        startDt: new Date(item.day).getTime(),
        start: new Date(item.day).getTime(),
        end: new Date(moment(item.day).add(1, 'days').format("YYYY-MM-DD")).getTime(),
        endDt: new Date(item.day).getTime(),
        loc: '',
        content: '',
        schdlNm: item.title,
        schdlCategory: 'MYJ 기념일',
        color: '#e089f0',
        schdlCd: 6,
        schdlIcon: '',
        allDay: true,
        schdlIconColor: '#ffffff',
        regDt: new Date().toISOString(),
        regId: 0,
        updDt: new Date().toISOString(),
        updId: 0,
      }
      eventList.push(eventDay);
    });
    return Promise.resolve(deepCopy(eventList.concat(holiday)));
  }

  createEvent(data: {schdlCd: number, schdlNm: string, loc: string, content: string, startDt: string, endDt: string, allDay: boolean}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("post","/schedule/insertSchedule",undefined, transFormData(data),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          resolve(response);
        })
        
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  updateEvent(data: {seq: number, schdlCd: number, schdlNm: string, loc: string, content: string, startDt: string, endDt: string, allDay: boolean}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("put","/schedule/updateSchedule",undefined, transFormData(data),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          resolve(response);
        })
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  deleteEvent(eventId: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("get","/schedule/deleteSchedule", {
          seq: eventId
        }).then((response)=>{
          resolve(response);
        })
        
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }


  async getholidays (calendarStartDate: string): Promise<CalendarEvent[]> {
    let holidays: any[] = [];
    await commonApi("get","/schedule/getholidayList",{
      'solYear' : moment(calendarStartDate).format("YYYY"),
      'solMonth' : moment(calendarStartDate).format("MM")
    }).then((response: string)=>{
      if(response) {
        response.split('<?xml').forEach((item,index)=>{
          const xmlResponse: any = converter.xml2js('<?xml'+item);
          if(xmlResponse.elements){
            const list : any[] = xmlResponse.elements[0].elements[1].elements[0].elements
            if(list) {
              let itemBefore: any;
              let holiday: any;
              let oneday: any;
              list.map((item1: any, index1: number)=>{
                var title = item1.elements[1].elements[0].text;
                var startDate = item1.elements[3].elements[0].text.substring(0,4) + "-" + item1.elements[3].elements[0].text.substring(4,6) + "-" + item1.elements[3].elements[0].text.substring(6,8);
                var endDate = moment(moment(startDate).add(1, 'days')).format('YYYY-MM-DD');
                var originalEndDate = moment(startDate).format('YYYY-MM-DD');
                oneday = true;
                if(itemBefore == title) {
                  oneday = false;
                  startDate = holidays[holidays.length-1].start;
                  holidays.pop();
                }
                let holiday: CalendarEvent = {
                  seq: 0,
                  userSid: 0,
                  startDt: new Date(startDate).getTime(),
                  start: new Date(startDate).getTime(),
                  end: new Date(endDate).getTime(),
                  endDt: new Date(originalEndDate).getTime(),
                  loc: '',
                  content: '',
                  schdlNm: title,
                  schdlCategory: '공휴일',
                  color: '#f26363',
                  schdlCd: 5,
                  schdlIcon: 'fas fa-hand-peace',
                  allDay: true,
                  schdlIconColor: '#ffffff',
                  regDt: new Date().toISOString(),
                  regId: 0,
                  updDt: new Date().toISOString(),
                  updId: 0,
                }
                itemBefore = holiday.schdlNm;
                holidays.push(holiday);
              })
            }
          }
        })
      }
    })
    return holidays;
  }

  async getGoals(date: string): Promise<CalendarGoalUsers> {
    let eventCdList: CalendarGoalUsers = {};
     await commonApi("get","/schedule/selectScheduelGoal", {date: date}).then((response)=>{
      response.map((item : CalendarGoal)=>{
        if(item.goalUser === "MinNyeon") {
          eventCdList.MinNyeon = item;
        }
        else if(item.goalUser === "YeonJin") {
          eventCdList.YeonJin = item;
        }
      })
    });
    return Promise.resolve(deepCopy(eventCdList));
  }

  createGoal(data: { goalDate: string, goalContent: string, goalUser: string}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("post","/schedule/insertScheduleGoal",undefined, transFormData(data),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          resolve(response);
        })
        
      } catch (err) {
        console.error('[Calendar Goal Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  updateGoal(data: { goalSid: number, goalDate: string, goalContent: string, goalUser: string}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await commonApi("put","/schedule/updateScheduleGoal",undefined, transFormData(data),{'Content-Type': `multipart/form-data;`}).then((response)=>{
          resolve(response);
        })
        
      } catch (err) {
        console.error('[Calendar Goal Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

}

export const calendarApi = new CalendarApi();
