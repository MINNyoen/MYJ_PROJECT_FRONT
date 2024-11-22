import { useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Avatar, Box, Card, CardMedia, Typography } from '@mui/material';
import useTransition from 'next-translate/useTranslation';
import { ko, enUS } from 'date-fns/locale';

type AuthorType = 'contact' | 'user';

interface ChatMessageProps {
  authorAvatar?: string | null;
  authorName: string;
  authorType: AuthorType;
  body: string;
  contentType: string;
  similarData: boolean;
  createdAt: number;
}

export const ChatMessage: FC<ChatMessageProps> = (props) => {
  const { body, contentType, createdAt, authorAvatar, authorName, similarData, authorType, ...other } = props;
  const [expandMedia, setExpandMedia] = useState<boolean>(false);

  const {t, lang} = useTransition("chatting");

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: authorType === 'user'
          ? 'row-reverse'
          : 'row',
        maxWidth: 500,
        ml: authorType === 'user' ? 'auto' : 0,
        mb: similarData ? 0.5 : 2
      }}
      {...other}
    >
      {authorType !== 'user' && 
           <Avatar
           src={authorAvatar || undefined}
           sx={{
             height: 32,
             ml: 0,
             mr: 1,
             width: 32
           }}
         />
      }
      <Box>
        {authorType !== 'user' &&
          <Box sx={{textAlign :'left', mb : 0.5}}>
            <Typography
              color="inherit"
              variant="subtitle2"
              >
              {authorName}
            </Typography>            
        </Box>
        }
        <Box display={'flex'} flexDirection={authorType === 'user'
                ? 'row-reverse'
                : 'row'}>
          <Card
            sx={{
              width: 'fit-content',
              backgroundColor: authorType === 'user'
                ? 'primary.main'
                : 'background.paper',
              color: authorType === 'user'
                ? 'text.primary'
                : 'text.primary',
              px: 1.5,
              py: 1
            }}
          >
            {
              contentType === 'image'
                ? (
                  <CardMedia
                    onClick={(): void => setExpandMedia(true)}
                    image={body}
                    sx={{ height: 200 }}
                  />
                )
                : (
                  <Typography
                    color="inherit"
                    variant="body1"
                  >
                    {body}
                  </Typography>
                )
            }
          </Card>
          <Box
            sx={{
              display: 'flex',
              justifyContent: authorType === 'user'
                ? 'flex-end'
                : 'flex-start',
              mt: 2.5,
              px: 0.5
            }}
          >
            <Typography
              color="textSecondary"
              noWrap
              variant="caption"
            >
              {!similarData && format(createdAt, 'a hh:mm', { locale: lang === 'ko' ? ko : enUS })}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

ChatMessage.propTypes = {
  authorAvatar: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  authorType: PropTypes.oneOf<AuthorType>(['contact', 'user']).isRequired,
  body: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
  createdAt: PropTypes.number.isRequired
};
