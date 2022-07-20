import type { FC } from 'react';
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
import { alpha } from '@mui/material/styles';
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
      >
        <Grid
          item
          md={3}
          sm={12}
          sx={{
            mt: {
              md: 10,
              xs: 6
            }
          }}
        >
          <Logo />
          <Typography
            color="textSecondary"
            sx={{ mt: 1 }}
            variant="caption"
          >
            © 2021 Devias.
          </Typography>
        </Grid>
        <Grid
        item
        md={9}
        sm={12}
        spacing={3}
        sx={{
          display : 'flex',
          flexWrap: 'wrap'
        }}
        >
        {getMenuList().map((sections, index) => {
      return (<>{sections.links && sections.links.map((section, item) => (
        <Grid
            item
            key={section.title}
            md={4}
            sm={6}
            sx={{
              pt: {
                md: 10,
                xs: 6
              }
            }}
            xs={12}
          >
            <Typography
              color="textSecondary"
              variant="overline"
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
                    pt: 1
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
                        variant="subtitle2"
                      >
                        {link.title}
                      </Link>
                    )}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
      ))}</>
        )})}
      </Grid>
      </Grid>
      <Divider
        sx={{
          borderColor: (theme) => alpha(theme.palette.primary.contrastText, 0.12),
          my: 6
        }}
      />
      <Typography
        color="textSecondary"
        variant="caption"
      >
        All Rights Reserved.
      </Typography>
    </Container>
  </Box>
);
