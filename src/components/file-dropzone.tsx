import type { FC } from 'react';
import PropTypes from 'prop-types';
import type { DropzoneOptions, FileWithPath } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material';
import { Duplicate as DuplicateIcon } from 'components/icons/duplicate';
import { X as XIcon } from 'components/icons/x';
import { bytesToSize } from 'utils/bytes-to-size';
import { File as BoardFile } from 'types/file';
import useTransition from 'next-translate/useTranslation';

export type File = FileWithPath;

interface FileDropzoneProps extends DropzoneOptions {
  files?: File[];
  existFiles?: BoardFile[];
  onRemove?: (file: File) => void;
  onRemoveAll?: () => void;
  onDeleteExistFile?: (fileSeq: number) => void;
}

export const FileDropzone: FC<FileDropzoneProps> = (props) => {
  const {
    // Own props
    files = [],
    existFiles = [],
    onRemove,
    onRemoveAll,
    // DropzoneOptions props
    accept,
    disabled,
    getFilesFromEvent,
    maxSize,
    minSize,
    multiple,
    maxFiles,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onDropAccepted,
    onDropRejected,
    onFileDialogCancel,
    onFileDialogOpen,
    onDeleteExistFile,
    useFsAccessApi,
    autoFocus,
    preventDropOnDocument,
    noClick,
    noKeyboard,
    noDrag,
    noDragEventsBubbling,
    onError,
    validator,
    ...other
  } = props;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    minSize,
    onDrop
  });
  const { t: c } = useTransition("common");

  return (
    <div {...other}>
      <Box
        sx={{
          alignItems: 'center',
          border: 1,
          borderRadius: 1,
          borderStyle: 'dashed',
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          outline: 'none',
          p: 6,
          ...(
            isDragActive && {
              backgroundColor: 'action.active',
              opacity: 0.5
            }
          ),
          '&:hover': {
            backgroundColor: 'action.hover',
            cursor: 'pointer',
            opacity: 0.5
          }
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            '& img': {
              width: 100
            }
          }}
        >
          <img
            alt={c('SelectFile')}
            src="/static/undraw_add_file2_gvbb.svg"
          />
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">
            {c('SelectFile')}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
            {c('SelectFileComment')}
            </Typography>
          </Box>
        </Box>
      </Box>
      {(files.length > 0 || existFiles.length > 0)  && (
        <Box sx={{ mt: 2 }}>
          <List>
          {existFiles.map((file) => (
              <ListItem
                key={file.fileSeq}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  '& + &': {
                    mt: 1
                  }
                }}
              >
                <ListItemIcon>
                  <DuplicateIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={file.fileName}
                  primaryTypographyProps={{
                    color: 'textPrimary',
                    variant: 'subtitle2'
                  }}
                  secondary={bytesToSize(file.fileSize)}
                />
                <Tooltip title="Remove">
                  <IconButton
                    edge="end"
                    onClick={() => onDeleteExistFile?.(file.fileSeq)}
                  >
                    <XIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))}
            {files.map((file) => (
              <ListItem
                key={file.path}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  '& + &': {
                    mt: 1
                  }
                }}
              >
                <ListItemIcon>
                  <DuplicateIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  primaryTypographyProps={{
                    color: 'textPrimary',
                    variant: 'subtitle2'
                  }}
                  secondary={bytesToSize(file.size)}
                />
                <Tooltip title="Remove">
                  <IconButton
                    edge="end"
                    onClick={() => onRemove?.(file)}
                  >
                    <XIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2
            }}
          >
            <Button
              onClick={onRemoveAll}
              size="small"
              type="button"
            >
              {c('RemoveAll')}
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

FileDropzone.propTypes = {
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  onUpload: PropTypes.func,
  // @ts-ignore
  accept: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  disabled: PropTypes.bool,
  getFilesFromEvent: PropTypes.func,
  maxFiles: PropTypes.number,
  maxSize: PropTypes.number,
  minSize: PropTypes.number,
  noClick: PropTypes.bool,
  noDrag: PropTypes.bool,
  noDragEventsBubbling: PropTypes.bool,
  noKeyboard: PropTypes.bool,
  onDrop: PropTypes.func,
  onDropAccepted: PropTypes.func,
  onDropRejected: PropTypes.func,
  onFileDialogCancel: PropTypes.func,
  preventDropOnDocument: PropTypes.bool
};
