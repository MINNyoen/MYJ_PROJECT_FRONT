import type { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { SettingsButton } from 'components/Settings/settings-button';
import { SplashScreen } from 'components/splash-screen';
import { SettingsConsumer, SettingsProvider } from 'contexts/settings-context';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Router } from 'next/router';
import nProgress from 'nprogress';
import { Toaster } from 'react-hot-toast';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'store';
import { createTheme } from 'theme/theme';
import { createEmotionCache } from 'utils/create-emotion-cache';
import { AuthConsumer, AuthProvider } from 'contexts/jwt-context';
import 'styles/globals.css';
import 'styles/roomchat.css';


type EnhancedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
}

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }: EnhancedAppProps) {

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width"/>
        <meta name="description" content="" />
      </Head>
      <ReduxProvider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <SettingsProvider>
              <SettingsConsumer>
                {({ settings }) => (
                  <ThemeProvider theme={createTheme({
                    responsiveFontSizes: settings.responsiveFontSizes,
                    mode: settings.theme
                  })}>
                    <CssBaseline />
                    <Toaster position="top-center" />
                    <SettingsButton /> 
                    <AuthConsumer>
                        {
                          (auth) =>  (auth.isInitialized
                            ? getLayout(<Component {...pageProps}/>)
                            : <SplashScreen/>)
                        }
                      </AuthConsumer>
                  </ThemeProvider>
                )}
              </SettingsConsumer>
            </SettingsProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ReduxProvider>
    </CacheProvider>
  )
}

export default MyApp
