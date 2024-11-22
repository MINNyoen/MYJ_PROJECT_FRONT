import { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Avatar, Box, IconButton, Typography, useMediaQuery } from '@mui/material';
import type { Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthGuard } from 'components/authentication/auth-guard';
import { MainLayout } from 'layout/main-layout';
import { ChatComposer } from 'components/chat/chat-composer';
import { ChatSidebar } from 'components/chat/chat-sidebar';
import { ChatThread } from 'components/chat/chat-thread';
import { ChatAlt2 as ChatAlt2Icon } from 'components/icons/chat-alt2';
import { MenuAlt4 as MenuAlt4Icon } from 'components/icons/menu-alt-4';
import { getThreads } from 'slices/chat';
import { useDispatch } from 'store';
import useTransition from 'next-translate/useTranslation';

const ChatInner = styled(
  'div',
  { shouldForwardProp: (prop) => prop !== 'open' }
)<{ open?: boolean; }>(
  ({ theme, open }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      marginLeft: -380
    },
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
      [theme.breakpoints.up('md')]: {
        marginLeft: 0
      },
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    })
  })
);

const Chatting: NextPage = () => {
  const {t} = useTransition("chatting");
  const router = useRouter();
  const dispatch = useDispatch();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const compose = router.query.compose as string | undefined === 'true';
  const threadKey = router.query.threadKey as string | undefined;
  const mdUp = useMediaQuery(
    (theme: Theme) => theme.breakpoints.up('md'),
    { noSsr: true }
  );

  useEffect(
    () => {
      dispatch(getThreads());
    },[]);

  useEffect(
    () => {
      if (!mdUp) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    },
    [mdUp]
  );

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const view = threadKey
    ? 'thread'
    : compose
      ? 'compose'
      : 'blank';

  return (
    <>
      <Head>
        <title>
          {t("Chatting")} | {t("MinYeonJin")}
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          position: 'relative',
          height: '100%',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            display: 'flex',
            height: '90vh',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }}
        >
          <ChatSidebar
            containerRef={rootRef}
            onClose={handleCloseSidebar}
            open={isSidebarOpen}
          />
          <ChatInner open={isSidebarOpen}>
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: 'background.paper',
                borderBottomColor: 'divider',
                borderBottomStyle: 'solid',
                borderBottomWidth: 1,
                display: 'flex',
                p: 2
              }}
            >
              <IconButton onClick={handleToggleSidebar}>
                <MenuAlt4Icon/>
              </IconButton>
            </Box>
            {view === 'thread' && <ChatThread threadKey={threadKey!} />}
            {view === 'compose' && <ChatComposer />}
            {view === 'blank' && (
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexGrow: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'text.primary',
                    height: 56,
                    width: 56
                  }}
                >
                  <ChatAlt2Icon fontSize="small" />
                </Avatar>
                <Typography
                  color="textSecondary"
                  sx={{ mt: 2 }}
                  variant="subtitle1"
                >
                  {t("Chatting_Main")}
                </Typography>
              </Box>
            )}
          </ChatInner>
        </Box>
      </Box>
    </>
  );
};

Chatting.getLayout = (page) => (
  <AuthGuard>
    <MainLayout>
      {page}
    </MainLayout>
  </AuthGuard>
);

export default Chatting;
