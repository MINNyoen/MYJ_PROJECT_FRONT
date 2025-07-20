import { useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Button, Card, Container, InputAdornment, TextField, Typography } from '@mui/material';
import { AuthGuard } from 'components/authentication/auth-guard';
import { BoardListTable } from 'components/board/board-list-table';
import { Plus as PlusIcon } from 'components/icons/plus';
import { Search as SearchIcon } from 'components/icons/search';
import { MainLayout } from 'layout/main-layout';
import path from 'components/path.json';
import useTransition from 'next-translate/useTranslation';
import { getBoard, initBoardDetail } from 'slices/board';
import { useSelector, useDispatch } from 'store';

interface SortOption {
  label: string;
  value: string;
}
// eslint-disable-next-line react-hooks/rules-of-hooks
const board: NextPage = () => {
  const {t} = useTransition("board");
  const dispatch = useDispatch();
  const [type, setType] = useState<string>('title');
  const [keyWord, setKeyWord] = useState<string | undefined>(undefined);
  const { boardList, boardPaging } = useSelector((state) => state.board);



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

  useEffect(() => {
    dispatch(getBoard(keyWord, type, boardPaging));
    dispatch(initBoardDetail());
    },[]);

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
     dispatch(getBoard(keyWord, type, {...boardPaging, page: newPage}));
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(getBoard(keyWord, type, {...boardPaging, recordSize: parseInt(event.target.value)}));
  };

  const handleKeyWordChange = (event: ChangeEvent<HTMLInputElement>): void => {
      let newKeyWord = event.target.value === '' ? undefined : event.target.value;
      setKeyWord(newKeyWord);
      dispatch(getBoard(newKeyWord, type, {...boardPaging, page: 1}));
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
              page={boardPaging.page}
              boards={boardList}
              boardsCount={boardPaging.totalRow}
              rowsPerPage={boardPaging.recordSize}
            />
          </Card>
          <NextLink
                  href={path.pages.minyeonjin.community.boardWrite}
                  passHref
                >
                  <Button
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

board.getLayout = (page) => (
  <AuthGuard>
    <MainLayout>
      {page}
    </MainLayout>
  </AuthGuard>
);

export default board;
