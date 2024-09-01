import type { Theme } from '@mui/material';
import { Box, Button, Checkbox, IconButton, Input, OutlinedInput } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import { Trash as TrashIcon } from 'components/icons/trash';
import PropTypes from 'prop-types';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { deleteCheckItem, updateCheckItem } from 'slices/kanban';
import { useDispatch } from 'store';
import type { CheckItem } from 'types/kanban';
import useTransition from 'next-translate/useTranslation';

interface KanbanCheckItemProps {
  cardId: string;
  checkItem: CheckItem;
  checklistId: string;
  editing?: boolean;
  onEditCancel?: () => void;
  onEditComplete?: () => void;
  onEditInit?: () => void;
  sx?: SxProps<Theme>;
}

const KanbanCheckItemRoot = styled('div')(
  ({ theme }) => ({
    alignItems: 'center',
    display: 'flex',
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(1)
  })
);

export const KanbanCheckItem: FC<KanbanCheckItemProps> = (props) => {
  const {
    cardId,
    checkItem,
    checklistId,
    editing,
    onEditCancel,
    onEditComplete,
    onEditInit,
    ...other
  } = props;
  const dispatch = useDispatch();
  const [name, setName] = useState<string>(checkItem.name);
  const {t} = useTransition("kanban");

  const handleStateChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    try {
      const state = event.target.checked ? 'complete' : 'incomplete';

      await dispatch(updateCheckItem(
        cardId,
        checklistId,
        checkItem.id,
        { state }
      ));
      toast.success(t('CheckItemUpdated'));
    } catch (err) {
      console.error(err);
      toast.error(t('ErrMsg'));
    }
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleSave = async (): Promise<void> => {
    try {
      await dispatch(updateCheckItem(
        cardId,
        checklistId,
        checkItem.id,
        { name }
      ));
      toast.success(t('CheckItemUpdated'));
      onEditComplete?.();
    } catch (err) {
      console.error(err);
      toast.error(t('ErrMsg'));
    }
  };

  const handleCancel = (): void => {
    setName(checkItem.name);
    onEditCancel?.();
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await dispatch(deleteCheckItem(
        checkItem.id
      ));
      toast.success(t('CheckItemDeleted'));
    } catch (err) {
      console.error(err);
      toast.error(t('ErrMsg'));
    }
  };

  return (
    <KanbanCheckItemRoot {...other}>
      <Checkbox
        edge="start"
        checked={checkItem.state === 'complete'}
        onChange={handleStateChange}
        sx={{ mr: 1 }}
      />
      {
        editing
          ? (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                width: '100%'
              }}
            >
              <OutlinedInput
                onChange={handleNameChange}
                value={name}
                sx={{
                  flexGrow: 1,
                  my: '1px',
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
                {t('Update')}
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
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexGrow: 1
              }}
            >
              <Input
                disableUnderline
                fullWidth
                onClick={onEditInit}
                value={checkItem.name}
                sx={{
                  borderColor: 'transparent',
                  borderRadius: 1,
                  borderStyle: 'solid',
                  borderWidth: 1,
                  cursor: 'text',
                  m: '-1px',
                  '&:hover': {
                    backgroundColor: 'action.selected'
                  },
                  '& .MuiInputBase-input': {
                    fontWeight: 500,
                    px: 2,
                    py: 1
                  }
                }}
              />
              <IconButton
                onClick={handleDelete}
                sx={{ ml: 2 }}
                size="small"
              >
                <TrashIcon fontSize="small" />
              </IconButton>
            </Box>
          )
      }
    </KanbanCheckItemRoot>
  );
};

KanbanCheckItem.propTypes = {
  cardId: PropTypes.string.isRequired,
  // @ts-ignore
  checkItem: PropTypes.object.isRequired,
  checklistId: PropTypes.string.isRequired,
  editing: PropTypes.bool,
  onEditCancel: PropTypes.func,
  onEditComplete: PropTypes.func,
  onEditInit: PropTypes.func,
  sx: PropTypes.object
};

KanbanCheckItem.defaultProps = {
  editing: false
};
