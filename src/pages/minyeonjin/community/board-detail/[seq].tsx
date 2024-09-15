import { Box, Container, Typography } from '@mui/material';
import { AuthGuard } from 'components/authentication/auth-guard';
import { BoardDetail } from 'components/board/board-detail';
import { MainLayout } from 'layout/main-layout';
import type { NextPage } from 'next';
import useTransition from 'next-translate/useTranslation';
import Head from 'next/head';
import { useSelector } from 'store';

const boardDetail: NextPage = () => {
  const {t} = useTransition("board");
  const { selectedBoard } = useSelector((state) => state.board);
  return (
    <>
      <Head>
        <title>
        {t("Board")} | {t("MinYeonJin")}
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '90vh',
          py: 3
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4}}>
            <Typography variant="h4">
            {selectedBoard?.title}
            </Typography>
            <Typography sx={{float : 'right', mr: 2}} variant="h6" >
                {t('views') + ' : '} {selectedBoard?.views}
            </Typography>
          </Box>
          <BoardDetail />
        </Container>
      </Box>
    </>
  );
};

boardDetail.getLayout = (page) => (
  <AuthGuard>
    <MainLayout>
      {page}
    </MainLayout>
  </AuthGuard>
);

export default boardDetail;
