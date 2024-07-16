import { ThemeOptions } from '@mui/material';

// Colors

const neutral = {
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827'
};

const divider = '#E6E8F0';

const primary = {
  main: '#7582EB',
  light: '#909BEF',
  dark: '#515BA4',
  contrastText: neutral[800]
};

const secondary = {
  main: '#10B981',
  light: '#3FC79A',
  dark: '#0B815A',
  contrastText: neutral[900]
};

const success = {
  main: '#14B8A6',
  light: '#43C6B7',
  dark: '#0E8074',
  contrastText: neutral[900]
};

const info = {
  main: '#2196F3',
  light: '#64B6F7',
  dark: '#0B79D0',
  contrastText: neutral[900]
};

const warning = {
  main: '#FFB020',
  light: '#FFBF4C',
  dark: '#B27B16',
  contrastText: neutral[900]
};

const error = {
  main: '#D14343',
  light: '#DA6868',
  dark: '#922E2E',
  contrastText: neutral[900]
};

const text = {
  nav: neutral[700],
  primary: neutral[600],
  secondary: neutral[800],
  disabled: 'rgba(255, 255, 255, 0.48)'
};

const background = {
  default: '#F9FAFC',
  secondary: '#6B7280',
  paper: '#FFFFFF',
  nav: '#7582EB',
  sidebar: {
    first: '#f5a59f',
    secondary: '#a56ded',
    third: '#f74fd0'
  },
  navtooltip: '#7582EB',
  calendar : {
    categoryBar : '#F6F8FF',
    button : primary.main
  }
};

export const minThemeOptions: ThemeOptions = {
  components: {
    MuiTooltip: {
      styleOverrides: {
        arrow: {
          color: background.navtooltip
        },
        tooltipArrow: {
          backgroundColor: background.navtooltip,
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: neutral[500],
          color: '#FFFFFF'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&.MuiChip-filledDefault': {
            backgroundColor: neutral[800],
            '& .MuiChip-deleteIcon': {
              color: neutral[500]
            }
          },
          '&.MuiChip-outlinedDefault': {
            borderColor: neutral[700],
            '& .MuiChip-deleteIcon': {
              color: neutral[700]
            }
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::placeholder': {
            opacity: 1,
            color: text.primary
          },
          '&::--webkit-autofill': {
            boxShadow: text.secondary
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: divider
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderColor: divider,
          borderStyle: 'solid',
          borderWidth: 1
        }
      }
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderColor: divider,
          borderStyle: 'solid',
          borderWidth: 1
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: neutral[700]
        },
        track: {
          backgroundColor: neutral[500],
          opacity: 1
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${divider}`
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: neutral[800],
          '.MuiTableCell-root': {
            color: neutral[300]
          }
        }
      }
    }
  },
  palette: {
    action: {
      active: neutral[400],
      hover: 'rgba(255, 255, 255, 0.04)',
      selected: 'rgba(255, 255, 255, 0.08)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
      disabled: 'rgba(255, 255, 255, 0.26)'
    },
    background,
    divider,
    error,
    info,
    mode: 'dark',
    neutral,
    primary,
    secondary,
    success,
    text,
    warning,
    
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.24)',
    '0px 1px 2px rgba(0, 0, 0, 0.24)',
    '0px 1px 4px rgba(0, 0, 0, 0.24)',
    '0px 1px 5px rgba(0, 0, 0, 0.24)',
    '0px 1px 6px rgba(0, 0, 0, 0.24)',
    '0px 2px 6px rgba(0, 0, 0, 0.24)',
    '0px 3px 6px rgba(0, 0, 0, 0.24)',
    '0px 4px 6px rgba(0, 0, 0, 0.24)',
    '0px 5px 12px rgba(0, 0, 0, 0.24)',
    '0px 5px 14px rgba(0, 0, 0, 0.24)',
    '0px 5px 15px rgba(0, 0, 0, 0.24)',
    '0px 6px 15px rgba(0, 0, 0, 0.24)',
    '0px 7px 15px rgba(0, 0, 0, 0.24)',
    '0px 8px 15px rgba(0, 0, 0, 0.24)',
    '0px 9px 15px rgba(0, 0, 0, 0.24)',
    '0px 10px 15px rgba(0, 0, 0, 0.24)',
    '0px 12px 22px -8px rgba(0, 0, 0, 0.24)',
    '0px 13px 22px -8px rgba(0, 0, 0, 0.24)',
    '0px 14px 24px -8px rgba(0, 0, 0, 0.24)',
    '0px 20px 25px rgba(0, 0, 0, 0.24)',
    '0px 25px 50px rgba(0, 0, 0, 0.24)',
    '0px 25px 50px rgba(0, 0, 0, 0.24)',
    '0px 25px 50px rgba(0, 0, 0, 0.24)',
    '0px 25px 50px rgba(0, 0, 0, 0.24)'
  ]
};
