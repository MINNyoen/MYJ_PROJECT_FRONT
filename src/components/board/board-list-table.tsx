import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'components/scrollbar';
import PropTypes from 'prop-types';
import type { FC } from 'react';
import { ChangeEvent, Fragment, MouseEvent } from 'react';
import type { Board } from 'types/board';
import useTransition from 'next-translate/useTranslation';
import { format } from 'date-fns';
import { getBoardDetail } from 'slices/board';
import { useDispatch } from 'store';
import { useRouter } from 'next/router';
import path from 'components/path.json';
import { Circle } from '@mui/icons-material';

interface BoardListTableProps {
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  boards: Board[];
  boardsCount: number;
  rowsPerPage: number;
}

export const BoardListTable: FC<BoardListTableProps> = (props) => {
  const {t} = useTransition("board");
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    boards,
    boardsCount,
    rowsPerPage,
    ...other
  } = props;

  const boardDetail = async (seq: string) => {
    router.push(path.pages.minyeonjin.community.boardDetail + '/' + seq).catch(console.error);
 };
  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell align='center'>
              {t("seq")}
              </TableCell>
              <TableCell width="30%" align='center'>
              {t("title")}
              </TableCell>
              <TableCell align='center'>
              {t("fileExist")}
              </TableCell>
              <TableCell align='center'>
              {t("views")}
              </TableCell>
              <TableCell align='center'>
              {t("writer")}
              </TableCell>
              <TableCell align='center'>
              {t("updDt")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boards.map((board) => {
              var updDt = new Date(board.updDt);
              return (
                <Fragment key={board.seq}>
                  <TableRow
                    hover
                    key={board.seq}
                    sx={{cursor: 'pointer'}}
                    onClick={()=>{boardDetail(board.seq)}}
                  >
                    <TableCell align='center'>
                      {board.seq}
                    </TableCell>
                    <TableCell width="30%" align='center'>
                      {board.title}
                    </TableCell>
                    <TableCell align='center'>
                      {board.fileExist ? <Circle color='primary'/> : <Fragment/>}
                    </TableCell>
                    <TableCell align='center'>
                      {board.views}
                    </TableCell>
                    <TableCell align='center'>
                      {board.writer}
                    </TableCell>
                    <TableCell align='center'>
                      {format(updDt.getTime(), t('DateFormat'))}
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={boardsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page-1}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 30, 50]}
      />
    </div>
  );
};

BoardListTable.propTypes = {
  boards: PropTypes.array.isRequired,
  boardsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
