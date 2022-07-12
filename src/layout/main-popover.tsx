import { ListItemText, MenuItem, Popover, Typography } from '@mui/material';
import type { FC } from 'react';
import { MenuType } from 'types/menu';

interface MainPopoverProps {
  anchorEl: null | Element;
  onClose: () => void;
  open?: boolean;
  links?: MenuType[];
}

export const MainPopover: FC<MainPopoverProps> = (props) => {
  const { anchorEl, onClose, open, links, ...other } = props;

  return (
    <Popover
      
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom'
      }}
      keepMounted
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 240 } }}
      transitionDuration={1000}
      {...other}
    >
      {links && links.map((item: MenuType, index: number) => (
        <MenuItem
          onClick={() => onClose?.()}
          key={'bMenuItem - ' + index.toString()}
        >
          {/* <ListItemIcon>
            <Box
              sx={{
                display: 'flex',
                height: 20,
                width: 20,
                '& img': {
                  width: '100%'
                }
              }}
            >
              <img
                alt={languageOptions[language].label}
                src={languageOptions[language].icon}
              />
            </Box>
          </ListItemIcon> */}
          <ListItemText
            primary={(
              <Typography variant="subtitle2">
                {item.title}
              </Typography>
            )}
          />
        </MenuItem>
      ))}
    </Popover>
  );
};
