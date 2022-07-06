import '../styles/globals.css'
import {ThemeProvider} from '@mui/material';
import {createTheme} from 'theme/theme';
import type { AppProps } from 'next/app'
import nProgress from 'nprogress';
import { Router } from 'next/router';
import { NextPage } from 'next';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'store';
import type { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createEmotionCache } from 'utils/create-emotion-cache';
import Head from 'next/head';
import { LocalizationProvider } from '@mui/x-date-pickers';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { SettingsConsumer, SettingsProvider } from 'contexts/settings-context';
import { SettingsButton } from 'components/Settings/settings-button';


type EnhancedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
}

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }: EnhancedAppProps) {

  
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          MinYeonJin's Web
        </title>
        <meta name="viewport" content="initial-scale=1, width=device-width"/>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ReduxProvider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SettingsProvider>
            <SettingsConsumer>
              {({ settings }) => (
                <ThemeProvider theme={createTheme({
                  direction: settings.direction,
                  responsiveFontSizes: settings.responsiveFontSizes,
                  mode: settings.theme
                })}>
                  <SettingsButton />
                  <Component {...pageProps} />
                </ThemeProvider>
              )}
            </SettingsConsumer>
          </SettingsProvider>
        </LocalizationProvider>
      </ReduxProvider>
    </CacheProvider>
  )
}

export default MyApp
