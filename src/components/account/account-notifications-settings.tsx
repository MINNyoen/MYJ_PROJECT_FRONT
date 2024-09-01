import { Box, Card, CardContent, Divider, Grid, Switch, Typography } from '@mui/material';
import useTransition from 'next-translate/useTranslation';


export const AccountNotificationsSettings = () => {
  const {t} = useTransition("mypage");
  return (
    <Card>
      <CardContent>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            md={4}
            xs={12}
          >
            <Typography variant="h6">
            {t("Community")}
            </Typography>
          </Grid>
          <Grid
            item
            md={8}
            sm={12}
            xs={12}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 3
              }}
            >
              <div>
                <Typography variant="subtitle1">
                {t("ChattingUpdates")}
                </Typography>
                <Typography
                  color="textSecondary"
                  sx={{ mt: 1 }}
                  variant="body2"
                >
                  {t("ChattingUpdatesInfo")}
                </Typography>
              </div>
              <Switch defaultChecked />
            </Box>
            <Divider />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                mt: 3
              }}
            >
              <div>
                <Typography variant="subtitle1">
                {t("BoardUpdates")}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  {t("BoardUpdatesInfo")}
                </Typography>
              </div>
              <Switch defaultChecked />
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            md={4}
            xs={12}
          >
            <Typography variant="h6">
            {t("Planning")}
            </Typography>
          </Grid>
          <Grid
            item
            md={8}
            sm={12}
            xs={12}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 3
              }}
            >
              <div>
                <Typography variant="subtitle1">
                {t("KanbanUpdates")}
                </Typography>
                <Typography
                  color="textSecondary"
                  sx={{ mt: 1 }}
                  variant="body2"
                >
                  {t("KanbanUpdatesInfo")}
                </Typography>
              </div>
              <Switch defaultChecked />
            </Box>
            <Divider />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                mt: 3
              }}
            >
              <div>
                <Typography variant="subtitle1">
                {t("SchedulesUpdates")}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                 {t("SchedulesUpdatesInfo")}
                </Typography>
              </div>
              <Switch defaultChecked />
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            md={4}
            xs={12}
          >
            <Typography variant="h6">
            {t("Memories")}
            </Typography>
          </Grid>
          <Grid
            item
            md={8}
            sm={12}
            xs={12}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 3
              }}
            >
              <div>
                <Typography variant="subtitle1">
                {t("TravelsUpdates")}
                </Typography>
                <Typography
                  color="textSecondary"
                  sx={{ mt: 1 }}
                  variant="body2"
                >
                  {t("TravelsUpdatesInfo")}
                </Typography>
              </div>
              <Switch disabled />
            </Box>
            <Divider />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                mt: 3
              }}
            >
              <div>
                <Typography variant="subtitle1">
                {t("GalleryUpdates")}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                   {t("GalleryUpdatesInfo")}
                </Typography>
              </div>
              <Switch disabled />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
