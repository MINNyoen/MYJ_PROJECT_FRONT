import { useState, useEffect, useCallback, MouseEvent, ChangeEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Button, Card, Container, Grid, Typography } from '@mui/material';
import { BoardApi } from 'api/board-api';
import { AuthGuard } from 'components/authentication/auth-guard';
import { BoardListTable } from 'components/board/board-list-table';
import { useMounted } from 'hooks/use-mounted';
import { Plus as PlusIcon } from 'components/icons/plus';
import type { Board } from 'types/board';
import { MainLayout } from 'layout/main-layout';
import path from 'components/path.json';
import useTransition from 'next-translate/useTranslation';

const applyPagination = (
  boards: Board[],
  page: number,
  rowsPerPage: number
): Board[] => boards.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const boardList: NextPage = () => {
  const {t} = useTransition("board");
  const isMounted = useMounted();
  const [boards, setboards] = useState<Board[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const getboards = useCallback(async () => {
    try {
      const data = await BoardApi.getBoards();

      if (isMounted()) {
        setboards(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getboards();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const paginatedboards = applyPagination(boards, page, rowsPerPage);

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
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h4">
                {t("Board")}
                </Typography>
              </Grid>
              <Grid item>
                <NextLink
                  href={path.pages.minyeonjin.community.boardCreate}
                  passHref
                >
                  <Button
                    component="a"
                    startIcon={<PlusIcon fontSize="small" />}
                    variant="contained"
                  >
                  {t("Add")}
                  </Button>
                </NextLink>
              </Grid>
            </Grid>
          </Box>
          <Card>
            <BoardListTable
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              boards={paginatedboards}
              boardsCount={boards.length}
              rowsPerPage={rowsPerPage}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

boardList.getLayout = (page) => (
  <AuthGuard>
    <MainLayout>
      {page}
    </MainLayout>
  </AuthGuard>
);

export default boardList;
