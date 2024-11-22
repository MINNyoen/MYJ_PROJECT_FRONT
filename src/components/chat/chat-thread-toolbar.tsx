import type { FC } from 'react';
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceStrict } from 'date-fns';
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from '@mui/material';
import { Bell as BellIcon } from 'components/icons/bell';
import { Ban as BanIcon } from 'components/icons/ban';
import { DotsHorizontal as DotsHorizontalIcon } from 'components/icons/dots-horizontal';
import { Trash as TrashIcon } from 'components/icons/trash';
import type { Contact } from 'types/chat';
import useTransition from 'next-translate/useTranslation';
import locale from 'date-fns/locale/en-US';
import { useAuth } from 'hooks/use-auth';

interface ChatThreadToolbarProps {
  participants: Contact[];
}

export const ChatThreadToolbar: FC<ChatThreadToolbarProps> = (props) => {
  const { participants, ...other } = props;
  const {t} = useTransition("chatting");
  const moreRef = useRef<HTMLButtonElement | null>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const {user} = useAuth();

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

  const recipients = participants.length === 1 ? participants : participants.filter((i) => i.userSid.toString() !== user?.userSid?.toString());

  const name = recipients.reduce((
    names: string[],
    participant
  ) => [...names, participant.userNm], []).join(', ');

  const handleMenuOpen = (): void => {
    setOpenMenu(true);
  };

  const handleMenuClose = (): void => {
    setOpenMenu(false);
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'background.paper',
        borderBottomColor: 'divider',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        display: 'flex',
        flexShrink: 0,
        minHeight: 64,
        px: 2,
        py: 1
      }}
      {...other}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex'
        }}
      >
        <AvatarGroup
          max={2}
          sx={{
            ...(recipients.length > 1 && {
              '& .MuiAvatar-root': {
                height: 30,
                width: 30,
                '&:nth-of-type(2)': {
                  mt: '10px'
                }
              }
            })
          }}
        >
          {recipients.map((recipient) => (
            <Avatar
              key={recipient.userSid}
              src={recipient.avatar || undefined}
            />
          ))}
        </AvatarGroup>
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle2">
            {name}
          </Typography>
          {Boolean(recipients.length === 1 && recipients[0].lastActivity && recipients[0].userSid.toString() !== user?.userSid?.toString()) && (
            <Typography
              color="textSecondary"
              variant="caption"
            >
              {t("LastActive")}
              {' '}
              {formatDistanceStrict(
          recipients[0].lastActivity!,
          new Date(),
          {
            addSuffix: true,
            locale: customLocale
          }
        )}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Tooltip title={t("MoreOptions")}>
        <IconButton
          onClick={handleMenuOpen}
          ref={moreRef}
        >
          <DotsHorizontalIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={moreRef.current}
        keepMounted
        onClose={handleMenuClose}
        open={openMenu}
      >
        <MenuItem>
          <ListItemIcon>
            <BanIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("BlockContact")} />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <TrashIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("DeleteThread")} />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <BellIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("MuteNotifications")} />
        </MenuItem>
      </Menu>
    </Box>
  );
};

ChatThreadToolbar.propTypes = {
  // @ts-ignore
  participants: PropTypes.array
};

ChatThreadToolbar.defaultProps = {
  participants: []
};
