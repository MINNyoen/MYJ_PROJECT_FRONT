import { useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Avatar, Box, TextField } from '@mui/material';
import { addComment } from 'slices/kanban';
import { useDispatch, useSelector } from 'store';
import { KanbanCardAction } from './kanban-card-action';
import useTransition from 'next-translate/useTranslation';
import { useAuth } from 'hooks/use-auth';

interface KanbanCommentAddProps {
  cardId: string;
}

export const KanbanCommentAdd: FC<KanbanCommentAddProps> = (props) => {
  const { cardId, ...other } = props;
  const dispatch = useDispatch();
  const { cards } = useSelector((state) => state.kanban);
  const {t} = useTransition("kanban");

  // To get the user from the authContext, you can use
  const { user } = useAuth();
  const [message, setMessage] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  const handleOnclick = async (): Promise<void> => {
    try {
      if (message) {
        await dispatch(addComment(cards.byId[cardId], message));
        setMessage('');
        toast.success(t('CommentAdded'));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('ErrMsg'));
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
        src={user?.avatar}
        sx={{ mr: 2 }}
      />
      <TextField
        fullWidth
        onChange={handleChange}
        placeholder={t('writeAComment')}
        size="small"
        value={message}
      />
      <KanbanCardAction
        sx={{width: 'auto', ml: 1}}
        onClick={handleOnclick}
      >
       {t('Comment')}
      </KanbanCardAction>
    </Box>
  );
};

KanbanCommentAdd.propTypes = {
  cardId: PropTypes.string.isRequired
};
