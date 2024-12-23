import { useState } from 'react';
import type { ChangeEvent, FC, MutableRefObject } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Box, Button, Drawer, IconButton, List, Typography, useMediaQuery } from '@mui/material';
import type { Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { chatApi } from 'api/chat-api';
import { Plus as PlusIcon } from 'components/icons/plus';
import { X as XIcon } from 'components/icons/x';
import { useSelector } from 'store';
import type { Contact } from 'types/chat';
import { Scrollbar } from 'components/scrollbar';
import { ChatContactSearch } from './chat-contact-search';
import { ChatThreadItem } from './chat-thread-item';
import path from 'components/path.json';
import { useAuth } from 'hooks/use-auth';
import useTransition from 'next-translate/useTranslation';

interface ChatSidebarProps {
  containerRef?: MutableRefObject<HTMLDivElement | null>;
  onClose?: () => void;
  open?: boolean;
}

const ChatSidebarDesktop = styled(Drawer)({
  flexShrink: 0,
  width: 380,
  '& .MuiDrawer-paper': {
    position: 'relative',
    width: 380
  }
});

const ChatSidebarMobile = styled(Drawer)({
  maxWidth: '100%',
  width: 380,
  '& .MuiDrawer-paper': {
    height: 'calc(100% - 64px)',
    maxWidth: '100%',
    top: 64,
    width: 380
  }
});

export const ChatSidebar: FC<ChatSidebarProps> = (props) => {
  const {t} = useTransition("chatting");
  const { containerRef, onClose, open, ...other } = props;
  const router = useRouter();
  const { threads, activeThreadId } = useSelector((state) => state.chat);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const { user } = useAuth();

  const handleGroupClick = (): void => {
    if (!mdUp) {
      onClose?.();
    }
  };

  const handleSearchClickAway = (): void => {
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const handleSearchChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    try {
      const { value } = event.target;

      setSearchQuery(value);

      if (value) {
        const data = await chatApi.getContacts(value);

        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchFocus = (): void => {
    setIsSearchFocused(true);
  };

  const handleSearchSelect = async (result: Contact): Promise<void> => {
    setIsSearchFocused(false);
    setSearchQuery('');

    if (!mdUp) {
      onClose?.();
    }
    const recipientIds:string[] = [];
    recipientIds.push(result.userSid);
    if(user?.userSid?.toString() && result.userSid != user?.userSid?.toString()) {
      recipientIds.push(user?.userSid?.toString());
    }
    const roomId = await chatApi.getChatThreadByParticipants(recipientIds);
    router.push(path.pages.minyeonjin.community.chatting+`?threadKey=${roomId}`).catch(console.error);
  };

  const handleSelectThread = (threadId: string): void => {
    if (!mdUp) {
      onClose?.();
    }

    router.push(path.pages.minyeonjin.community.chatting+`?threadKey=${threads.byId[threadId].roomId}`).catch(console.error);
  };

  const content = (
    <div>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          p: 2
        }}
      >
        <Typography variant="h5">
          {t("Chats")}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <NextLink
          href={path.pages.minyeonjin.community.chatting + "?compose=true"}
          passHref
        >
          <Button
            onClick={handleGroupClick}
            startIcon={<PlusIcon />}
            variant="contained"
          >
            {t("Group")}
          </Button>
        </NextLink>
        <IconButton
          onClick={onClose}
          sx={{
            display: {
              sm: 'none'
            },
            ml: 2
          }}
        >
          <XIcon fontSize="small" />
        </IconButton>
      </Box>
      <ChatContactSearch
        isFocused={isSearchFocused}
        onChange={handleSearchChange}
        onClickAway={handleSearchClickAway}
        onFocus={handleSearchFocus}
        onSelect={handleSearchSelect}
        query={searchQuery}
        results={searchResults}
      />
      <Box
        sx={{
          borderTopColor: 'divider',
          borderTopStyle: 'solid',
          borderTopWidth: 1,
          display: isSearchFocused ? 'none' : 'block'
        }}
      >
        <Scrollbar>
          <List disablePadding>
            {threads.allIds.map((threadId) => (
              <ChatThreadItem
                active={activeThreadId === threadId}
                key={threadId}
                onSelect={(): void => handleSelectThread(threadId)}
                thread={threads.byId[threadId]}
              />
            ))}
          </List>
        </Scrollbar>
      </Box>
    </div>
  );

  if (mdUp) {
    return (
      <ChatSidebarDesktop
        anchor="left"
        open={open}
        SlideProps={{ container: containerRef?.current }}
        variant="persistent"
        {...other}
      >
        {content}
      </ChatSidebarDesktop>
    );
  }

  return (
    <ChatSidebarMobile
      anchor="left"
      ModalProps={{ container: containerRef?.current }}
      onClose={onClose}
      open={open}
      SlideProps={{ container: containerRef?.current }}
      variant="temporary"
      {...other}
    >
      {content}
    </ChatSidebarMobile>
  );
};

ChatSidebar.propTypes = {
  containerRef: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
