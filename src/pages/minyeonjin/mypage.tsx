import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Box, Container, Divider, Tab, Tabs, Typography } from '@mui/material';
import { AuthGuard } from 'components/authentication/auth-guard';
import { AccountGeneralSettings } from 'components/account/account-general-settings';
import { AccountNotificationsSettings } from 'components/account/account-notifications-settings';
import { AccountSecuritySettings } from 'components/account/account-security-settings';
import { MainLayout } from 'layout/main-layout';

const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Security', value: 'security' }
];

const Mypage: NextPage = () => {
  const [currentTab, setCurrentTab] = useState<string>('general');

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <>
      <Head>
        <title>
          Account | 
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4">
            Account
          </Typography>
          <Tabs
            indicatorColor="primary"
            onChange={handleTabsChange}
            scrollButtons="auto"
            textColor="primary"
            value={currentTab}
            variant="scrollable"
            sx={{ mt: 3 }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
              />
            ))}
          </Tabs>
          <Divider sx={{ mb: 3 }} />
          {currentTab === 'general' && <AccountGeneralSettings />}
          {currentTab === 'notifications' && <AccountNotificationsSettings />}
          {currentTab === 'security' && <AccountSecuritySettings />}
        </Container>
      </Box>
    </>
  );
};

Mypage.getLayout = (page) => (
  <AuthGuard>
    <MainLayout>
      {page}
    </MainLayout>
  </AuthGuard>
);

export default Mypage;
