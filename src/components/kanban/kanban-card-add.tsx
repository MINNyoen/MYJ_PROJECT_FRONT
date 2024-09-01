import { Box, Button, Link, OutlinedInput, Typography } from '@mui/material';
import { Plus as PlusIcon } from 'components/icons/plus';
import useTransition from 'next-translate/useTranslation';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createCard } from 'slices/kanban';
import { useDispatch } from 'store';
import { Column } from 'types/kanban';

interface KanbanCardAddProps {
  column: Column;
}

export const KanbanCardAdd: FC<KanbanCardAddProps> = (props) => {
  const { column, ...other } = props;
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const {t} = useTransition("kanban");

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleAddInit = (): void => {
    setIsExpanded(true);
  };

  const handleAddCancel = (): void => {
    setIsExpanded(false);
    setName('');
  };

  const handleAddConfirm = async (): Promise<void> => {
    try {
      await dispatch(createCard(column, name || t('NewCard')));
      setIsExpanded(false);
      setName('');
      toast.success(t('CardCreated'));
    } catch (err) {
      console.error(err);
      toast.error(t('ErrMsg'));
    }
  };

  return (
    <div {...other}>
      {
        isExpanded
          ? (
            <>
              <OutlinedInput
                autoFocus
                fullWidth
                placeholder={t('MyNewTask')}
                name="cardName"
                onChange={handleChange}
                sx={{
                  backgroundColor: 'background.paper',
                  '& .MuiInputBase-input': {
                    px: 2,
                    py: 1
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'neutral.400'
                  }
                }}
                value={name}
              />
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 2
                }}
              >
                <Button
                  onClick={handleAddConfirm}
                  size="small"
                  startIcon={(<PlusIcon fontSize="small" />)}
                  variant="contained"
                >
                  {t('AddCard')}
                </Button>
                <Button
                  onClick={handleAddCancel}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  {t('Cancel')}
                </Button>
              </Box>
            </>
          )
          : (
            <Link
              onClick={handleAddInit}
              sx={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'flex-start'
              }}
              underline="none"
            >
              <PlusIcon sx={{ color: 'action.active' }} />
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {t('AddCard')}
              </Typography>
            </Link>
          )
      }
    </div>
  );
};
