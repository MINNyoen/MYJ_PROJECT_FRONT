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
import type { FC } from 'react';
import { useState } from 'react';
import useTransition from 'next-translate/useTranslation';

export const AccountSecuritySettings: FC = () => {
  const {t} = useTransition("mypage");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEdit = (): void => {
    setIsEditing(!isEditing);
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
              md={4}
              xs={12}
            >
              <Typography variant="h6">
              {t("ChangePassword")}
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
                  alignItems: 'center'
                }}
              >
                <TextField
                  disabled={!isEditing}
                  label={t("Password")}
                  type="password"
                  defaultValue="Thebestpasswordever123#"
                  size="small"
                  sx={{
                    flexGrow: 1,
                    mr: 3,
                    ...(!isEditing && {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'dotted'
                      }
                    })
                  }}
                />
                <Button onClick={handleEdit}>
                  {isEditing ? t("Save") : t("Edit")}
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
