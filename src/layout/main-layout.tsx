import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Footer } from 'layout/footer';
import { MainNavbar } from 'layout/main-navbar';
import { MainSidebar } from 'layout/main-sidebar';
import useTranslation from 'next-translate/useTranslation';
import { MenuType } from 'types/menu';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import InterestsIcon from '@mui/icons-material/Interests';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CollectionsIcon from '@mui/icons-material/Collections';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ForumIcon from '@mui/icons-material/Forum';
import SubjectIcon from '@mui/icons-material/Subject';
import ComputerIcon from '@mui/icons-material/Computer';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import path from 'components/path.json';
import { Box } from '@mui/material';

export const getMenuList = () => {
  const viewBox : string = '2 0 25 25';
  const {t} = useTranslation('common');
  const sections : MenuType[] = [
    {title: t('AboutUs'),
    icon: <AccountBoxIcon viewBox={viewBox}/>,
    links:[
      {
        title: t('PortPolio'),
        links: [
            {
              title: t('MinNyeon'),
              icon: <ComputerIcon/>,
            },
            {
              title: t('YeonJin'),
              icon: <HealthAndSafetyIcon/>,
            }
          ]
        }
      ]
    },
    {
      title: t('ForUs'),
      icon: <InterestsIcon viewBox={viewBox}/>,
      links:[
        {
          title: t('Community'),
          links: [
            {
              title: t('Chatting'),
              icon: <ForumIcon/>,
              href: path.pages.minyeonjin.community.chatting
            },
            {
              title: t('Board'),
              icon: <SubjectIcon/>,
              href: path.pages.minyeonjin.community.board
            }
          ]
        },
        {
          title: t('Planning'),
          links: [
            {
              title: t('Kanban'),
              icon: <AutoStoriesIcon/>,
              href: path.pages.minyeonjin.planning.kanban
            },
            {
              title: t('Calendar'),
              icon: <CalendarMonthIcon/>,
              href: path.pages.minyeonjin.planning.calendar
            }
          ]
        }
        ,{
          title: t('Memories'),
          links : [
            {
              title: t('Travels'),
              icon: <FlightTakeoffIcon/>,
            },
            {
              title: t('Gallery'),
              icon: <CollectionsIcon/>,
            },
          ]
        }
      ]
    },
    {
      title: t('ManageToUs'),
      icon: <SettingsIcon viewBox={viewBox}/>,
      links: [
        {
          title: t('Management'),
          links: [
            {
              title: t('Users'),
              icon: <ManageAccountsIcon/>,
            },
            {
              title: t('Group'),
              icon: <GroupIcon/>,
            },
            {
              title: t('DashBoard'),
              icon: <DashboardIcon/>,
            }
          ]
        }
      ]
    },
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
        <Box component={'main'}>
        {children}
        </Box>
        <Footer />
      </MainLayoutRoot>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node
};
