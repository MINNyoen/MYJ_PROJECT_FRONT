import { useEffect, useState } from 'react';
import type { FC } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  IconButton,
  Typography
} from '@mui/material';
import type { Settings } from 'contexts/settings-context';
import { useSettings } from 'hooks/use-settings';
import { X as XIcon } from 'components/icons/x';
// @ts-ignore
import KoLanguageIcon from './flag-ko.svg';
// @ts-ignore
import UsLanguageIcon from './flag-en.svg';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';

interface SettingsDrawerProps {
  onClose?: () => void;
  open?: boolean;
}

const themes = [
  {
    label: 'Ocean',
    value: 'blue',
    img: './blueTheme.jpg'
  },
  {
    label: 'Flower',
    value: 'pink',
    img: './pinkTheme.jpg'
  }
];

const languages = [
  {
    label: '한국어',
    value: 'ko',
    icon: KoLanguageIcon
  },
  {
    label: 'English',
    value: 'en',
    icon: UsLanguageIcon
  }
];

const getValues = (settings: Settings) => ({
  responsiveFontSizes: settings.responsiveFontSizes,
  language: settings.language,
  theme: settings.theme
});

export const SettingsDrawer: FC<SettingsDrawerProps> = (props) => {
  const { open, onClose, ...other } = props;
  const { settings, saveSettings } = useSettings();
  const [values, setValues] = useState<Settings>(getValues(settings));
  const { t } = useTranslation('common');

  useEffect(() => {
    setValues(getValues(settings));
  }, [settings]);

  const handleChange = (field: string, value: unknown): void => {
    setValues({
      ...values,
      [field]: value
    });
  };

  const handleSave = (): void => {
    saveSettings(values);
    onClose?.();
  };

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{ sx: { zIndex: 2000 } }}
      PaperProps={{ sx: { width: 320 } }}
      {...other}
    >
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          py: 2
        }}
      >
        <Typography
          color="inherit"
          variant="h6"
        >
          {t('ThemeSetting')}
        </Typography>
        <IconButton
          color="inherit"
          onClick={onClose}
        >
          <XIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          py: 4,
          px: 3
        }}
      >
        <Typography
          color="textSecondary"
          sx={{
            display: 'block',
            mb: 1
          }}
          variant="overline"
        >
          {t('ColorScheme')}
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            m: -1
          }}
        >
          {themes.map((theme) => {
            const { label, img: imgLink , value } = theme;
            return (
              <div key={value}>
                <Box
                  onClick={() => handleChange('theme', value)}
                  sx={{
                    borderColor: values.theme === value ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    borderStyle: 'solid',
                    borderWidth: 2,
                    cursor: 'pointer',
                    flexGrow: 1,
                    fontSize: 0,
                    m: 1,
                    overflow: 'hidden',
                    p: 1,
                    '& svg': {
                      height: 'auto',
                      width: '100%'
                    }
                  }}
                >
                  <Box
                    sx={{
                      '& img': {
                        width: 100
                      }
                    }}
                  >
                    <Image
                      src={imgLink} alt={''}
                    />
                  </Box>
                </Box>
                <Typography
                  align="center"
                  sx={{ mt: 1 }}
                  variant="subtitle2"
                >
                  {label}
                </Typography>
              </div>
            );
          })}
        </Box>
        <Typography
          color="textSecondary"
          sx={{
            display: 'block',
            mb: 1,
            mt: 4
          }}
          variant="overline"
        >
          {t('Settings')}
        </Typography>
        <div>
          <FormControlLabel
            control={(
              <Checkbox
                checked={values.responsiveFontSizes}
                name="direction"
                onChange={(event): void => handleChange(
                  'responsiveFontSizes',
                  event.target.checked
                )}
              />
            )}
            label={(
              <Typography variant="subtitle2">
                {t('ResponsiveFontSize')}
              </Typography>
            )}
          />
        </div>

        <Typography
          color="textSecondary"
          sx={{
            display: 'block',
            mb: 1
          }}
          variant="overline"
        >
          {t('LanguageSetting')}
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            justifyContent: 'space-around',
            display: 'flex',
            m: -1
          }}
        >
          {languages.map((language) => {
            const { label, icon: Icon , value } = language;
            return (
              <div key={value}>
                <Box
                  onClick={() => handleChange('language', value)}
                  sx={{
                    borderColor: values.language === value ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    borderStyle: 'solid',
                    borderWidth: 2,
                    cursor: 'pointer',
                    flexGrow: 1,
                    fontSize: 0,
                    m: 1,
                    overflow: 'hidden',
                    p: 1,
                    '& svg': {
                      height: 'auto',
                      width: '100%'
                    }
                  }}
                >
                  <Icon />
                </Box>
                <Typography
                  align="center"
                  sx={{ mt: 1 }}
                  variant="subtitle2"
                >
                  {label}
                </Typography>
              </div>
            );
          })}
        </Box>



        <Button
          color="primary"
          fullWidth
          onClick={handleSave}
          sx={{ mt: 3 }}
          variant="contained"
        >
          {t('SaveSettings')}
        </Button>
      </Box>
    </Drawer>
  );
};

SettingsDrawer.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
