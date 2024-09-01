import { useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Box, Button, OutlinedInput } from '@mui/material';
import { Plus as PlusIcon } from 'components/icons/plus';
import { addCheckItem } from 'slices/kanban';
import { useDispatch } from 'store';
import useTransition from 'next-translate/useTranslation';

interface KanbanCheckItemAddProps {
  cardId: string;
  checklistId: string;
}

export const KanbanCheckItemAdd: FC<KanbanCheckItemAddProps> = (props) => {
  const { cardId, checklistId, ...other } = props;
  const dispatch = useDispatch();
  const [name, setName] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const {t} = useTransition("kanban");

  const handleAdd = (): void => {
    setIsExpanded(true);
  };

  const handleCancel = (): void => {
    setIsExpanded(false);
    setName('');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleSave = async (): Promise<void> => {
    try {
      if (!name) {
        return;
      }
      await dispatch(addCheckItem(checklistId, name));
      setIsExpanded(false);
      setName('');
      toast.success(t('CheckItemAdded'));
    } catch (err) {
      console.error(err);
      toast.error(t('ErrMsg'));
    }
  };

  return (
    <Box
      sx={{ width: '100%' }}
      {...other}
    >
      {
        isExpanded
          ? (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                width: '100%'
              }}
            >
              <OutlinedInput
                onChange={handleChange}
                placeholder={t('AddAnItem')}
                value={name}
                sx={{
                  flexGrow: 1,
                  '& .MuiInputBase-input': {
                    px: 2,
                    py: 1
                  }
                }}
              />
              <Button
                onClick={handleSave}
                size="small"
                sx={{ ml: 2 }}
                variant="contained"
              >
                {t('Add')}
              </Button>
              <Button
                onClick={handleCancel}
                size="small"
                sx={{ ml: 2 }}
              >
                {t('Cancel')}
              </Button>
            </Box>
          )
          : (
            <Button
              onClick={handleAdd}
              size="small"
              startIcon={(<PlusIcon fontSize="small" />)}
            >
              {t('AddItem')}
            </Button>
          )
      }
    </Box>
  );
};

KanbanCheckItemAdd.propTypes = {
  cardId: PropTypes.string.isRequired,
  checklistId: PropTypes.string.isRequired
};
