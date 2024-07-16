import type { FC } from 'react';
import { Avatar, Box, Container, Typography } from '@mui/material';

export const HomeThird: FC = (props) => (
  <Box
    sx={{
      backgroundColor: 'primary.main',
      py: 15
    }}
    {...props}
  >
    <Container
      maxWidth="md"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography
        align="center"
        color="primary.contrastText"
        variant="h3"
      >
        &quot;상대방에게 하고싶은 말을 적어주세요!!!
        &quot;
      </Typography>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          mt: 3
        }}
      >
        <Avatar
          src="/static/home/olivier.png"
          sx={{ mr: 2 }}
          variant="rounded"
        />
        <div>
          <Typography
            color="primary.contrastText"
            variant="h6"
          >
            김민년,
          </Typography>
          <Typography
            color="primary.contrastText"
            variant="body2"
          >
            Nyony of @MinYeonjin
          </Typography>
        </div>
      </Box>
    </Container>
  </Box>
);
