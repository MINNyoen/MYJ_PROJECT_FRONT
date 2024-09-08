import { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import { Adjustments as AdjustmentsIcon } from 'components/icons/adjustments';
import { SettingsDrawer } from './settings-drawer';
import useTranslation from 'next-translate/useTranslation';

export const SettingsButton = () => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={t('Settings')}>
        <Fab
          onClick={handleOpen}
          size="medium"
          sx={{
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            bottom: 0,
            margin: (theme) => theme.spacing(4),
            position: 'fixed',
            right: 0,
            zIndex: 1900,
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
        >
          <AdjustmentsIcon fontSize="small" />
        </Fab>
      </Tooltip>
      <SettingsDrawer
        onClose={handleClose}
        open={open}
      />
    </>
  );
};
