import { AppBar, Box, Button, Container, IconButton, Toolbar } from '@mui/material';
import { Menu as MenuIcon } from 'components/icons/menu';
import { Logo } from 'components/logo';
import useTranslation from 'next-translate/useTranslation';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { FC } from 'react';
import { MenuType } from 'types/menu';
import { getMenuList } from './main-layout';
import { MainNavbarItem } from './main-navbar-item';

interface MainNavbarProps {
  onOpenSidebar?: () => void;
}

export const MainNavbar: FC<MainNavbarProps> = (props) => {
  const { onOpenSidebar } = props;
  const {t} = useTranslation('common');

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottomColor: 'divider',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        color: 'text.secondary'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ minHeight: 64, ml: 5, mr: 5 }}
        >
          <NextLink
            href="/"
            passHref
          >
            <a>
              <Logo
                sx={{
                  display: {
                    md: 'inline',
                    xs: 'none'
                  },
                  height: 40,
                  width: 40
                }}
              />
            </a>
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
            <MenuIcon fontSize="small" />
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
            <MainNavbarItem key={'topMenu - ' + index.toString()} title={item.title} href={item.href} icon={item.icon} links={item.links}/>))}
            <Button
              component="a"
              href="#"
              size="medium"
              sx={{ ml: 2 }}
              target="_blank"
              variant="contained"
            >
              {t('Login')}
            </Button>
          </>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

MainNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};
