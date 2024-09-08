import {
  ChangeEvent,
  ElementType,
  FC,
  Fragment,
  ReactNode,
  useState,
} from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Box,
  Button,
  Grid,
  Grow,
  IconButton,
  styled,
  TextField,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import ViewConfigIcon from "@mui/icons-material/ViewComfy";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import { ChevronLeft as ChevronLeftIcon } from "components/icons/chevron-left";
import { ChevronRight as ChevronRightIcon } from "components/icons/chevron-right";
import { Plus as PlusIcon } from "components/icons/plus";
import type { CalendarView } from "types/calendar";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useSelector } from "store";
import { CalendarGoalDialog } from "./calendar-goal-dialog";
import useTransition from 'next-translate/useTranslation';

interface CalendarToolbarProps {
  children?: ReactNode;
  date: Date;
  mobile?: boolean;
  onAddClick?: () => void;
  onDateNext?: () => void;
  onDatePrev?: () => void;
  onViewChange?: (view: CalendarView) => void;
  view: CalendarView;
}

interface ViewOption {
  icon: ElementType;
  label: string;
  value: CalendarView;
}

const viewOptions: ViewOption[] = [
  {
    icon: ViewConfigIcon,
    label: "Month",
    value: "dayGridMonth",
  },
  {
    icon: ViewWeekIcon,
    label: "Week",
    value: "timeGridWeek",
  },
  {
    icon: ViewDayIcon,
    label: "Day",
    value: "timeGridDay",
  },
  {
    icon: ViewAgendaIcon,
    label: "Agenda",
    value: "listWeek",
  },
];

