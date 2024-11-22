import { useRef, useState } from 'react';
import type { ChangeEvent, FC, KeyboardEvent } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, IconButton, TextField, Tooltip } from '@mui/material';
import { PaperAirplane as PaperAirplaneIcon } from 'components/icons/paper-airplane';
import { Photograph as PhotographIcon } from 'components/icons/photograph';
import { PaperClip as PaperClipIcon } from 'components/icons/paper-clip';
import { useAuth } from 'hooks/use-auth';
import useTransition from 'next-translate/useTranslation';

interface ChatMessageAddProps {
  disabled?: boolean;
  onSend?: (value: string) => void;
}

export const ChatMessageAdd: FC<ChatMessageAddProps> = (props) => {
  const {t} = useTransition("chatting");
  const { disabled, onSend, ...other } = props;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [body, setBody] = useState<string>('');
  const { user } = useAuth();

  const handleAttach = (): void => {
    fileInputRef.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setBody(event.target.value);
  };

  const handleSend = (): void => {
    if (!body) {
      return;
    }

    onSend?.(body);
    setBody('');
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.code === 'Enter') {
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexShrink: 0,
        p: 3
      }}
      {...other}
    >
      <Avatar
        sx={{
          display: {
            xs: 'none',
            sm: 'inline'
          },
          mr: 2
        }}
        src={user?.avatar}
      />
      <TextField
        disabled={disabled}
        fullWidth
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        placeholder={t("MessagePlaceholder")}
        value={body}
        size="small"
      />

      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          m: -2,
          ml: 2
        }}
      >
        <Tooltip title={t("Send")}>
          <Box sx={{ m: 1 }}>
            <IconButton
              color="primary"
              disabled={!body || disabled}
              onClick={handleSend}
            >
              <PaperAirplaneIcon fontSize="small" />
            </IconButton>
          </Box>
        </Tooltip>
        <Tooltip title={t("AttachPhoto")}>
          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'inline-flex'
              },
              m: 1
            }}
          >
            <IconButton
              disabled={disabled}
              edge="end"
              onClick={handleAttach}
            >
              <PhotographIcon fontSize="small" />
            </IconButton>
          </Box>
        </Tooltip>
        <Tooltip title={t("AttachFile")}>
          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'inline-flex'
              },
              m: 1
            }}
          >
            <IconButton
              disabled={disabled}
              edge="end"
              onClick={handleAttach}
            >
              <PaperClipIcon fontSize="small" />
            </IconButton>
          </Box>
        </Tooltip>
      </Box>
      <input
        hidden
        ref={fileInputRef}
        type="file"
      />
    </Box>
  );
};

ChatMessageAdd.propTypes = {
  disabled: PropTypes.bool,
  onSend: PropTypes.func
};

ChatMessageAdd.defaultProps = {
  disabled: false
};
