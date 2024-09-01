import { useEffect } from 'react';
import type { NextPage } from 'next';
import { DragDropContext } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import toast from 'react-hot-toast';
import { Box, Typography } from '@mui/material';
import { AuthGuard } from 'components/authentication/auth-guard';
import { MainLayout } from 'layout/main-layout';
import { KanbanColumn } from 'components/kanban/kanban-column';
import { KanbanColumnAdd } from 'components/kanban/kanban-column-add';
import { getBoard, moveCard } from 'slices/kanban';
import { useDispatch, useSelector } from 'store';
import useTransition from 'next-translate/useTranslation';
import Head from 'next/head';

const Kanban: NextPage = () => {
  const dispatch = useDispatch();
  const { columns, cards } = useSelector((state) => state.kanban);
  const {t} = useTransition("kanban");

  useEffect(
    () => {
      dispatch(getBoard());
    },
    []
  );

  const handleDragEnd = async ({ source, destination, draggableId }: DropResult): Promise<void> => {
    try {
     
      if (!destination) {
        return;
      }

      
      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }

      if (source.droppableId === destination.droppableId) {
        
        await dispatch(moveCard(cards.byId[draggableId], destination.index, columns.byId[cards.byId[draggableId].columnId], columns.byId[destination.droppableId], undefined));
      } else {
        
        await dispatch(moveCard(cards.byId[draggableId], destination.index, columns.byId[cards.byId[draggableId].columnId], columns.byId[destination.droppableId], destination.droppableId));
      }
      toast.success(t('CardMoved'));
    } catch (err) {
      console.error(err);
      toast.error(t('ErrMsg'));
    }
  };

  return (
    <> 
      <Head>
        <title>
        {t('Kanban')} | {t("MinYeonJin")}
        </title>
      </Head>
      <Box
      sx={{
        display: 'flex',
        minHeight: '90vh',
        flexDirection: 'column',
        flexGrow: 1,
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          px: 3,
          pt: 5
        }}
      >
        <Typography variant="h3">
          {t('Kanban')}
        </Typography>
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          sx={{
            overflowX: 'auto',
            overflowY: 'hidden'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              px: 1,
              py: 3
            }}
          >
            {columns.allIds.map((columnId: string, index: number) => (
              <KanbanColumn
                columnId={columnId}
                key={columnId}
              />
            ))}
            <KanbanColumnAdd />
          </Box>
        </Box>
      </DragDropContext>
    </Box>
    </>
  );
};

Kanban.getLayout = (page) => (
  <AuthGuard>
    <MainLayout>
      {page}
    </MainLayout>
  </AuthGuard>
);

export default Kanban;
