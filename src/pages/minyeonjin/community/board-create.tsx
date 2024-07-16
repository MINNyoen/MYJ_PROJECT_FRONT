import { Box, Container, Typography } from '@mui/material';
import { AuthGuard } from 'components/authentication/auth-guard';
import { BoardCreateForm } from 'components/board/board-create-form';
import { MainLayout } from 'layout/main-layout';
import type { NextPage } from 'next';
import useTransition from 'next-translate/useTranslation';
import Head from 'next/head';


const BoardCreate: NextPage = () => {
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
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4">
            {t("NewBoard")}
            </Typography>
          </Box>
          <BoardCreateForm />
        </Container>
      </Box>
    </>
  );
};

BoardCreate.getLayout = (page) => (
  <AuthGuard>
    <MainLayout>
      {page}
    </MainLayout>
  </AuthGuard>
);

export default BoardCreate;
