import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Footer } from 'layout/footer';
import { MainNavbar } from 'layout/main-navbar';
import { MainSidebar } from 'layout/main-sidebar';
import useTranslation from 'next-translate/useTranslation';
import { MenuType } from 'types/menu';

export const getMenuList = () => {
  const {t} = useTranslation('common');
  const sections : MenuType[] = [
    {
      title: t('PortPolio'),
      links: [
        {
          title: t('MinNyeon'),
          href: '#'
        },
        {
          title: t('YeonJin'),
          href: '#'
        }
      ]
    },
    {
      title: t('Community'),
      links: [
        {
          title: t('Chatting'),
          href: '#'
        },
        {
          title: t('Forum'),
          href: '#'
        },
        {
          title: t('Travels'),
          href: '#'
        },
        {
          title: t('Gallery'),
          href: '#'
        },
        {
          title: t('Study'),
          href: '#'
        },
        {
          title: t('Calendar'),
          href: '#'
        }
        
      ]
    },
    {
      title: t('Management'),
      links: [
        {
          title: t('Users'),
          href: '#'
        },
        {
          title: t('Group'),
          href: '#'
        },
        {
          title: t('DashBoard'),
          href: '#'
        }
      ]
    }
  ];

  return sections;
}



interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayoutRoot = styled('div')(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: '100%',
    paddingTop: 64
  })
);

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <MainLayoutRoot>
      <MainNavbar onOpenSidebar={(): void => setIsSidebarOpen(true)} />
      <MainSidebar
        onClose={(): void => setIsSidebarOpen(false)}
        open={isSidebarOpen}
      />
      {children}
      <Footer />
    </MainLayoutRoot>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node
};
