import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { FC, useEffect } from "react";
import { ArrowRight as ArrowRightIcon } from "components/icons/arrow-right";
import CampaignIcon from "@mui/icons-material/Campaign";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FlagIcon from "@mui/icons-material/Flag";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useDispatch, useSelector } from "store";
import { getEvents, getGoals } from 'slices/calendar';
import moment from "moment";
import useTranslation from 'next-translate/useTranslation';

export const MainFirst: FC = (props) => {

  const { eventGoals, events } = useSelector((state) => state.calendar);

  const {t} = useTranslation('home');

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getGoals(moment(new Date()).format("YYYY-MM")));
    dispatch(getEvents(moment(new Date(moment(new Date()).startOf("month").format())).format('YYYY-MM-DD'),[1,2,3,4]));
  },[])

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(45deg, rgba(255, 255, 255, 0.6),  rgba(255, 255, 255, 0.0)), url('/static/main/one.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        pt: 15,
        pb: 15,
      }}
      {...props}
    >
      <Container
        maxWidth={"xl"}
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography color="primary" variant="h4">
          MinYeonjin
        </Typography>
        <Typography align="center" variant="h1">
          MYJ's World Homepage
        </Typography>
        <Grid
          container
          spacing={4}
          pl={{ xs: 0, lg: 20 }}
          pr={{ xs: 0, lg: 20 }}
          pt={10}
        >
          <Grid item xs={12} lg={7}>
            <Grid item xs={12}>
              <Card sx={{background: 'rgba(255,255,255,0.8)'}}>
                <CardContent>
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      mb: 1,
                    }}
                  >
                    <CampaignIcon color="primary" fontSize="medium" />
                    <Typography
                      color="primary.main"
                      sx={{ pl: 1 }}
                      variant="h6"
                    >
                      {t('Notice')}
                    </Typography>
                  </Box>
                  {["1", "2", "3"].map((i) => (
                    <Box
                      width={"100%"}
                      key={i}
                      display={"inline-flex"}
                      justifyContent={"space-between"}
                    >
                      <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        게시판 - 공지사항입니다 ----- {i}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mt: 2 }}>
                        2022.08.11 1{i}:00
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} mt={5}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={7}>
                  <Card sx={{maxHeight: '280px', background: 'rgba(255,255,255,0.8)'}}>
                    <CardContent>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <FlagIcon color="primary" fontSize="medium" />
                        <Typography
                          color="primary.main"
                          sx={{ pl: 1 }}
                          variant="subtitle1"
                        >
                          {t('ThisMonthGoals')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ mt: 2, ml: 1 }}>
                        {t('YeonJin')}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="body1"
                          whiteSpace={'nowrap'}
                          sx={{ ml: 3, mt: 1 }}
                        >
                          {eventGoals.YeonJin?.goalContent ? eventGoals.YeonJin?.goalContent : t('GoalRequired')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ mt: 2, ml: 1 }}>
                        {t('MinNyeon')}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="body1"
                          whiteSpace={'nowrap'}
                          sx={{ ml: 3, mt: 1 }}
                        >
                          {eventGoals.MinNyeon?.goalContent ? eventGoals.MinNyeon?.goalContent : t('GoalRequired')}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={5} sx={{m: 'auto'}}>
                  <Card sx={{maxHeight: '280px', background: 'rgba(255,255,255,0.8)'}}>
                    <CardContent
                      sx={{
                        textAlign: "center",
                        pt: 4,
                      }}
                    >
                      <Box display={"inline-flex"} pr={2}>
                        <FavoriteIcon color="primary" fontSize="large" viewBox="-3 0 25 25" />
                        <Typography
                          color="primary.main"
                          sx={{ pl: 1, pb: 2 }}
                          variant="h5"
                        >
                          {t('MYJDays')}
                        </Typography>
                      </Box>
                      <Typography
                        color="background.primary"
                        sx={{ whiteSpace: 'nowrap' }}
                        variant="h4"
                      >
                        {process.env.NEXT_PUBLIC_MYJ_DATE && moment(new Date()).diff(moment(new Date(process.env.NEXT_PUBLIC_MYJ_DATE)), "days")+1} {t('Days')}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{justifyContent: 'center'}}>
                      <Button
                        color={"primary"}
                        endIcon={<ArrowRightIcon fontSize="small" fontWeight={800} />}
                        size="small"
                        sx={{fontSize: '16px', fontWeight: '800',":hover":{transform: "translateY(-4px)"}}}
                      >
                        {t('GoToMemories')}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={5}>
            <Card sx={{maxHeight: '513px', background: 'rgba(255,255,255,0.8)'}}>
              <CardContent>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <AutoStoriesIcon color="primary" fontSize="medium" />
                  <Typography
                    color="primary.main"
                    sx={{ pl: 1 }}
                    variant="subtitle1"
                  >
                     {t('Kanban')}
                  </Typography>
                </Box>
                <List disablePadding sx={{ pt: 2, maxHeight: '200px', overflow: 'auto'}}>
                  {["1", "2", "3", "4", "5"].map((i, index) => (
                    <ListItem
                      disableGutters
                      key={index}
                      sx={{
                        pb: 2,
                        pt: 0,
                      }}
                    >
                      <ListItemText
                        disableTypography
                        primary={
                          <Box
                            sx={{
                              alignItems: "center",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                ml: 1,
                                alignItems: "center",
                                display: "flex",
                              }}
                            >
                              <Box
                                sx={{
                                  border: 3,
                                  borderColor: "blue",
                                  borderRadius: "50%",
                                  height: 16,
                                  mr: 1,
                                  width: 16,
                                }}
                              />
                              <Typography variant="subtitle2">
                                Item {i}
                              </Typography>
                            </Box>
                            <Typography
                              color="textSecondary"
                              variant="subtitle2"
                            >
                              Item content{i}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardContent sx={{pt: 1}}>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <CalendarMonthIcon color="primary" fontSize="medium" />
                  <Typography
                    color="primary.main"
                    sx={{ pl: 1 }}
                    variant="subtitle1"
                  >
                     {t("Today'sPlan")}
                  </Typography>
                </Box>
                  <List disablePadding sx={{ pt: 2, height: '200px', overflow: 'auto' }}>
                  {events.filter((e)=>{
                    return moment(e.start).isSameOrBefore(moment(new Date())) && moment(e.end).isSameOrAfter(moment(new Date()));
                  }).map((i, index) => (
                    <ListItem
                      disableGutters
                      key={index}
                      sx={{
                        pb: 2,
                        pt: 0,
                      }}
                    >
                      <ListItemText
                        disableTypography
                        primary={
                          <Box
                            sx={{
                              alignItems: "center",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                ml: 1,
                                alignItems: "center",
                                display: "flex",
                              }}
                            >
                              <Box
                                sx={{
                                  border: 3,
                                  borderColor: i.color,
                                  borderRadius: "50%",
                                  height: 16,
                                  mr: 1,
                                  width: 16,
                                }}
                              />
                              <Typography variant="subtitle2" whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'}>
                                {i.schdlNm}
                              </Typography>
                            </Box>
                            <Typography
                              color="textSecondary"
                              variant="subtitle2"
                              whiteSpace={'nowrap'}
                              overflow={'hidden'}
                              maxWidth={'40%'}
                              textAlign={'right'}
                              textOverflow={'ellipsis'}
                            >
                              {i.content}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
