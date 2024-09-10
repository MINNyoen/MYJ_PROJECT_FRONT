import { useState, useEffect, useCallback, MouseEvent, ChangeEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Button, Card, Container, InputAdornment, TextField, Typography } from '@mui/material';
import { AuthGuard } from 'components/authentication/auth-guard';
import { BoardListTable } from 'components/board/board-list-table';
import { useMounted } from 'hooks/use-mounted';
import { Plus as PlusIcon } from 'components/icons/plus';
import { Search as SearchIcon } from 'components/icons/search';
import type { Board } from 'types/board';
import { MainLayout } from 'layout/main-layout';
import path from 'components/path.json';
import useTransition from 'next-translate/useTranslation';

interface SortOption {
  label: string;
  value: string;
}

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
      //const data = await BoardApi.getBoards();

      if (isMounted()) {
        //setboards(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      getboards();
    },[]);

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const paginatedboards = applyPagination(boards, page, rowsPerPage);

  const [type, setType] = useState<string>('title');
  const [keyWord, setKeyWord] = useState<string>();

  const typeOptions: SortOption[] = [
    {
      label: t('title'),
      value: 'title'
    },
    {
      label: t('writer'),
      value: 'writer'
    }
  ];

  const handleKeyWordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setKeyWord(value);
  };

  const handleTypeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setType(value);
  };

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
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4">
            {t("Board")}
            </Typography>
          </Box>
        <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              m: -1.5,
              p: 3
            }}
          >
            <TextField
                onChange={handleTypeChange}
                select
                SelectProps={{ native: true }}
                sx={{ m: 1.5 }}
                value={type}
              >
                {typeOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            <Box
                component="form"
                onSubmit={()=>{}}
                sx={{
                  flexGrow: 1,
                  m: 1.5
                }}
              >
                <TextField
                  value={keyWord}
                  onChange={handleKeyWordChange}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
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
          <NextLink
                  href={path.pages.minyeonjin.community.boardCreate}
                  passHref
                >
                  <Button
                    component="a"
                    startIcon={<PlusIcon fontSize="small" />}
                    variant="contained"
                    sx={{float: 'right', mt: 2}}
                  >
                  {t("Add")}
                  </Button>
          </NextLink>
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
