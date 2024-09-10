import {
  Box,
  Button,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import type { File } from 'components/file-dropzone';
import { FileDropzone } from 'components/file-dropzone';
import { QuillEditor } from 'components/quill-editor';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Board } from 'types/board';
import useTransition from 'next-translate/useTranslation';
import * as Yup from 'yup';

interface BoardCreateFormProps {
  board?: Board;
}

export const BoardCreateForm: FC<BoardCreateFormProps> = (props) => {
  const {t} = useTransition('board');
  const {t:c} = useTransition("common");
  const {board} = props;
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const formik = useFormik({
    initialValues: {...board},
    validationSchema: Yup.object({
      title: Yup.string().max(255, c("valmax", {max: '255'})).required(t("valTitle")),
      content: Yup.string()
    }),
    onSubmit: async (values): Promise<void> => {
      try {
        // NOTE: Make API request
        toast.success('Board created!');
        router.push('/dashboard/Boards').catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
      }
    }
  });

  const handleDrop = (newFiles: File[]): void => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemove = (file: File): void => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path !== file.path));
  };

  const handleRemoveAll = (): void => {
    setFiles([]);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...props}
    >
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={4}
              xs={12}
            >
              <Typography variant="h6">
                {t("BasicDetail")}
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.title && formik.errors.title)}
                fullWidth
                helperText={formik.touched.title && formik.errors.title}
                label={t("BoardTitle")}
                title="title"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.title}
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
              <QuillEditor
                onChange={(value: string): void => {
                  formik.setFieldValue(
                    'content',
                    value
                  );
                }}
                placeholder={t("WriteSomething")}
                sx={{ height: 400 }}
                value={formik.values.content}
              />
              {Boolean(formik.touched.content && formik.errors.content) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {formik.errors.content}
                  </FormHelperText>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={4}
              xs={12}
            >
              <Typography variant="h6">
              {t("Files")}
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <FileDropzone
                files={files}
                onDrop={handleDrop}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          mx: -1,
          mb: -1,
          mt: 3
        }}
      >
        <Button
          color="error"
          sx={{
            m: 1,
            mr: 'auto'
          }}
        >
          {t("Delete")}
        </Button>
        <Button
          sx={{ m: 1 }}
          variant="outlined"
        >
          {t("Cancel")}
        </Button>
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
