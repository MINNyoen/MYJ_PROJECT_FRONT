import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import '@fullcalendar/timeline/main.css';
import { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import FullCalendar, { EventApi } from '@fullcalendar/react';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventResizeDoneArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { Box, useMediaQuery, Grid, Typography, TooltipProps, Tooltip, tooltipClasses, Grow } from '@mui/material';
import type { Theme } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { AuthGuard } from 'components/authentication/auth-guard';
import { CalendarEventDialog, CalendarFormValues } from 'components/calendar/calendar-event-dialog';
import { CalendarToolbar } from 'components/calendar/calendar-toolbar';
import { getEvents, getEventsCd, getGoals } from 'slices/calendar';
import { useDispatch, useSelector } from 'store';
import type { CalendarView } from 'types/calendar';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { MainLayout } from 'layout/main-layout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { HeartSwitch } from '@anatoliygatt/heart-switch';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import moment from 'moment';
import { calendarApi } from 'api/calendar-api';
import toast from 'react-hot-toast';
import { CheckModal } from 'components/checkModal';
import useTransition from 'next-translate/useTranslation';

const FullCalendarWrapper = styled('div')(
  ({ theme }) => ({
    marginTop: theme.spacing(3),
    '& .fc-license-message': {
      display: 'none'
    },
    '& .fc': {
      '--fc-bg-event-opacity': 1,
      '--fc-border-color': theme.palette.divider,
      '--fc-daygrid-event-dot-width': '10px',
      '--fc-event-text-color': theme.palette.primary.contrastText,
      '--fc-list-event-hover-bg-color': theme.palette.background.default,
      '--fc-neutral-bg-color': theme.palette.background.default,
      '--fc-page-bg-color': theme.palette.background.default,
      '--fc-today-bg-color': alpha(theme.palette.primary.main, 0.25),
      color: theme.palette.text.primary,
      fontFamily: theme.typography.fontFamily
    },
    '& .fc-day': {
      fontWeight: 'bold'
    },
    '& .fc-day-sun': {
      color: 'red'
    },
    '& .fc-day-sat': {
      color: 'blue'
    },
    '& .fc .fc-daygrid-day-frame': {
      height: '100%',
      minHeight: '100%'
    },
    '& .fc .fc-col-header-cell-cushion': {
      paddingBottom: '4px',
      paddingTop: '4px',
      fontSize: theme.typography.overline.fontSize,
      fontWeight: theme.typography.overline.fontWeight,
      letterSpacing: theme.typography.overline.letterSpacing,
      textTransform: theme.typography.overline.textTransform
    },
    '& .fc .fc-day-other .fc-daygrid-day-top': {
      color: theme.palette.text.secondary
    },
    '& .fc-daygrid-event': {
      borderRadius: '4px',
      padding: '0px 4px',
      fontSize: theme.typography.subtitle2.fontSize,
      fontWeight: theme.typography.subtitle2.fontWeight,
      lineHeight: theme.typography.subtitle2.lineHeight
    },
  })
);

const Calendar: NextPage = () => {
  const dispatch = useDispatch();
  const calendarRef = useRef<FullCalendar | null>(null);
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const {t} = useTransition("calendar");
  
  const { events } = useSelector((state) => state.calendar);
  const { eventsCd } = useSelector((state) => state.calendar);
  const [date, setDate] = useState<Date>(new Date(moment(new Date()).startOf("month").format()));
  const [view, setView] = useState<CalendarView>('dayGridMonth');
  const [dialog, setDialog] = useState<{isOpen: boolean, event: CalendarFormValues}>({
    isOpen: false,
    event: {}
  });
  const [sendData, setSendData] = useState<any>();
  const [checkModal, setCheckModal] = useState<boolean>(false);
  const [checkedList, setCheckedList] = useState<number[]>([1,2,3,4]);

  const unModifiedEvent = (event : EventApi) => {
    if(event.extendedProps.schdlCd >= 5) {
      event.setStart(event.extendedProps.startDt);
      event.setEnd(moment(event.extendedProps.endDt).add(1,"days").format("YYYY-MM-DD HH:mm:ss"));
      toast.error(event.extendedProps.schdlCategory +  t("CantModify"));
      return false;
    }
    return true;
  }

  useEffect(()=>{
    dispatch(getEventsCd());
  },[])
  
  useEffect(
    () => {
      dispatch(getEvents(moment(date).format('YYYY-MM-DD'),checkedList));
      dispatch(getGoals(moment(date).format('YYYY-MM')));
    },[date,checkedList]
  );

  const handleResize = useCallback(
    () => {
      const calendarEl = calendarRef.current;

      if (calendarEl) {
        const calendarApi = calendarEl.getApi();
        const newView = 'dayGridMonth';

        calendarApi.changeView(newView);
        setView(newView);
      }
    },
    [calendarRef, smDown]
  );

  useEffect(
    () => {
      handleResize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [smDown]
  );

  const getEventList = () => {
    dispatch(getEvents(moment(date).format('YYYY-MM-DD'),checkedList));
  }

  const handleViewChange = (newView: CalendarView): void => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleDatePrev = (): void => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleDateNext = (): void => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleAddClick = (): void => {
    setDialog({
      isOpen: true,
      event: {
        allDay: true,
        startDt: new Date(),
        endDt: new Date()
      }
    });
  };

  const handleRangeSelect = (arg: DateSelectArg): void => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.unselect();
    }

    setDialog({
      isOpen: true,
      event: {
        allDay: true,
        startDt: arg.start,
        endDt: arg.end
      }
    });
  };

  const handleEventSelect = (arg: EventClickArg): void => {
    unModifiedEvent(arg.event) &&
    setDialog({
      isOpen: true,
      event: {
        seq: arg.event._def.extendedProps.seq,
        schdlNm: arg.event._def.extendedProps.schdlNm,
        schdlCd: arg.event._def.extendedProps.schdlCd,
        loc: arg.event._def.extendedProps.loc,
        allDay: arg.event._def.allDay,
        startDt: arg.event.start,
        endDt: arg.event.end,
        content: arg.event._def.extendedProps.content
      }
    });
  };

  const handleEventResize = async (arg: EventResizeDoneArg): Promise<void> => {
    const { event } = arg;
    if(unModifiedEvent(event)){
      event.end?.setHours(event.end.getHours() - 24);
      const sendData = {
        seq: event.extendedProps.seq,
        schdlCd: event.extendedProps.schdlCd, 
        schdlNm: event.extendedProps.schdlNm, 
        loc: event.extendedProps.loc, 
        content: event.extendedProps.content,
        startDt: moment(event.start).format("YYYY-MM-DD HH:mm:ss"),
        endDt: moment(event.end).add(-1, 'day').format("YYYY-MM-DD HH:mm:ss"), 
        allDay: event.allDay
      }
      setSendData(sendData);
      setCheckModal(true);
    }
  };

  const handleApi = async (): Promise<void> => {
    try {
      await calendarApi.updateEvent(sendData).then((response)=>{
        if(response.status){
          toast.success(t("SuccessModify"));
        }
        else {
          toast.error(t("ErrorModify"));
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEventDrop = async (arg: EventDropArg): Promise<void> => {
    const { event } = arg;
    if(unModifiedEvent(event)){
    event.end?.setHours(event.end.getHours() - 24);
    const sendData = {
      seq: event.extendedProps.seq,
      schdlCd: event.extendedProps.schdlCd, 
      schdlNm: event.extendedProps.schdlNm, 
      loc: event.extendedProps.loc, 
      content: event.extendedProps.content,
      startDt: moment(event.start).format("YYYY-MM-DD HH:mm:ss"),
      endDt: moment(event.end).add(-1, 'day').format("YYYY-MM-DD HH:mm:ss"), 
      allDay: event.allDay
    }
    setSendData(sendData);
    setCheckModal(true);
    }
  };

  const handleCloseDialog = (): void => {
    setDialog({
      isOpen: false,
      event:{}
    });
  };

  const selectImg = (category : number) => {
    let img;
    //아이콘
    if(category === 1){
      img = <FavoriteIcon sx={{mr: 1}}/>;
    }
    else if(category === 2){
      img = <VolunteerActivismIcon sx={{mr: 1}}/>;
    }
    //이미지
    else if(category === 3){
      img =  <Box component={'img'} width={'30px'} src={'/static/calendar/icon/yeonjinIcon.png'} mt={'-4px'}/>;
    }
    else if(category === 4){
      img = <Box component={'img'} width={'35px'} src={'/static/calendar/icon/minnyeonIcon.png'} m={'-6px'} mt={'-3.5px'} mr={'-1px'}/>
    }
    else if(category === 5){
      img = <BeachAccessIcon sx={{mr: 1}}/>;
    }
    else if(category === 6){
      img = <Box component={'img'} width={'24px'} src={'/favicon.ico'} mr={1}/>;
    }
    return img;
  }

  const renderEventContent = (eventInfo : any) => {
    const extendedProps = eventInfo.event._def.extendedProps;

    let img = selectImg(extendedProps.schdlCd);

    const EventTooltip = styled(({ className, ...props }: TooltipProps) => (
      <Tooltip {...props} arrow classes={{ popper: className }} />
    ))(({ theme }) => ({
      [`& .${tooltipClasses.arrow}`]: {
        color: eventInfo.event.backgroundColor,
      },
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: eventInfo.event.backgroundColor,
        borderRadius : '5px',
        padding: '3px 3px'
      },
    }));
    let start;
    let end;
    if(eventInfo.event.allDay){
      start = moment(extendedProps.startDt).format("MM월 DD일")
      end = moment(extendedProps.endDt).format("MM월 DD일")
    }
    else{
      start = moment(extendedProps.startDt).format("MM월 DD일 HH시 mm분")
      end = moment(extendedProps.endDt).format("MM월 DD일 HH시 mm분")
    }
    const fontSize = 13;
    return (
      <EventTooltip arrow title={
      <Fragment>
        <Box minHeight={'35px'} pt={'5px'}>
        <Typography fontWeight={'bold'} textAlign={'center'}>{extendedProps.schdlCategory}</Typography>
        </Box>
        <Box sx={{backgroundColor: '#fff'}} p={1}>
        <Box display={'flex'} my={0.5}>
        <Typography color={'black'} fontWeight={'bold'} fontSize={fontSize} mr={0.5}>일시 : </Typography>
        <Typography color={'black'} fontSize={fontSize}>{extendedProps.startDt === extendedProps.endDt? start : start + ' ~ ' + end}</Typography>
        </Box>
        <Box display={'flex'} my={0.5}>
        <Typography color={'black'} fontWeight={'bold'} fontSize={fontSize} mr={0.5}>일정명 : </Typography>
        <Typography color={'black'} fontSize={fontSize}>{extendedProps.schdlNm}</Typography>
        </Box>
        {extendedProps.loc && (
        <Box display={'flex'} my={0.5}>
        <Typography color={'black'} fontWeight={'bold'} fontSize={fontSize} mr={0.5}>장소 : </Typography>
        <Typography color={'black'} fontSize={fontSize}>{extendedProps.loc} </Typography>
        </Box>
        )}
        </Box>
      </Fragment>
    } TransitionComponent={Grow} TransitionProps={{timeout : 300}} leaveDelay={100} placement={'top'}>
      <Box display={'flex'}>
      {img}
      <Typography fontWeight={'bold'} fontSize={'16px'} overflow={'hidden'}>{extendedProps.schdlNm}</Typography>
      </Box>
      </EventTooltip>
    )
  };

  return (
    <>
      <Head>
        <title>
          {t("Calendar")} | {t("MinYeonJin")}
        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flexGrow: 1,
          minHeight: '90vh',
          p: '8%',
          py: 3.5
        }}
      >
      {<>
        <Box>
          <Grid display={'flex'} width="100%" justifyContent={'space-between'} mb={4} px={'10%'} pt={1} pb={1} sx={{backgroundColor: 'background.calendar.categoryBar', borderRadius: '0.25rem', border: '1px solid #dee2e6' }}>
            {eventsCd.map((item, index)=>(
            <Grid item xs={3} display={'flex'} key={index}>
              <Box mr={0.5}>
              <HeartSwitch
                size="sm"
                inactiveTrackFillColor={"#9aa2ad"}
                inactiveTrackStrokeColor={"#9aa2ad"}
                activeTrackFillColor={item.schdlColor}
                activeTrackStrokeColor={item.schdlColor}
                inactiveThumbColor="#ecfeff"
                activeThumbColor="#ecfeff"
                checked={checkedList.includes(index+1)}
                onChange={(event) => {
                  if(event.target.checked){
                    setCheckedList([...checkedList,index+1]);
                  }
                  else{
                    setCheckedList([...checkedList.filter(a => a !== index+1)]);
                  }
                }}
              />
              </Box>
              {selectImg(item.schdlCd)}
              <Typography display={{xs: 'none',sm:'block'}} color={'text.primary'} fontSize={'15px'} >
                {item.schdlCategory}
              </Typography>
            </Grid>))}
          </Grid>
        </Box>
        <CalendarToolbar
          date={date}
          onAddClick={handleAddClick}
          onDateNext={handleDateNext}
          onDatePrev={handleDatePrev}
          onViewChange={handleViewChange}
          view={view}
          mobile={smDown}
        />
        <FullCalendarWrapper>
          <FullCalendar
            allDayMaintainDuration
            dayMaxEventRows={4}
            droppable
            editable
            eventClick={handleEventSelect}
            eventDisplay="block"
            eventDrop={handleEventDrop}
            eventResizableFromStart
            eventResize={handleEventResize}
            events={events}
            headerToolbar={false}
            height={1000}
            initialDate={date}
            initialView={view}
            plugins={[
              dayGridPlugin,
              interactionPlugin,
              listPlugin,
              timeGridPlugin,
              timelinePlugin
            ]}
            ref={calendarRef}
            rerenderDelay={10}
            select={handleRangeSelect}
            eventContent={renderEventContent}
            selectable
            weekends
          />
        </FullCalendarWrapper>
        </>}
      </Box>
      {dialog.isOpen && (
              <CalendarEventDialog
              params={{date, checkedList}}
              event={dialog.event}
              onClose={handleCloseDialog}
              open={dialog.isOpen}
            />
      )}

      {checkModal && (
      <CheckModal
        defaultCallback={getEventList}
        cancelCallback={()=>{}}
        icon={<EventNoteIcon fontSize='large' color={"secondary"}/>}
        callback={handleApi}
        open={checkModal}
        onClose={()=>{setCheckModal(false)}}
        data={{
          title: t("ModifySchedule"),
          content: t("checkModifyPeriodSchedule")
        }}
      />)}
    </>
  );
};

Calendar.getLayout = (page) => (
  <AuthGuard>
    <MainLayout>
      {page}
    </MainLayout>
  </AuthGuard>
);

export default Calendar;
