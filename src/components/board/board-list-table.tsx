import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import { DotsHorizontal as DotsHorizontalIcon } from 'components/icons/dots-horizontal';
import { Scrollbar } from 'components/scrollbar';
import { SeverityPill } from 'components/severity-pill';
import PropTypes from 'prop-types';
import type { FC } from 'react';
import { ChangeEvent, Fragment, MouseEvent } from 'react';
import type { Board } from 'types/board';
import useTransition from 'next-translate/useTranslation';

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
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    boards,
    boardsCount,
    rowsPerPage,
    ...other
  } = props;
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
              return (
                <Fragment key={board.id}>
                  <TableRow
                    hover
                    key={board.id}
                  >
                    <TableCell align='center'>
                      {board.id}
                    </TableCell>
                    <TableCell width="30%" align='center'>
                      {board.title}
                    </TableCell>
                    <TableCell align='center'>
                      <SeverityPill color={board.fileExist ? 'success' : 'info'}>
                      {board.fileExist ? 'exist' : 'empty'}
                      </SeverityPill>
                    </TableCell>
                    <TableCell align='center'>
                      {board.views}
                    </TableCell>
                    <TableCell align='center'>
                      {board.writer}
                    </TableCell>
                    <TableCell align='center'>
                      {board.updDt}
                    </TableCell>
                    <TableCell align='center'>
                      <IconButton>
                        <DotsHorizontalIcon fontSize="small" />
                      </IconButton>
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
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
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
