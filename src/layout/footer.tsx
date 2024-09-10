import { FC, Fragment } from 'react';
import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material';
import { MinusOutlined as MinusOutlinedIcon } from 'components/icons/minus-outlined';
import { Logo } from 'components/logo';
import { getMenuList } from './main-layout';

export const Footer: FC = (props) => (
  <Box
    sx={{
      backgroundColor: 'background.default',
      borderTopColor: 'divider',
      borderTopStyle: 'solid',
      borderTopWidth: 1,
      pb: 3
    }}
    {...props}
  >
    <Container maxWidth="xl">
      <Grid
        container
        spacing={3}
        flexDirection={{xs: 'column-reverse', md: 'row'}}
      >
        <Grid
          item
          lg={3}
          md={4}
          sm={12}
          xs={12}
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'} 
          justifyContent={'center'}
        >
          <Logo color={'primary.main'}/>
          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
            variant="caption"
          >
            © 2022 MinNyeon Dev.
          </Typography>
        </Grid>
        <Grid
        item
        lg={9}
        md={8}
        sm={12}
        sx={{
          display : 'flex',
          flexWrap: 'wrap',
          m: 'auto'
        }}
        >
        {getMenuList().map((sections, index) => {
      return (<Fragment key={index}>{sections.links && sections.links.map((section, index2) => (
        <Grid
            item
            key={index2}
            md={4}
            sm={4}
            sx={{
              pl: {
                sm: 6,
                xs: '10%'
              },
              pt: 8,
              pb: 4
            }}
            xs={6}
          >
            <Typography
              color="text.secondary"
              fontWeight={'bold'}
              variant="h6"
            >
              {section.title}
            </Typography>
            <List disablePadding>
              {section.links && section.links.map((link) => (
                <ListItem
                  disableGutters
                  key={link.title}
                  sx={{
                    pb: 0,
                    pt: 1,
                  }}
                >
                  <ListItemAvatar
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      minWidth: 0,
                      pl : 1,
                      mr: 0.5
                    }}
                  >
                    <MinusOutlinedIcon color="primary" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={(
                      <Link
                        href={link.href}
                        color="textPrimary"
                        fontWeight={'bold'}
                        whiteSpace={'nowrap'}
                        variant="body1"
                      >
                        {link.title}
                      </Link>
                    )}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
      ))}</Fragment>
        )})}
      </Grid>
      </Grid>
    </Container>
  </Box>
);
