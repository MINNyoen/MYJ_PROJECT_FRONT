import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
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
import { getContacts } from 'slices/chat';
import { useDispatch, useSelector } from 'store';
import { StatusIndicator } from 'components/status-indicator';
import { Users as UsersIcon } from 'components/icons/users';
import useTranslation from 'next-translate/useTranslation';

interface ContactsPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

const ContactsPopover: FC<ContactsPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const dispatch = useDispatch();
  const { contacts } = useSelector((state) => state.chat);

  const {t} = useTranslation('common');

  useEffect(
    () => {
      dispatch(getContacts());
    },
    []
  );

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={!!open}
      PaperProps={{
        sx: {
          p: 2,
          width: 320
        }
      }}
      transitionDuration={0}
      {...other}
    >
      <Typography variant="h6">
        {t('Contacts')}
      </Typography>
      <Divider sx={{mt: 1}}/>
      <Box sx={{ mt: 2 }}>
        <List disablePadding>
          {contacts.allIds.map((contactId) => {
            const contact = contacts.byId[contactId];

            return (
              <ListItem
                disableGutters
                key={contact.id}
              >
                <ListItemAvatar>
                  <Avatar
                    src={contact.avatar}
                    sx={{ cursor: 'pointer' }}
                  />
                </ListItemAvatar>
                <ListItemText
                  disableTypography
                  primary={(
                    <Link
                      color="textPrimary"
                      noWrap
                      sx={{ cursor: 'pointer' }}
                      underline="none"
                      variant="subtitle2"
                    >
                      {contact.name}
                    </Link>
                  )}
                />
                {
                  contact.isActive
                    ? (
                      <StatusIndicator
                        size="small"
                        status="online"
                      />
                    )
                    : contact.lastActivity && (
                      <Typography
                        color="textSecondary"
                        noWrap
                        variant="caption"
                      >
                        {formatDistanceToNowStrict(contact.lastActivity)}
                        {' '}
                        {t('ago')}
                      </Typography>
                    )
                }
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Popover>
  );
};

ContactsPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

export const ContactsButton = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openPopover, setOpenPopover] = useState<boolean>(false);

  const {t} = useTranslation('common');

  const handleOpenPopover = (): void => {
    setOpenPopover(true);
  };

  const handleClosePopover = (): void => {
    setOpenPopover(false);
  };

  return (
    <>
      <Tooltip title={t("Contacts")}>
        <IconButton
          onClick={handleOpenPopover}
          sx={{ color: 'unset' }}
          ref={anchorRef}
        >
          <UsersIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <ContactsPopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        open={openPopover}
      />
    </>
  );
};
