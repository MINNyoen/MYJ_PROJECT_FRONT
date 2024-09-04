import { Box, Button, Dialog, Paper, Typography } from '@mui/material';
import { Breakpoint } from '@mui/material/styles';
import useTranslation from 'next-translate/useTranslation';
import { FC } from 'react';

interface checkeModalProps {
    defaultCallback?: () => void;
    callback: () => Promise<void>;
    cancelCallback?: () => void;
    onClose?: () => void;
    open?: boolean;
    data: {
        title: string,
        content: string
        cancel?: string,
        ok?: string,
    }
    cancelButton?: Boolean
    maxWidth?: Breakpoint
    icon?: JSX.Element
  }

export const CheckModal: FC<checkeModalProps> = (props) => {

    const {t} = useTranslation('common');
    
    const {defaultCallback, cancelCallback, callback, onClose, open, maxWidth="xs", icon, data: {title, content, cancel=t("Cancel"), ok=t("Ok")}, cancelButton=true} = props;

    return (
    <Dialog
    fullWidth
    maxWidth={maxWidth}
    onClose={onClose}
    open={!!open}
    PaperProps={{sx: {overflow: 'hidden'}}}
    >
        <Paper elevation={12}>
            <Box
            sx={{
                display: 'flex',
                pb: 2,
                pt: 3,
                px: 3
            }}
            >
            <Box pt={'15px'} px={'20px'}>
            {icon}
            </Box>
            <div>
                <Typography variant="h5">
                {title}
                </Typography>
                <Typography
                color="textSecondary"
                sx={{ mt: 1 }}
                variant="body2"
                >
                    {content}
                </Typography>
            </div>
            </Box>
            <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                px: 3,
                py: 1.5
            }}
            >
            {cancelButton && <Button
                sx={{ mr: 2 }}
                variant="outlined"
                onClick={()=>{
                    onClose && onClose();
                    cancelCallback && cancelCallback();
                    defaultCallback && defaultCallback();
                }}
            >
                {cancel}
            </Button>
            }
            <Button
                variant="contained"
                onClick={async ()=>{
                    await callback().then(()=>{
                        onClose && onClose();
                        defaultCallback && defaultCallback();
                    });
                }}
            >
                {ok}
            </Button>
            </Box>
        </Paper>
  </Dialog>
)};
