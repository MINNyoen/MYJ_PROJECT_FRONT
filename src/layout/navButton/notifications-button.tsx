import { useEffect, useMemo, useRef, useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { format, subDays, subHours } from 'date-fns';
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Tooltip,
  Typography
} from '@mui/material';
import { ChatAlt as ChatAltIcon } from 'components/icons/chat-alt';
import { MailOpen as MailOpenIcon } from 'components/icons/mail-open';
import { X as XIcon } from 'components/icons/x';
import { UserCircle as UserCircleIcon } from 'components/icons/user-circle';
import { Notification } from 'types/notification';
import { Bell as BellIcon } from 'components/icons/bell';
import { Scrollbar } from 'components/scrollbar';
import useTranslation from 'next-translate/useTranslation';
import toast from 'react-hot-toast';

interface NotificationsPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  onUpdateUnread?: (value: number) => void;
  open?: boolean;
}

const now = new Date();

const data: Notification[] = [
  {
    id: '5e8883f1b51cc1956a5a1ec0',
    author: '김민년',
    avatar: undefined,
    createdAt: subHours(now, 2).getTime(),
    job: '메세지를 보냈습니다.',
    read: true,
    type: 'case_1'
  },
  {
    id: 'bfb21a370c017acc416757c7',
    author: '김연진',
    avatar: undefined,
    createdAt: subHours(now, 2).getTime(),
    job: '일정을 추가하였습니다.',
    read: false,
    type: 'case_1'
  },
  {
    id: '20d9df4f23fff19668d7031c',
    createdAt: subDays(now, 1).getTime(),
    description: '내용 쓸거',
    read: true,
    type: 'case_2'
  },
  {
    id: '5e8883fca0e8612044248ecf',
    author: '김연진',
    avatar: undefined,
    company: '????',
    createdAt: subHours(now, 2).getTime(),
    read: false,
    type: 'case_3'
  }
];

const getNotificationContent = (notification: Notification): JSX.Element | null => {
  switch (notification.type) {
    case 'case_1':
      return (
        <>
          <ListItemAvatar sx={{ mt: 0.5 }}>
            <Avatar src={notification.avatar}>
              <UserCircleIcon fontSize="small" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={(
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexWrap: 'wrap'
                }}
              >
                <Typography
                  sx={{ mr: 0.5 }}
                  variant="subtitle2"
                >
                  {notification.author}
                </Typography>
                <Typography
                  sx={{ mr: 0.5 }}
                  variant="body2"
                >
                  case_1
                </Typography>
                <br/>
                <Link
                  href="/dashboard/jobs"
                  underline="always"
                  variant="body2"
                >
                  {notification.job}
                </Link>
              </Box>
            )}
            secondary={(
              <Typography
                color="textSecondary"
                variant="caption"
              >
                {format(notification.createdAt, 'MMM dd, h:mm a')}
              </Typography>
            )}
            sx={{ my: 0 }}
          />
        </>
      );
    case 'case_2':
      return (
        <>
          <ListItemAvatar sx={{ mt: 0.5 }}>
            <Avatar>
              <ChatAltIcon fontSize="small" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={(
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexWrap: 'wrap'
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ mr: 0.5 }}
                >
                  case_2
                </Typography>
                <br/>
                <Typography variant="body2">
                  {notification.description}
                </Typography>
              </Box>
            )}
            secondary={(
              <Typography
                color="textSecondary"
                variant="caption"
              >
                {format(notification.createdAt, 'MMM dd, h:mm a')}
              </Typography>
            )}
            sx={{ my: 0 }}
          />
        </>
      );
    case 'case_3':
      return (
        <>
          <ListItemAvatar sx={{ mt: 0.5 }}>
            <Avatar src={notification.avatar}>
              <UserCircleIcon fontSize="small" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={(
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexWrap: 'wrap',
                  m: 0
                }}
              >
                <Typography
                  sx={{ mr: 0.5 }}
                  variant="subtitle2"
                >
                  {notification.author}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mr: 0.5 }}
                >
                  case_3
                </Typography>
                <br/>
                <Link
                  href="/dashboard/jobs"
                  underline="always"
                  variant="body2"
                >
                  {notification.company}
                </Link>
              </Box>
            )}
            secondary={(
              <Typography
                color="textSecondary"
                variant="caption"
              >
                {format(notification.createdAt, 'MMM dd, h:mm a')}
              </Typography>
            )}
            sx={{ my: 0 }}
          />
        </>
      );
    default:
      return null;
  }
};

