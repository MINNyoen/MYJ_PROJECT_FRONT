import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { authApi } from 'api/auth-api';
import useTransition from 'next-translate/useTranslation';
import { useState } from 'react';
import { EmailExp } from 'utils/regExp';

interface pwdRFormDialog {
  open : boolean;
  handleDialogClose : VoidFunction;
}

export default function PwdRFormDialog(
{open, handleDialogClose} : pwdRFormDialog
) {
  const {t:l} = useTransition('login');
  const {t} = useTransition('common');

  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState(false);

  const pwdRecovery = async () => {
    if(EmailExp.test(email)){
      setError(false);
      authApi.lostChangePwd(email).then(()=>handleDialogClose());
    }
    else{
      setError(true);
    }
  }
  return (
    <div>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>{l('PasswordRecovery')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {l('PasswordRecoveryContent')}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={l('E-Mail')}
            type="email"
            onChange={(e)=>{setEmail(e.currentTarget.value)}}
            fullWidth
            variant="standard"
            error={error}
            helperText={error ? l('valEmail-t') : undefined}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>{t('Cancel')}</Button>
          <Button onClick={pwdRecovery}>{t('Ok')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}