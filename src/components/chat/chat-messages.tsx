import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import type { Message, Contact } from 'types/chat';
import { ChatMessage } from './chat-message';
import { useAuth } from 'hooks/use-auth';
import { format } from 'date-fns';
import useTransition from 'next-translate/useTranslation';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface ChatMessagesProps {
  messages: Message[];
  participants: Contact[];
}

export const ChatMessages: FC<ChatMessagesProps> = (props) => {
  const { messages, participants, ...other } = props;
  const { user } = useAuth();
  let beforeDay: number;
  let beforeUser: number;

  const {t, lang} = useTransition("chatting");

  return (
    <Box
      sx={{ p: 2 }}
      {...other}
    >
      {messages.map((message, index) => {
        let change = false;
        let similarData = false;
        if(messages.length - 1 >= index + 1 && message.authorId === messages[index + 1].authorId && format(message.createdAt, 'a HH:mm') === format(messages[index + 1].createdAt, 'a HH:mm')) {
          similarData = true;
        }

        if(!beforeDay || format(message.createdAt, 'yyyyMMdd') !== format(beforeDay, 'yyyyMMdd')) {
          beforeDay = message.createdAt;
          change = true;
        }

        const participant = participants.find(
          (_participant) => _participant.userSid === message.authorId
        );
        let authorAvatar: string | undefined;
        let authorName: string;
        let authorType: 'user' | 'contact';

        if (user && message.authorId.toString() === user.userSid?.toString()) {
          authorAvatar = user?.avatar;
          authorName = 'Me';
          authorType = 'user';
        } else {
          authorAvatar = participant!.avatar;
          authorName = participant!.userNm;
          authorType = 'contact';
        }

        return (
          <>
            {change && (
              <Box display={'flex'} justifyContent={'center'}>
                <Box display={'flex'} sx={{backgroundColor: 'primary.light', px: 2, py: 0.5, borderRadius: 5}} >
                <CalendarMonthIcon/>
                <Typography sx={{pl: 0.5}}>
                {format(beforeDay, t("LocaleDateFormat"))}
                </Typography>
                </Box>
              </Box>
            )}
            <ChatMessage
              authorAvatar={authorAvatar}
              authorName={authorName}
              authorType={authorType}
              body={message.body}
              contentType={message.contentType}
              createdAt={message.createdAt}
              similarData={similarData}
              key={message.id}
            />
          </>
        );
      })}
    </Box>
  );
};

ChatMessages.propTypes = {
  // @ts-ignore
  messages: PropTypes.array,
  // @ts-ignore
  participants: PropTypes.array
};
