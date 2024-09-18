import {
  Box,
  Button,
  Card,
  CardContent,
  FormHelperText,
  TextField,
  Typography
} from '@mui/material';
import type { File } from 'components/file-dropzone';
import { FileDropzone } from 'components/file-dropzone';
import { MyjEditor } from 'components/myj-editor';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useTransition from 'next-translate/useTranslation';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useMounted } from 'hooks/use-mounted';
import { boardApi } from 'api/board-api';
import path from 'components/path.json';
import { useDispatch, useSelector } from 'store';
import { File as BoardFile } from 'types/file';
import NextLink from 'next/link';
import { getBoardDetail } from 'slices/board';

export const BoardWriteForm: FC = () => {
  const { t, lang } = useTransition('board');
  const { t: c } = useTransition("common");
  const { selectedBoard } = useSelector((state) => state.board);
  const isMounted = useMounted();
  const router = useRouter();
  const dispatch = useDispatch();
  const [files, setFiles] = useState<File[]>([]);
  const [deleteFiles, setDeleteFiles] = useState<number[]>([]);
  const [existFiles, setExistFiles] = useState<BoardFile[]>(selectedBoard?.fileList ? selectedBoard?.fileList : []);
  const { handleSubmit, register, formState: { errors,  }, clearErrors, getValues, setValue } = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
    resolver: yupResolver(Yup.object({
      title: Yup
        .string()
        .max(50, c("valMax", { max: '50' }))
        .required(t('valTitle')),
      content: Yup
        .string()
    })),
  })

  const { seq } = router.query;
  
  useEffect( ()=> {
    if(typeof seq === 'string' && seq){
      dispatch(getBoardDetail(seq));
    }
  },[]);

  useEffect(() => {
    clearErrors();
  }, [lang]);

  useEffect(()=> {
    if (selectedBoard) {
      setValue('title', selectedBoard.title, { shouldDirty: true });
      setValue('content', selectedBoard.content, { shouldDirty: true });
      setExistFiles(selectedBoard.fileList ? selectedBoard.fileList : []);
    }
  },[selectedBoard])

  const onSubmit = async (values: any) => {
    try {
      if (isMounted()) {
        router.push(path.pages.minyeonjin.community.board).catch(console.error);
      };
      if (seq) {
        toast.promise(
          boardApi.boardUpdate(Number(seq), values.title, values.content, files, deleteFiles),
           {
             loading: t("Updating"),
             success: t('SuccessModify'),
             error: t('ErrorModify'),
           }
         );
        ;
      }
      else {
        toast.promise(
          boardApi.boardInsert(values.title, values.content, files),
           {
             loading: t("Registering"),
             success: t('SuccessCreate'),
             error: t('ErrorCreate'),
           }
         );
      }
    } catch (err: any) {
      seq ? toast.success(t('ErrorModify')) : toast.success(t('ErrorCreate'));
      console.error(err);
    }
  }

  const handleChangeContent = (value: string): void => {
    setValue('content', value)
  }

  const handleDrop = (newFiles: File[]): void => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemove = (file: File): void => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path !== file.path));
  };

  const handleRemoveAll = (): void => {
    setFiles([]);
    setExistFiles([]);
    selectedBoard && setDeleteFiles(selectedBoard?.fileList.map(item => item.fileSeq));
  };

  const handleDeleteExistFile = (fileSeq: number) => {
    setDeleteFiles([...deleteFiles, fileSeq]);
    setExistFiles(existFiles.filter((_file) => _file.fileSeq !== fileSeq));
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card>
        <CardContent>
          <Typography variant="h5" mb={3}>
            {t("BasicDetail")}
          </Typography>
          <TextField
            error={!!errors.title}
            InputLabelProps={{ shrink: true }}
            helperText={errors.title?.message}
            fullWidth
            label={t("BoardTitle")}
            title="title"
            {...register('title')}
          />
          <Typography
            color="textSecondary"
            sx={{
              mb: 2,
              mt: 3
            }}
            variant="subtitle2"
          >
            {t("content")}
          </Typography>
          <MyjEditor
            value={getValues('content')}
            onChange={handleChangeContent}
            placeholder={t("WriteSomething")}
            sx={{ height: '70vh' }}
          />
          {!!errors.content && (
            <Box sx={{ mt: 2 }}>
              <FormHelperText error>
                {errors.content?.message}
              </FormHelperText>
            </Box>
          )}
        </CardContent>
      </Card>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={3}>
            {t("Files")}
          </Typography>
          <FileDropzone
            files={files}
            onDrop={handleDrop}
            onRemove={handleRemove}
            onRemoveAll={handleRemoveAll}
            existFiles={existFiles}
            onDeleteExistFile={handleDeleteExistFile}
          />
        </CardContent>
      </Card>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'end',
          mx: -1,
          mb: -1,
          mt: 3
        }}
      >
        <NextLink
          href={path.pages.minyeonjin.community.board}
          passHref
        >
          <Button
            sx={{ m: 1 }}
            variant="outlined"
          >
            {t("Cancel")}
          </Button>
        </NextLink>
        <Button
          sx={{ m: 1 }}
          type="submit"
          variant="contained"
        >
          {t("Confirm")}
        </Button>
      </Box>
    </form>
  );
};
