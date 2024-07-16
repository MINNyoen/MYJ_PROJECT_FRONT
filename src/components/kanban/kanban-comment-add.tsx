import { useState } from 'react';
import type { ChangeEvent, FC, KeyboardEvent } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Avatar, Box, TextField } from '@mui/material';
import { addComment, getBoard } from 'slices/kanban';
import { useDispatch, useSelector } from 'store';
import { KanbanCardAction } from './kanban-card-action';

interface KanbanCommentAddProps {
  cardId: string;
}

export const KanbanCommentAdd: FC<KanbanCommentAddProps> = (props) => {
  const { cardId, ...other } = props;
  const dispatch = useDispatch();
  const { cards } = useSelector((state) => state.kanban);
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  const user = {
    avatar: '/static/mock-images/avatars/avatar-anika_visser.png'
  };
  const [message, setMessage] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  const handleOnclick = async (): Promise<void> => {
    try {
      if (message) {
        await dispatch(addComment(cards.byId[cardId], message));
        setMessage('');
        toast.success('Comment added!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <Box
      sx={{
        mt: 1,
        alignItems: 'center',
        display: 'flex'
      }}
      {...other}
    >
      <Avatar
        src={user.avatar}
        sx={{ mr: 2 }}
      />
      <TextField
        fullWidth
        onChange={handleChange}
        placeholder="Write a comment..."
        size="small"
        value={message}
      />
      <KanbanCardAction
        sx={{width: 'auto', ml: 1}}
        onClick={handleOnclick}
      >
        Comment
      </KanbanCardAction>
    </Box>
  );
};

KanbanCommentAdd.propTypes = {
  cardId: PropTypes.string.isRequired
};