const NotificationsPopover: FC<NotificationsPopoverProps> = (props) => {
  const { anchorEl, onClose, onUpdateUnread, open, ...other } = props;
  const [notifications, setNotifications] = useState<Notification[]>(data);
  const unread = useMemo(
    () => notifications.reduce(
      (acc, notification) => acc + (notification.read ? 0 : 1),
      0
    ),
    [notifications]
  );

  const {t} = useTranslation('common');

  useEffect(
    () => {
      onUpdateUnread?.(unread);
    },
    [onUpdateUnread, unread]
  );

  const handleMarkAllAsRead = (): void => {
    setNotifications((prevState) => prevState.map((notification) => ({
      ...notification,
      read: true
    })));
  };

  const handleRemoveOne = (notificationId: string) => {
    setNotifications((prevState) => prevState.filter(
      (notification) => notification.id !== notificationId
    ));
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 380} }}
      transitionDuration={0}
      {...other}
    >
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          py: 2
        }}
      >
        <Typography
          color={'inherit'}
          variant="h6"
        >
          {t('Notifications')}
        </Typography>
        <Tooltip title="Mark all as read">
          <IconButton
            onClick={handleMarkAllAsRead}
            size="small"
            sx={{ color: 'inherit' }}
          >
            <MailOpenIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      {notifications.length === 0
        ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2">
            {t('NotificationsNo')}
            </Typography>
          </Box>
        )
        : (
          <Scrollbar sx={{ maxHeight: 400 }}>
            <List disablePadding>
              {notifications.map((notification) => (
                <ListItem
                  divider
                  key={notification.id}
                  sx={{
                    alignItems: 'flex-start',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    },
                    '& .MuiListItemSecondaryAction-root': {
                      top: '24%'
                    }
                  }}
                  secondaryAction={(
                    <Tooltip title="Remove">
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveOne(notification.id)}
                        size="small"
                      >
                        <XIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                >
                  {getNotificationContent(notification)}
                </ListItem>
              ))}
            </List>
          </Scrollbar>
        )
      }
    </Popover>
  );
};

NotificationsPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  onUpdateUnread: PropTypes.func,
  open: PropTypes.bool
};


export const NotificationsButton = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [unread, setUnread] = useState<number>(0);
  const [openPopover, setOpenPopover] = useState<boolean>(false);

  const {t} = useTranslation('common');
  // Unread notifications should come from a context and be shared with both this component and
  // notifications popover. To simplify the demo, we get it from the popover

  const handleOpenPopover = (): void => {
    //개발을 위한 테스트 중중
    toast('현재 개발 중인 메뉴입니다!', {icon : '🧑🏻‍💻'});
    return;
    setOpenPopover(true);
  };

  const handleClosePopover = (): void => {
    setOpenPopover(false);
  };

  const handleUpdateUnread = (value: number): void => {
    setUnread(value);
  };

  return (
    <>
      <Tooltip title={t('Notifications')} color={'inherit'}>
        <IconButton
          ref={anchorRef}
          sx={{color: 'unset'}}
          onClick={handleOpenPopover}
        >
          <Badge
            color="error"
            badgeContent={0}
          >
            <BellIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>
      <NotificationsPopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        onUpdateUnread={handleUpdateUnread}
        open={openPopover}
      />
    </>
  );
};