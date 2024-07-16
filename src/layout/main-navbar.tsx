import { AppBar, Box, Button, Container, IconButton, Link, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon } from 'components/icons/menu';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { FC } from 'react';
import { MenuType } from 'types/menu';
import { MainNavbarItem } from './main-navbar-item';
import { AccountButton } from './navButton/account-button';
import { ContactsButton } from './navButton/contacts-button';
import { NotificationsButton } from './navButton/notifications-button';
import { getMenuList } from './main-layout';

interface MainNavbarProps {
  onOpenSidebar?: () => void;
}

export const MainNavbar: FC<MainNavbarProps> = (props) => {
  const { onOpenSidebar } = props;

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: 'background.nav',
        color: 'white'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ minHeight: 64, ml: 1, mr: 1 }}
        >
          <NextLink
            href="/"
            passHref
          >
            <Link
              color="primary.contrastText"
              underline="none"
              variant="h4"
              >
                MinYeonJin
            </Link>
          </NextLink>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            onClick={onOpenSidebar}
            sx={{
              display: {
                md: 'none'
              }
            }}
          >
            <MenuIcon fontSize="medium" />
          </IconButton>
          <Box
            sx={{
              alignItems: 'center',
              display: {
                md: 'flex',
                xs: 'none'
              },
              pr: '200px'
            }}
          > 
          <>
            {getMenuList().map((item : MenuType, index: number)=>(
            <MainNavbarItem key={'topMenu - ' + index.toString()} title={item.title} href={item.href} icon={item.icon} links={item.links} />))}
          </>
          </Box>
          <Box
          sx={{
            display: {
              md: 'flex',
              xs: 'none'
            },
            color:"primary.contrastText"
          }}>
          <Box flexGrow={1} textAlign={"center"}>
          <ContactsButton />
          </Box>
          <Box flexGrow={1} textAlign={"center"}>
          <NotificationsButton />
          </Box>
          <Box flexGrow={1} textAlign={"center"} pl={1.5}>
          <AccountButton />
          </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

MainNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};
