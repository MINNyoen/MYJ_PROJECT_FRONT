import { Box, Container, Typography } from '@mui/material';
import { AuthGuard } from 'components/authentication/auth-guard';
import { BoardWriteForm } from 'components/board/board-write-form';
import { MainLayout } from 'layout/main-layout';
import type { NextPage } from 'next';
import useTransition from 'next-translate/useTranslation';
import Head from 'next/head';

const boardWrite: NextPage = () => {
  const {t} = useTransition("board");
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
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4">
                {t("NewBoard")}
            </Typography>
          </Box>
          <BoardWriteForm />
        </Container>
      </Box>
    </>
  );
};

boardWrite.getLayout = (page) => (
  <AuthGuard>
    <MainLayout>
      {page}
    </MainLayout>
  </AuthGuard>
);

export default boardWrite;
