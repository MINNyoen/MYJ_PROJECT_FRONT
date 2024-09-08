import { Box, Drawer, Theme, useMediaQuery } from '@mui/material';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import type { FC } from 'react';
import { getMenuList } from './main-layout';
import { MainSidebarItem } from './main-sidebar-item';
import { AccountButton } from './navButton/account-button';
import { ContactsButton } from './navButton/contacts-button';
import { NotificationsButton } from './navButton/notifications-button';

interface MainSidebarProps {
  onClose?: () => void;
  open?: boolean;
}

export const MainSidebar: FC<MainSidebarProps> = (props) => {
  const { onClose, open } = props;
  const {t} = useTranslation('common');
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const handleSideChange = () => {
    open && onClose?.();
  };

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={!lgUp && open}
      PaperProps={{ sx: { width: 256 } }}
      sx={{
        zIndex: (theme) => theme.zIndex.appBar + 100
      }}
      variant="temporary"
    >
    <Box sx={{display: 'inline-flex', backgroundColor: 'primary.main', color: 'primary.contrastText', height:'80px'}}>
          <Box flexGrow={1} textAlign={"center"} height={'100%'} pt={'8%'}>
          <ContactsButton />
          </Box>
          <Box flexGrow={1} textAlign={"center"} height={'100%'} pt={'8%'}>
          <NotificationsButton />
          </Box>
          <Box flexGrow={1} textAlign={"center"} height={'100%'} pt={'8%'}>
          <AccountButton />
          </Box>
    </Box>
    {getMenuList().map((item, index)=>(
      <List
      key={index}
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {item.title}
        </ListSubheader>
      }
    >
      {item.links && item.links.map((item2, index2)=>(<MainSidebarItem key={index2} item={item2} handleSideChange={handleSideChange}/>))}
    </List>
    ))}
    </Drawer>
  );
};

MainSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
