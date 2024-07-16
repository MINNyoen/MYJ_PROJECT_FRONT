import { useEffect, useState } from 'react';
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
import { Bars } from 'react-loader-spinner';
import { loadingColor } from 'theme/base-theme-options';

const Kanban: NextPage = () => {
  const dispatch = useDispatch();
  const { columns, cards } = useSelector((state) => state.kanban);
  const [loading, setLoading] = useState(true);

  useEffect(
    () => {
      dispatch(getBoard());
      setTimeout(()=>{setLoading(false);},1000);
    },
    []
  );

  const handleDragEnd = async ({ source, destination, draggableId }: DropResult): Promise<void> => {
    try {
      // Dropped outside the column
      if (!destination) {
        return;
      }

      // Card has not been moved
      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }

      if (source.droppableId === destination.droppableId) {
        // Moved to the same column on different position
        await dispatch(moveCard(cards.byId[draggableId], destination.index, columns.byId[cards.byId[draggableId].columnId], columns.byId[destination.droppableId], undefined));
      } else {
        // Moved to another column
        await dispatch(moveCard(cards.byId[draggableId], destination.index, columns.byId[cards.byId[draggableId].columnId], columns.byId[destination.droppableId], destination.droppableId));
      }
      toast.success('Card moved!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <> 
      <Box
      component="main"
      sx={{
        display: 'flex',
        minHeight: '700px',
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
          Kanban
        </Typography>
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          sx={{
            justifyContent: 'center',
            display: 'flex',
            flexGrow: 1,
            flexShrink: 1,
            overflowX: 'auto',
            overflowY: 'hidden'
          }}
        >{loading ? 
          <Box sx={{margin: 'auto'}}>
          <Bars
            height="80"
            width="80"
            color={loadingColor}
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            /> 
            </Box>
            :
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
        }
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
