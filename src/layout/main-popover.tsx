import { Fade, Link, ListItemText, MenuItem, Paper, Popper, Typography } from '@mui/material';
import type { FC } from 'react';
import { MenuType } from 'types/menu';
import NextLink from 'next/link';

interface MainPopoverProps {
  anchorEl: null | Element;
  onClose: () => void;
  open?: boolean;
  links?: MenuType[];
}

export const MainPopover: FC<MainPopoverProps> = (props) => {
  const { anchorEl, onClose, open, links, ...other } = props;

  return (
    <Popper
      anchorEl={anchorEl}
      open={!!open}
      sx={{zIndex: 1300}}
      transition
      
      {...other}
    >
     {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={1000}>
            <Paper sx={{opacity: '1 !important', visibility: 'visible !important'}}>
      {links && links.map((item: MenuType, index: number) => (
        <NextLink
        href={item.href ? item.href : "#"}
        key={'bMenuItem - ' + index.toString()}
        passHref>
          <Link
            color="textSecondary"
            underline="none"
            variant="subtitle2"
            >
            <MenuItem
              onClick={() => onClose()}
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
          </Link>
        </NextLink>
      ))}
      </Paper>
      </Fade>
     )}
    </Popper>
  );
};