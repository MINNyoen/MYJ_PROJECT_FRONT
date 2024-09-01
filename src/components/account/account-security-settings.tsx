import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { Scrollbar } from 'components/scrollbar';
import useTransition from 'next-translate/useTranslation';
import { ChangeEvent, useState } from 'react';
import { PasswordExp } from 'utils/regExp';

interface PropsType {
  handleCheckMeAlert: (type : 'DeleteAccount' | 'ChangePassword', newPassword : string) => void;
}


export const AccountSecuritySettings = ({handleCheckMeAlert} : PropsType) => {
  const {t} = useTransition("mypage");
  const [newPassword, setNewPassword] = useState<string>('');
  const [checkNewPassword, setCheckNewPassword] = useState<string>('');
  const [isSame, setIsSame] = useState<boolean>();

  const changePassword = () => handleCheckMeAlert('ChangePassword', newPassword);

  const handleChangeNewPassword = (event: ChangeEvent<HTMLInputElement>): void => {
    setNewPassword(event.target.value);
  };

  const handleChangeNewPasswordCheck = (event: ChangeEvent<HTMLInputElement>): void => {
    setCheckNewPassword(event.target.value);
    if(newPassword != event.target.value) {
      setIsSame(true);
    }
    else {
      setIsSame(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={2}
              xs={12}
            >
              <Typography variant="h6" mt={'5px'}>
              {t("ChangePassword")}
              </Typography>
            </Grid>
            <Grid
              item
              md={10}
              sm={12}
              xs={12}
            >
              <Box
                sx={{
                  display: 'flex'
                }}
              >
                <TextField
                  label={t("NewPassword")}
                  type="password"
                  defaultValue={newPassword}
                  onChange={handleChangeNewPassword}
                  size="small"
                  sx={{
                    flexGrow: 1,
                    mr: 3,
                  }}
                  color={!newPassword.match(PasswordExp) ? 'primary' :'success'}
                  error={newPassword != '' && !newPassword.match(PasswordExp)}
                  helperText={newPassword != '' && !newPassword.match(PasswordExp) ? t('NewPasswordPatternCheck') : undefined}
                  FormHelperTextProps={{ style: { minHeight: '1.5em' } }}
                />
                <TextField
                  label={t("NewPasswordCheck")}
                  type="password"
                  defaultValue={checkNewPassword}
                  onChange={handleChangeNewPasswordCheck}
                  size="small"
                  sx={{
                    flexGrow: 1,
                    mr: 3,
                  }}
                  color={!!isSame ? 'primary' :'success'}
                  error={!!isSame}
                  helperText={!!isSame ? t('NotMatchesPassword') : undefined}
                  FormHelperTextProps={{ style: { minHeight: '1.5em' } }}
                />
                <Button onClick={changePassword}>
                  {t("Save")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6">
            {t("LoginHistory")}
          </Typography>
          <Typography
            color="textSecondary"
            sx={{ mt: 1 }}
            variant="body2"
          >
            {t("LoginHistoryInfo")}
          </Typography>
        </CardContent>
        <Scrollbar>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                {t("LoginType")}
                </TableCell>
                <TableCell>
                {t("IPAddress")}
                </TableCell>
                <TableCell>
                {t("Client")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">
                    Credentials login
                  </Typography>
                  <Typography
                    variant="body2"
                    color="body2"
                  >
                    on 10:40 AM 2021/09/01
                  </Typography>
                </TableCell>
                <TableCell>
                  95.130.17.84
                </TableCell>
                <TableCell>
                  Chrome, Mac OS 10.15.7
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">
                    Credentials login
                  </Typography>
                  <Typography
                    color="body2"
                    variant="body2"
                  >
                    on 10:40 AM 2021/09/01
                  </Typography>
                </TableCell>
                <TableCell>
                  95.130.17.84
                </TableCell>
                <TableCell>
                  Chrome, Mac OS 10.15.7
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Scrollbar>
      </Card>
    </>
  );
};
