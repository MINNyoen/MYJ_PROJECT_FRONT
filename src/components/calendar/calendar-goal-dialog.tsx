import EventNoteIcon from "@mui/icons-material/EventNote";
import {
  Box,
  Button,
  Dialog,
  Divider, Grid, TextField,
  Typography
} from "@mui/material";
import { calendarApi } from "api/calendar-api";
import { CheckModal } from "components/checkModal";
import moment from "moment";
import { FC, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getGoals } from "slices/calendar";
import { useDispatch, useSelector } from "store";
import { deepCopy } from "utils/deep-copy";
import useTransition from 'next-translate/useTranslation';

interface CalendarGoalFormProps {
  type: "MinNyeon" | "YeonJin";
  date: Date;
  onClose?: () => void;
  open?: boolean;
}

export interface CalendarGoalFormValues {
  goalSid?: number;
  goalDate?: string;
  goalContent?: string;
  goalUser?: string;
}

export const CalendarGoalDialog: FC<CalendarGoalFormProps> = (props) => {
  const { type, date, onClose, open } = props;

  const {t} = useTransition("calendar");

  const { eventGoals } = useSelector((state) => state.calendar);

  const [sendData, setSendData] = useState<any>();
  const [checkModal, setCheckModal] =
    useState<{
      open: boolean;
      type: "UPDATE" | "INSERT";
      title: string;
      content: string;
    }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue
  } = useForm<CalendarGoalFormValues>({
    defaultValues: type === "MinNyeon" ? eventGoals.MinNyeon ? eventGoals.MinNyeon : {goalUser: type} : eventGoals.YeonJin ? eventGoals.YeonJin : {goalUser: type},
  });

useEffect(()=>{
  setValue("goalDate",moment(date).format("YYYY년 MM월"));
},[])

  const dispatch = useDispatch();

  const handleApi = async () => {
    if (checkModal?.type === "INSERT") {
      await calendarApi.createGoal(sendData).then((response) => {
        if (response.status) {
          onClose && onClose();
          toast.success(t("SuccessCreateGoal"));
          dispatch(getGoals(moment(date).format("YYYY-MM")));
        } else {
          toast.error(t("ErrorCreateGoal"));
        }
      });
    } else if (checkModal?.type === "UPDATE") {
      delete sendData.updId;
      delete sendData.updDt;
      await calendarApi.updateGoal(sendData).then((response) => {
        if (response.status) {
          onClose && onClose();
          toast.success(t("SuccessModifyGoal"));
          dispatch(getGoals(moment(date).format("YYYY-MM")));
        } else {
          toast.error(t("ErrorModifyGoal"));
        }
      });
    }
  };

  const onSubmit = async (data: CalendarGoalFormValues) => {
    const transData: any = deepCopy(data);
    transData.goalDate = moment(date).format("YYYY-MM");
    if (!transData.goalSid) {
      setCheckModal({
        open: true,
        title: t("CreateGoal"),
        content: t("CheckCreateGoal"),
        type: "INSERT",
      });
    } else {
      setCheckModal({
        open: true,
        title: t("ModifyGoal"),
        content: t("CheckModifyGoal"),
        type: "UPDATE",
      });
    }
    setSendData(transData);
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={onClose}
        open={!!open}
        PaperProps={{ sx: { overflow: "hidden" } }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container>
            <Box
              width={"100%"}
              sx={{ pt: 5, px: 4 }}
              display={"inline-flex"}
              justifyContent={"space-between"}
            >
              <Typography
                align="center"
                gutterBottom
                fontSize={"25px"}
                color={"primary"}
                fontWeight={"bold"}
              >
                {getValues("goalSid") ? t("ModifyGoal") : t("CreateGoal")}
              </Typography>
            </Box>
            <Grid container spacing={3} p={3}>
              <Grid item xs={6} mt={1}>
                <TextField
                  fullWidth
                  label={t("WhoseGoal")}
                  {...register("goalUser")}
                  error={!!errors.goalUser}
                  helperText={errors.goalUser?.message}
                />
              </Grid>
              <Grid item xs={6} mt={1}>
                <TextField
                  fullWidth
                  label={t("WhenGoal")}
                  {...register("goalDate")}
                  error={!!errors.goalDate}
                  helperText={errors.goalDate?.message}
                />
              </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    InputProps={{ sx: { height: "160px" } }}
                    label={t("WhatGoal")}
                    {...register("goalContent")}
                    error={!!errors.goalContent}
                    helperText={errors.goalContent?.message}
                  />
                </Grid>
                <Grid item xs={12} mt={3}>
                  <Divider />
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      p: 2,
                      pl: 0,
                      pb: 0,
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }} />
                    <Button onClick={onClose}>{t("Cancel")}</Button>
                    <Button sx={{ ml: 1 }} type="submit" variant="contained">
                      {t("Confirm")}
                    </Button>
                  </Box>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Dialog>

      {checkModal && (
        <CheckModal
          callback={handleApi}
          icon={<EventNoteIcon fontSize="large" color={"secondary"} />}
          open={checkModal.open}
          onClose={() => {
            setCheckModal({ ...checkModal, open: false });
          }}
          data={{
            title: checkModal.title,
            content: checkModal.content,
          }}
        />
      )}
    </>
  );
};
