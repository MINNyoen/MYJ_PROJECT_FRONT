import { yupResolver } from '@hookform/resolvers/yup';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import EventNoteIcon from '@mui/icons-material/EventNote';
import {
  Box,
  Button,
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid, InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { DateTimePicker, DesktopDatePicker } from '@mui/x-date-pickers';
import { calendarApi } from 'api/calendar-api';
import { CheckModal } from 'components/checkModal';
import moment from 'moment';
import useTranslation from 'next-translate/useTranslation';
import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getEvents } from 'slices/calendar';
import { useDispatch, useSelector } from 'store';
import { deepCopy } from 'utils/deep-copy';
import * as Yup from 'yup';

interface CalendarEventFormProps {
  params: {date: Date, checkedList: number[]};
  event?: CalendarFormValues;
  onClose?: () => void;
  open?: boolean;
}

export interface CalendarFormValues {
  seq?: number;
  allDay?: boolean;
  schdlNm?: string;
  schdlCd?: number;
  loc?: string;
  startDt?: Date | null;
  endDt?: Date | null;
  content?: string;
}

export const CalendarEventDialog: FC<CalendarEventFormProps> = (props) => {
  const {
    params,
    event,
    onClose,
    open
  } = props;

  const { eventsCd } = useSelector((state) => state.calendar);
  const {t} = useTranslation("calendar");
  const [sendData, setSendData] = useState<any>();
  const [checkModal, setCheckModal] = useState<{open: boolean, type: "UPDATE" | "INSERT" | "DELETE", title: string, content: string}>();

  const { register, handleSubmit, formState: {errors}, getValues, setValue, control } = useForm<CalendarFormValues>({
    defaultValues: {...event},
    resolver: yupResolver(Yup.object({
      allDay: Yup.bool(),
      description: Yup.string().max(5000),
      endDt: Yup.date().required(),
      startDt: Yup.date().required(),
      schdlCd: Yup.number().typeError(t("valSchdlCd")).required(),
      schdlNm: Yup.string().required(t("valSchdlNm")).max(255)
    }))
  });

  useEffect(()=>{
    if(event?.allDay){
      const end = event?.endDt;
      end?.setHours(end.getHours() - 24);
      setValue('endDt', end);
    }
    if(event?.endDt === null){
      const end = event?.startDt;
      setValue('endDt', end);
    }
  },[])

  const dispatch = useDispatch();

  const handleApi = async () => {
    console.log(sendData);
    if(checkModal?.type === "INSERT") {
      await calendarApi.createEvent(sendData).then((response)=>{
        if(response.status){
          onClose && onClose();
          toast.success(t("SuccessCreate"));
          dispatch(getEvents(moment(params.date).format('YYYY-MM-DD'),params.checkedList));
        }
        else {
          toast.error(t("ErrorCreate"));
        }
      });
    }
    else if(checkModal?.type === "UPDATE") {
      await calendarApi.updateEvent(sendData).then((response)=>{
        if(response.status){
          onClose && onClose();
          toast.success(t("SuccessModify"));
          dispatch(getEvents(moment(params.date).format('YYYY-MM-DD'),params.checkedList));
        }
        else {
          toast.error(t("ErrorModify"));
        }
      });
    }
    else if(checkModal?.type === "DELETE") {
      const eventId = getValues('seq');
      if(eventId){
        await calendarApi.deleteEvent(eventId).then((response)=>{
          if(response.status){
            onClose && onClose();
            toast.success(t("SuccessDelete"));
            dispatch(getEvents(moment(params.date).format('YYYY-MM-DD'),params.checkedList));
          }
          else {
            toast.error(t("ErrorDelete"));
          }
        }); 
      }
    }
  }


  const onSubmit = async (data: CalendarFormValues) => {
    const transData :any = deepCopy(data);
    const end = transData.endDt;
    transData.endDt = moment(end).format("YYYY-MM-DD HH:mm:ss");
    transData.startDt = moment(transData.startDt).format("YYYY-MM-DD HH:mm:ss");
    if(!transData.seq) {
      setCheckModal({open: true, title: t("CreateSchedule"), content: t("checkCreateSchedule"), type: "INSERT"});
    }

    else {
      setCheckModal({open: true, title: t("ModifySchedule"), content: t("checkModifySchedule"), type: "UPDATE"});
    }
    setSendData(transData);
  }
  
  const handleDelete = async (): Promise<void> => {
    setCheckModal({open: true, title: t("DeleteSchedule"), content: t("checkDeleteSchedule"), type: "DELETE"});
  };

  const [timeOrDay, setTimeOrDay] = useState(event?.allDay);

  const timezeroSetting = (date? : Date | null) => {
    const result = date;
    result?.setHours(0);
    result?.setMinutes(0);
    result?.setSeconds(0);
    result?.setMilliseconds(0);
    return result;
  }

  return (
    <>
    <Dialog
      fullWidth
      maxWidth="lg"
      onClose={onClose}
      open={!!open}
      PaperProps={{sx: {overflow: 'hidden'}}}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={12} md={8}>
              <Box width={"100%"} sx={{ pt: 5, px: 4 }} display={'inline-flex'} justifyContent={'space-between'}>
              <Typography
                align="center"
                gutterBottom
                fontSize={'25px'}
                color={'primary'}
                fontWeight={'bold'}
              >
                {
                  event?.seq
                    ? t("ModifySchedule")
                    : t("CreateSchedule")
                }
              </Typography>
              <Box>
                <Controller
                  name="allDay"
                  control={control}
                  render={({ field : {value, onChange}, ...props}) => {
                    return (
                      <FormControlLabel
                        sx={{color: getValues('allDay') ? "background.navtooltip" : "background.secondary"}}
                        control={
                          <Switch
                          checked={value}
                          {...register("allDay")}
                          onChange={(data) => {
                            onChange(data);
                            setTimeOrDay(data.target.checked);
                            setValue("startDt", timezeroSetting(getValues("startDt")));
                            setValue("endDt", timezeroSetting(getValues("endDt")));
                          }}
                          icon={
                            <Box>
                              <AccessTimeIcon sx={{borderRadius: '50%', backgroundColor: 'background.secondary' , color: 'background.paper'}}/>
                            </Box>
                            
                          }
                          checkedIcon={
                            <Box>
                              <EventIcon sx={{borderRadius: '50%', backgroundColor: 'background.calendar.button', padding: '2px', color: 'background.default'}}/>
                            </Box>
                          }
                        />
                        }
                        label={getValues('allDay') ? "Days" : "Time"}
                        labelPlacement={"start"}
                        />
                    )
                  }}
                  />
              </Box>
            </Box>
            <Grid container spacing={3} p={3}>
                <Grid item xs={12} mt={{xs: 0, md: 1}}>
                  <TextField
                    fullWidth
                    label={t("schdlNm")}
                    {...register("schdlNm")}
                    error={!!errors.schdlNm}
                    helperText={errors.schdlNm?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6} mt={{xs: 1, md: 2}}>
                <Controller
                  name="schdlCd"
                  control={control}
                  render={({ field : {onChange, value}, ...props}) => {
                    return (
                      <FormControl fullWidth>
                      <InputLabel id="schdlCategory">{t("schdlCd")}</InputLabel>
                      <Select
                      fullWidth
                      id="schdlCategory"
                      label={t("schdlCd")}
                      {...register("schdlCd")}    
                      onChange={onChange}
                      value={value ? value : ""}
                      error={!!errors.schdlCd}
                      >
                      {eventsCd.map((item,index)=>(<MenuItem key={index} value={item.schdlCd}>{item.schdlCategory}</MenuItem>))}
                      </Select>
                      <FormHelperText error={!!errors.schdlCd}>{errors.schdlCd?.message}</FormHelperText>
                      </FormControl>
                    )}
                  }
                  />

                </Grid>
                <Grid item xs={12} md={6} mt={{xs: 1, md: 2}}>
                  <TextField
                    fullWidth
                    label={t("loc")}
                    {...register("loc")}
                    error={!!errors.loc}
                    helperText={errors.loc?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6} mt={{xs: 1, md: 2}}>
                  <Controller
                  name="startDt"
                  control={control}
                  render={({ field, ...props}) => {
                    return (
                      <>
                      {timeOrDay ? 
                      <DesktopDatePicker
                      label={t("startDt")}
                      inputFormat="yyyy-MM-dd"
                      mask={"____-__-__"}
                      onChange={(date)=> {
                        field.onChange(date);
                      }}
                      renderInput={(inputProps) => (
                        <TextField
                          fullWidth
                          InputLabelProps={{shrink: true}}
                          {...register("startDt")}
                          {...inputProps}
                        />
                      )}
                      value={field.value}
                      />
                      :
                      <DateTimePicker
                      label={t("startDt")}
                      inputFormat="yyyy-MM-dd HH:mm"
                      mask={"____-__-__ __:__"}
                      onChange={(date)=> {
                        field.onChange(date);
                      }}
                      renderInput={(inputProps) => (
                        <TextField
                          fullWidth
                          InputLabelProps={{shrink: true}}
                          {...register("startDt")}
                          {...inputProps}
                        />
                      )}
                      value={field.value}
                    />
                    }
                    </>
                    )
                  }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6} mt={{xs: 1, md: 2}}>
                  <Controller
                  name="endDt"
                  control={control}
                  render={({ field, ...props}) => {
                    return (
                      <>
                      {timeOrDay ? 
                      <DesktopDatePicker
                      label={t("endDt")}
                      inputFormat="yyyy-MM-dd"
                      mask={"____-__-__"}
                      onChange={(date)=> {
                        field.onChange(date);
                      }}
                      renderInput={(inputProps) => (
                        <TextField
                          fullWidth
                          InputLabelProps={{shrink: true}}
                          {...register("endDt")}
                          {...inputProps}
                        />
                      )}
                      value={field.value}
                      />
                      :
                      <DateTimePicker
                      label={t("endDt")}
                      inputFormat="yyyy-MM-dd HH:mm"
                      mask={"____-__-__ __:__"}
                      onChange={(date)=> {
                        field.onChange(date);
                      }}
                      renderInput={(inputProps) => (
                        <TextField
                          fullWidth
                          InputLabelProps={{shrink: true}}
                          {...register("endDt")}
                          {...inputProps}
                        />
                      )}
                      value={field.value}
                    />
                    }
                    </>
                    )
                  }}
                  />
                </Grid>
                <Grid item xs={12} mt={{xs: 1, md: 2}}>
                <TextField
                    fullWidth
                    multiline
                    InputProps={{sx: {height: '160px'}}}
                    label={t("content")}
                    {...register("content")}
                    error={!!errors.content}
                    helperText={errors.content?.message}
                  />
                </Grid>
                <Grid item xs={12} mt={{xs: 2, md: 3}}>
                  <Divider />
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      p: 2,
                      pl: 0,
                      pb: 0
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }} />
                    <Button onClick={onClose}>
                    {t("Cancel")}
                    </Button>
                    {event?.seq &&
                    <Button
                      sx={{ ml: 1 }}
                      type="button"
                      color='secondary'
                      variant="contained"
                      onClick={handleDelete}
                    >
                      {t("Delete")}
                    </Button>
                    }
                    <Button
                      sx={{ ml: 1 }}
                      type="submit"
                      variant="contained"
                    >
                      {t("Confirm")}
                    </Button>
                  </Box>
                </Grid>
            </Grid>
          </Grid>
          <Grid item xs={0} md={4} display={{xs: 'none', md: 'block' }}>
           <Box width="101%" height={"100%"} sx={{backgroundImage: 'url(/static/calendar/modal/modal.jpeg)', 
           backgroundRepeat : 'no-repeat', backgroundSize : 'cover', color: 'white', backgroundPosition: 'bottom', 
           textAlign: 'left', fontWeight: 'bold', whiteSpace: 'nowrap'}} p={2}>
              <Typography p={1} variant='h5'>{t("modalSideName")}</Typography>
              <Typography p={1} fontSize={'12px'} whiteSpace={"pre-wrap"}>{t("modalSideContent")}</Typography>
          </Box>
          </Grid>
        </Grid>
      </form>
    </Dialog>

    {checkModal &&(
      <CheckModal
        callback={handleApi}
        icon={<EventNoteIcon fontSize='large' color={"secondary"}/>}
        open={checkModal.open}
        onClose={()=>{setCheckModal({...checkModal, open: false})}}
        data={{
          title: checkModal.title,
          content: checkModal.content
        }}
      />)}
    </>
  );
};
