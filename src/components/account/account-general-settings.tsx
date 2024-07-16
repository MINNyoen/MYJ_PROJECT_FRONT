import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { UserCircle as UserCircleIcon } from 'components/icons/user-circle';
import { useAuth } from 'hooks/use-auth';
import type { FC } from 'react';
import useTransition from 'next-translate/useTranslation';

export const AccountGeneralSettings: FC = (props) => {

  const { user } = useAuth();
  const {t} = useTransition("mypage");

  return (
    <Box
      sx={{ mt: 4 }}
      {...props}
    >
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
                {t("BasicDetails")}
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                <Avatar
                  src={user?.avatar}
                  sx={{
                    height: 64,
                    mr: 2,
                    width: 64
                  }}
                >
                  <UserCircleIcon fontSize="small" />
                </Avatar>
                <Button>
                {t("ProfileChange")}
                </Button>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  mt: 3,
                  alignItems: 'center'
                }}
              >
                <TextField
                  defaultValue={user?.loginId}
                  disabled
                  label={t("EmailAddress")}
                  required
                  size="small"
                  sx={{
                    flexGrow: 1,
                    mr: 3,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderStyle: 'dashed'
                    }
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  mt: 3,
                  alignItems: 'center'
                }}
              >
                <TextField
                  defaultValue={user?.userNm}
                  label={t("FullName")}
                  size="small"
                  sx={{
                    flexGrow: 1,
                    mr: 3
                  }}
                />
                <Button>
                {t("Save")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 4 }}>
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
              {t("DeleteAccount")}
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <Typography
                sx={{ mb: 3 }}
                variant="subtitle1"
              >
                {t("DeleteAccountInfo")}
              </Typography>
              <Button
                color="error"
                variant="outlined"
              >
               {t("DeleteAccount")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
