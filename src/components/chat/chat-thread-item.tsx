import type { FC } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceStrict } from 'date-fns';
import type { Locale } from 'date-fns';
import locale from 'date-fns/locale/en-US';
import { Avatar, AvatarGroup, Box, ListItem, ListItemAvatar, Typography } from '@mui/material';
import type { Thread } from 'types/chat';
import useTransition from 'next-translate/useTranslation';
import { useAuth } from 'hooks/use-auth';

interface ChatThreadItemProps {
  active?: boolean;
  onSelect?: () => void;
  thread: Thread;
}

export const ChatThreadItem: FC<ChatThreadItemProps> = (props) => {
  const { active, thread, onSelect, ...other } = props;
  const {user} = useAuth();
  
  const {t} = useTransition("chatting");

  const formatDistanceLocale: Record<string, string> = {
    lessThanXSeconds: '{{count}}' + t("LocaleSecond"),
    xSeconds: '{{count}}' + t("LocaleSecond"),
    halfAMinute: '30s' + t("LocaleSecond"),
    lessThanXMinutes: '{{count}} + t("LocaleMinute")',
    xMinutes: '{{count}}' + t("LocaleMinute"),
    aboutXHours: '{{count}}' + t("LocaleHour"),
    xHours: '{{count}}' + t("LocaleHour"),
    xDays: '{{count}}' + t("LocaleDay"),
    aboutXWeeks: '{{count}}' + t("LocaleWeek"),
    xWeeks: '{{count}}' + t("LocaleWeek"),
    aboutXMonths: '{{count}}' + t("LocaleMonth"),
    xMonths: '{{count}}' + t("LocaleMonth"),
    aboutXYears: '{{count}}' + t("LocaleYear"),
    xYears: '{{count}}' + t("LocaleYear"),
    overXYears: '{{count}}' + t("LocaleYear"),
    almostXYears: '{{count}}' + t("LocaleYear")
  };
  
  const customLocale: Locale = {
    ...locale,
    formatDistance: (token, count, options) => {
      options = options || {};
  
      const result = formatDistanceLocale[token].replace('{{count}}', count);
  
      if (options.addSuffix) {
        if (options.comparison > 0) {
          return 'in ' + result;
        } else {
          return result + ' ' + t("ago");
        }
      }
  
      return result;
    }
  };

  const recipients = thread.participants.length === 1 ? thread.participants : thread.participants.filter((i) => i.userSid.toString() !== user?.userSid?.toString());;
  const lastMessage = thread.messages[thread.messages.length - 1];
  const name = recipients
    .reduce((names: string[], participant) => [...names, participant.userNm], [])
    .join(', ');
  let content = '';

  if (lastMessage) {
    content = lastMessage.contentType === 'image'
      ? 'Sent a photo'
      : lastMessage.body;
  }

  return (
    <ListItem
      disableGutters
      disablePadding
      divider
      onClick={onSelect}
      sx={{
        ...(active && {
          backgroundColor: 'action.selected'
        }),
        cursor: 'pointer',
        overflow: 'hidden',
        px: 2,
        py: 3
      }}
      {...other}
    >
      <ListItemAvatar
        sx={{
          display: 'flex',
          justifyContent: {
            sm: 'flex-start',
            xs: 'center'
          }
        }}
      >
        <AvatarGroup
          max={2}
          sx={{
            '& .MuiAvatar-root': recipients.length > 1
              ? {
                height: 26,
                width: 26,
                '&:nth-of-type(2)': {
                  mt: '10px'
                }
              }
              : {
                height: 36,
                width: 36
              }
          }}
        >
          {recipients.map((recipient) => (
            <Avatar
              key={recipient.userSid}
              src={recipient.avatar || undefined}
            />
          ))}
        </AvatarGroup>
      </ListItemAvatar>
      <Box
        sx={{
          flexGrow: 1,
          mr: 2,
          overflow: 'hidden'
        }}
      >
        <Typography
          noWrap
          variant="subtitle2"
        >
          {name}
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          {Boolean(thread.unreadCount && thread.unreadCount > 0) && (
            <Box
              sx={{
                backgroundColor: 'primary.main',
                borderRadius: '50%',
                height: 8,
                mr: 1,
                width: 8
              }}
            />
          )}
          <Typography
            color="textSecondary"
            noWrap
            sx={{ flexGrow: 1 }}
            variant="subtitle2"
          >
            {content}
          </Typography>
        </Box>
      </Box>
      <Typography
        color="textSecondary"
        sx={{ whiteSpace: 'nowrap' }}
        variant="caption"
      >
        {lastMessage && formatDistanceStrict(
          lastMessage.createdAt,
          new Date(),
          {
            addSuffix: true,
            locale: customLocale
          }
        )}
      </Typography>
    </ListItem>
  );
};

ChatThreadItem.propTypes = {
  active: PropTypes.bool,
  onSelect: PropTypes.func,
  // @ts-ignore
  thread: PropTypes.object.isRequired
};

ChatThreadItem.defaultProps = {
  active: false
};
