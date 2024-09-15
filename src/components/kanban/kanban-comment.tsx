import type { FC } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Avatar, Box, Paper, Typography } from '@mui/material';
import useTransition from 'next-translate/useTranslation';
import { KanbanCardAction } from './kanban-card-action';
import { deleteComment } from 'slices/kanban';
import toast from 'react-hot-toast';
import { useDispatch } from 'store';

interface KanbanCommentProps {
  commentId: string;
  createdAt: number;
  memberId: string;
  name: string;
  avatar: string;
  message: string;
}

export const KanbanComment: FC<KanbanCommentProps> = (props) => {
  const { createdAt, memberId, message, ...other } = props;
  const { t } = useTransition("kanban");
  const dispatch = useDispatch();



  const handleOnclick = async (): Promise<void> => {
    try {
      if (message) {
        await dispatch(deleteComment(props.commentId));
        toast.success(t('CommentDeleted'));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('ErrMsg'));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        mb: 2
      }}
      {...other}
    >
      <Box
        sx={{
          ml: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: 'auto'
        }}
      >
        <Avatar src={process.env.NEXT_PUBLIC_BACKEND_URL + props.avatar || undefined} />
        <Typography variant="subtitle2" mt={1}>
          {props.name}
        </Typography>
      </Box>
      <Box
        sx={{
          ml: 2,
          flexGrow: 1
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Paper
            sx={{
              flexGrow: 10,
              backgroundColor: 'background.default',
              mt: 1,
              p: 2
            }}
            variant="outlined"
          >
            <Typography variant="body2">
              {message}
            </Typography>

          </Paper>
          <KanbanCardAction
            sx={{ width: 'auto', ml: 1, mt: 1, flexGrow: 0.05 }}
            onClick={handleOnclick}
            variant='text'
          >
            {t('Delete')}
          </KanbanCardAction>
        </Box>
        <Typography
          color="textSecondary"
          component="p"
          sx={{ mt: 1, float: 'right' }}
          variant="caption"

        >
          {format(createdAt, t('DateFormat'))}
        </Typography>
      </Box>
    </Box>
  );
};

KanbanComment.propTypes = {
  createdAt: PropTypes.number.isRequired,
  memberId: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};
