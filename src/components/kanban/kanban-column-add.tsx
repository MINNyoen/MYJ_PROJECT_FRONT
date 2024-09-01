import { useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import toast from 'react-hot-toast';
import { Box, Button, Link, OutlinedInput, Typography } from '@mui/material';
import { Plus as PlusIcon } from 'components/icons/plus';
import { createColumn } from 'slices/kanban';
import { useDispatch } from 'store';
import useTransition from 'next-translate/useTranslation';

export const KanbanColumnAdd: FC = (props) => {
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
      await dispatch(createColumn(name || t('NewColumn')));
      setIsExpanded(false);
      setName('');
      toast.success(t('ColumnCreated'));
    } catch (err) {
      console.error(err);
      toast.error(t('ErrMsg'));
    }
  };

  return (
    <div {...props}>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.800'
            : 'neutral.200',
          borderRadius: 1,
          mt: 7,
          mx: 1,
          width: {
            sm: 380,
            xs: 300
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {
            isExpanded
              ? (
                <>
                  <OutlinedInput
                    autoFocus
                    fullWidth
                    placeholder={t('MyNewBoard')}
                    name="cardName"
                    onChange={handleChange}
                    value={name}
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
                      {t('AddColumn')}
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
                    {t('AddColumn')}
                  </Typography>
                </Link>
              )
          }
        </Box>
      </Box>
    </div>
  );
};
