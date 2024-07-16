import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Card, Container, Divider, Grid, Link, Typography } from '@mui/material';
import { GuestGuard } from 'components/authentication/guest-guard';
import { Logo } from 'components/logo';
import useTransition from 'next-translate/useTranslation';
import path from 'components/path.json'
import { JWTRegister } from 'components/authentication/jwt-register';

const Login: NextPage = () => {
  const {t} = useTransition('common');
  const {t : r, lang} = useTransition('register');

  return (
    <>
      <Head>
        <title>
          {r('Register')} | {t('HomeTitle')}
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            m: 'auto',
            py: {
              xs: '60px',
              md: '120px'
            }
          }}
        >
          <Card
            elevation={16}
            sx={{ p: 4 }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <NextLink
                href="/"
                passHref
              >
                <a>
                  <Logo
                    sx={{
                      height: 40,
                      width: 40
                    }}
                  />
                </a>
              </NextLink>
              <Typography variant="h4">
                {r('Register')}
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ mt: 2 }}
                variant="body2"
              >
                {r('RegisterInContent')}
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3
              }}
            >
              <JWTRegister/>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Grid container>
              <Grid item xs={9}>
              <Box>
            <div>
              <NextLink
                href={path.pages.authentication.login}
                passHref
              >
                <Link
                  color="textSecondary"
                  variant="body2"
                >
                  {r('HavingAnAccount')}
                </Link>
              </NextLink>
            </div>
              </Box>
              </Grid>
              <Grid item xs={3}>
              <img
              alt="Auth platform"
              src={'/static/icons/jwt.svg'}
              style={{float: 'right', marginTop: 10}}
              width={30}
                />
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>
    </>
  );
};

Login.getLayout = (page) => (
  <GuestGuard>
    {page}
  </GuestGuard>
);

export default Login;