export const CalendarToolbar: FC<CalendarToolbarProps> = (props) => {
  const {
    date,
    mobile,
    onAddClick,
    onDateNext,
    onDatePrev,
    onViewChange,
    view,
    ...other
  } = props;

  const { t } = useTransition("calendar");

  const { eventGoals } = useSelector((state) => state.calendar);

  const handleViewChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onViewChange?.(event.target.value as CalendarView);
  };

  const GoalTooltipMin = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "background.goals.blue",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "background.goals.blue",
      borderRadius: "5px",
      padding: "3px 3px",
    },
  }));

  const GoalTooltipYeon = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "background.goals.pink",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "background.goals.pink",
      borderRadius: "5px",
      padding: "3px 3px",
    },
  }));

  const fontSize = 13;

  const [goalModal, setGoalModal] = useState<{ open: boolean; type: "MinNyeon" | "YeonJin" }>();
  return (
    <>
      <Grid
        container
        sx={{
          alignItems: "center",
          m: 0,
        }}
        {...other}
      >
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            justifyContent: "left",
          }}
        >
          <Box
            sx={{
              backgroundColor: "primary.main",
              borderRadius: "10px",
              width: "140px",
              height: "40px",
              display: "flex",
            }}
            px={"4px"}
          >
            <Box sx={{ borderRight: "4px solid white", pr: "10px" }}>
              <EventAvailableIcon
                sx={{ color: "white", fontSize: "30px", mt: "2px" }}
                viewBox={"-3 -4 25 25"}
              />
            </Box>
            <GoalTooltipMin
              arrow
              title={
                <Fragment>
                  <Box minHeight={"35px"} pt={"5px"} minWidth={'150px'}>
                    <Typography fontWeight={"bold"} textAlign={"center"}>
                      {t("GoalMinNyeonTM")}
                    </Typography>
                  </Box>
                  <Box sx={{ backgroundColor: "#fff" }} p={1}>
                    <Box display={"flex"} my={0.5}>
                      <Typography
                        color={"black"}
                        fontWeight={"bold"}
                        fontSize={fontSize}
                        mr={0.5}
                      >
                        {eventGoals.MinNyeon?.goalContent
                          ? eventGoals.MinNyeon?.goalContent
                          : t("GoalRequired")}
                      </Typography>
                      <Typography color={"black"} fontSize={fontSize}>
                        {}
                      </Typography>
                    </Box>
                  </Box>
                </Fragment>
              }
              TransitionComponent={Grow}
              TransitionProps={{ timeout: 300 }}
              leaveDelay={100}
            >
              <IconButton
                onClick={() => {
                  setGoalModal({ open: true, type: "MinNyeon" });
                }}
                sx={{
                  ":hover": {
                    transform: "translateY(-4px)",
                  },
                  p: 0,
                }}
              >
                <Box
                  component={"img"}
                  width={47}
                  src={"/static/calendar/icon/minnyeonIcon.png"}
                  pt={"3px"}
                />
              </IconButton>
            </GoalTooltipMin>
            <GoalTooltipYeon
              arrow
              title={
                <Fragment>
                  <Box minHeight={"35px"} pt={"5px"} minWidth={'150px'}>
                    <Typography fontWeight={"bold"} textAlign={"center"}>
                      {t("GoalYeonJinTM")}
                    </Typography>
                  </Box>
                  <Box sx={{ backgroundColor: "#fff" }} p={1}>
                    <Box display={"flex"} my={0.5}>
                      <Typography
                        color={"black"}
                        fontWeight={"bold"}
                        fontSize={fontSize}
                        mr={0.5}
                      >
                        {eventGoals.YeonJin?.goalContent
                          ? eventGoals.YeonJin?.goalContent
                          : t("GoalRequired")}
                      </Typography>
                      <Typography color={"black"} fontSize={fontSize}>
                        {}
                      </Typography>
                    </Box>
                  </Box>
                </Fragment>
              }
              TransitionComponent={Grow}
              TransitionProps={{ timeout: 300 }}
              leaveDelay={100}
            >
              <IconButton
                onClick={() => {
                  setGoalModal({ open: true, type: "YeonJin" });
                }}
                sx={{
                  ":hover": {
                    transform: "translateY(-4px)",
                  },
                  p: 0,
                }}
              >
                <Box
                  component={"img"}
                  width={40}
                  src={"/static/calendar/icon/yeonjinIcon.png"}
                  pb={"3px"}
                />
              </IconButton>
            </GoalTooltipYeon>
          </Box>
          <TextField
            label="View"
            name="view"
            onChange={handleViewChange}
            select
            size="small"
            value={view}
            sx={{
              ml: {
                xs: "auto",
                md: 1,
              },
              display: {
                xs: "none",
                md: "block",
              },
              minWidth: 120,
            }}
            SelectProps={{ native: true }}
          >
            {viewOptions.map((viewOption) => {
              // On mobile allow only timeGridDay and agenda views
              if (
                mobile &&
                !["timeGridDay", "listWeek"].includes(viewOption.value)
              ) {
                return null;
              }

              return (
                <option key={viewOption.value} value={viewOption.value}>
                  {viewOption.label}
                </option>
              );
            })}
          </TextField>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography textAlign={"center"} variant="h5">
            {format(date, "MMMM")}
            {" " + format(date, "y")}
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            justifyContent: "right",
            my: -1,
          }}
        >
          <Grid container>
            <Grid item xs={3}>
              <IconButton
                onClick={onDatePrev}
                sx={{
                  width: "100%",
                  backgroundColor: "primary.main",
                  ":hover": {
                    backgroundColor: "primary.dark",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <ChevronLeftIcon fontSize="small" sx={{ color: "white" }} />
              </IconButton>
            </Grid>
            <Grid item xs={3}>
              <IconButton
                onClick={onDateNext}
                color={'primary'}
                sx={{
                  width: "100%",
                  ml: "10%",
                  backgroundColor: "primary.main",
                  ":hover": {
                    backgroundColor: "primary.dark",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <ChevronRightIcon fontSize="small" sx={{ color: "white" }} />
              </IconButton>
            </Grid>
            <Grid item xs={6}>
              <Button
                onClick={onAddClick}
                startIcon={!mobile ? <PlusIcon fontSize="medium" /> : undefined}
                sx={{
                  height: "38px",
                  width: "80%",
                  float: "right",
                  ":hover": {
                    transform: "translateY(-2px)",
                  },
                }}
                variant="contained"
              >
                {!mobile ? t("NewEvent") : <PlusIcon fontSize="medium" />}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {goalModal?.open && (
        <CalendarGoalDialog
          date={date}
          open={goalModal.open}
          type={goalModal.type}
          onClose={() => {
            setGoalModal({ ...goalModal, open: false });
          }}
        />
      )}
    </>
  );
};

CalendarToolbar.propTypes = {
  children: PropTypes.node,
  date: PropTypes.instanceOf(Date).isRequired,
  mobile: PropTypes.bool,
  onAddClick: PropTypes.func,
  onDateNext: PropTypes.func,
  onDatePrev: PropTypes.func,
  onViewChange: PropTypes.func,
  view: PropTypes.oneOf<CalendarView>([
    "dayGridMonth",
    "timeGridWeek",
    "timeGridDay",
    "listWeek",
  ]).isRequired,
};
