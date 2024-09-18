import {
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { boardApi } from 'api/board-api';
import { Duplicate as DuplicateIcon } from 'components/icons/duplicate';
import path from 'components/path.json';
import { useMounted } from 'hooks/use-mounted';
import useTransition from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { Fragment, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'store';
import { bytesToSize } from 'utils/bytes-to-size';
import NextLink from 'next/link';
import { getBoardDetail } from 'slices/board';
import { MyjEditor } from 'components/myj-editor';


export const BoardDetail: FC = () => {
  const { t } = useTransition('board');
  const isMounted = useMounted();
  const dispatch = useDispatch();
  const { selectedBoard } = useSelector((state) => state.board);
  const router = useRouter();

  const boardModify = async () => {
    //상태를 modify로 변경
    router.push(path.pages.minyeonjin.community.boardWrite + '/' + selectedBoard?.seq).catch(console.error);
  }

  useEffect( ()=> {
    const { seq } = router.query;
    if(typeof seq === 'string'){
      dispatch(getBoardDetail(seq));
    }
  },[])

  const boardDelete = async () => {
    try {
      selectedBoard && await boardApi.boardDelete(selectedBoard.seq);
      if (isMounted()) {
        toast.success(t('SuccessDelete'));
        router.push(path.pages.minyeonjin.community.board).catch(console.error);
      };
    } catch (err: any) {
      toast.error(t('ErrorDelete'));
      console.error(err);
    }
  }

  const boardFileDownload = async (fileSeq: number) => {
    try {
      router.push(process.env.NEXT_PUBLIC_BACKEND_URL + '/board/filedownload?fileSeq=' + fileSeq).catch(console.error);
      if (isMounted()) {
        toast.success(t('SuccessFileDownload'));
      };
    } catch (err: any) {
      toast.error(t('ErrorFileDownload'));
      console.error(err);
    }
  }

  return (
    <Box>
      <Card sx={{overflow: 'visible'}}>
        <CardContent sx={{minHeight: '70vh', overflow: 'auto', m:0, p:0, pb: '0 !important'}}>
          <MyjEditor
            readOnly={true}
            value={selectedBoard?.content}
            sx={{minHeight: '70vh'}}
          />
        </CardContent>
      </Card>
      {selectedBoard && selectedBoard?.fileList.length > 0 && (
        <Card sx={{ mt: 3}}>
          <CardContent>
            <Typography variant="h6" mb={3}>
              {t("Files")}
            </Typography>
            <List>
              {selectedBoard?.fileList.map((file) => (
                <ListItem
                  key={file.fileSeq}
                  onClick={() => { { boardFileDownload(file.fileSeq) } }}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    cursor: 'pointer',
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
                  />
                  <ListItemText
                    sx={{ textAlign: 'end' }}
                    secondary={bytesToSize(file.fileSize)}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
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
            sx={{ float: 'left' }}
            variant="outlined"
          >
            {t("GoToList")}
          </Button>
        </NextLink>
        {selectedBoard?.mine && 
        (
        <Fragment>
          <Box>
            <Button
              color="error"
              variant='outlined'
              onClick={boardDelete}
              sx={{ mr: 2 }}
            >
              {t("Delete")}
            </Button>
            <Button
              onClick={boardModify}
              variant="contained"
            >
              {t("Modify")}
            </Button>
          </Box>
        </Fragment>
        )
        }
      </Box>
    </Box>
  );
};
