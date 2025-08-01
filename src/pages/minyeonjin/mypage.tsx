import type { ChangeEvent } from 'react';
import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Box, Button, Container, Dialog, Divider, Tab, Tabs, TextField, Typography } from '@mui/material';
import { AuthGuard } from 'components/authentication/auth-guard';
import { AccountGeneralSettings } from 'components/account/account-general-settings';
import { AccountNotificationsSettings } from 'components/account/account-notifications-settings';
import { AccountSecuritySettings } from 'components/account/account-security-settings';
import { MainLayout } from 'layout/main-layout';
import useTransition from 'next-translate/useTranslation';
import { authApi } from 'api/auth-api';
import { useAuth } from 'hooks/use-auth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { CheckModal } from 'components/checkModal';
import PersonIcon from '@mui/icons-material/Person';

const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Security', value: 'security' }
];

const Mypage: NextPage = () => {
  const {user, logout} = useAuth();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<string>('general');
  const [checkMeAlert, setCheckMeAlert] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [checkMeType, setCheckMeType] = useState<'DeleteAccount' | 'ChangePassword'>();
  const [verifyPassword, setVerifyPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const {t} = useTransition("mypage");

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    if(value === 'notifications') {
      toast('현재 개발 중인 메뉴입니다!', {icon : '🧑🏻‍💻'});
      return;
    }
    setCurrentTab(value);
  };

  const handleVerifyPassword = (event: ChangeEvent<HTMLInputElement>): void => {
    setVerifyPassword(event.target.value);
  };

  const handleLogout = async () : Promise<void> => {
    setDeleteModal(false)
    logout();
    router.push('/authentication/login').catch(console.error);
  };


  const handleCheckMeAlert = (type : 'DeleteAccount' | 'ChangePassword'): void => {
    setVerifyPassword('');
    setCheckMeAlert(!checkMeAlert);
    setCheckMeType(type);
  };

  const handleCheckMeAlertPassword = (type : 'DeleteAccount' | 'ChangePassword', newPassword : string): void => {
    setVerifyPassword('');
    setNewPassword(newPassword);
    setCheckMeAlert(!checkMeAlert);
    setCheckMeType(type);
  };

  const verifyIdentity = async (): Promise<void> => {
    setCheckMeAlert(!checkMeAlert);
    //본인 확인
    if(user) {
      await authApi.checkLogin(user?.loginId, verifyPassword).then( async (response)=> {
        if(!!response) {
          //계정 탈퇴 로직
          if(checkMeType === 'DeleteAccount') {
            await authApi.deleteAccount().then((response)=> {
              if(response) {
                toast.success(t('SuccessUpdate'));
                setDeleteModal(true);
              }
              else {
                toast.error(t('SuccessFailed'));
              }
            })
          }
          //비밀번호 변경 로직
          else if(checkMeType === 'ChangePassword') {
              await authApi.changePwd(user?.loginId, newPassword).then((response)=> {
                if(response) {
                  toast.success(t('SuccessUpdate'));
                  window.location.reload();
                }
                else {
                  toast.error(t('SuccessFailed'));
                }
              })
          }  
        }
        else {
          toast.error(t('NotVerifyPassword'));
        }
      }).catch((error)=>{
        return;
      })    
    }
  };

  return (
    <>
      <Head>
        <title>
        {t('MyPage')} | {t("MinYeonJin")}
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
          {t('MyPage')}
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
                label={t(tab.label)}
                value={tab.value}
              />
            ))}
          </Tabs>
          <Divider sx={{ mb: 3 }} />
          {currentTab === 'general' && <AccountGeneralSettings handleCheckMeAlert={handleCheckMeAlert}/>}
          {currentTab === 'notifications' && <AccountNotificationsSettings/>}
          {currentTab === 'security' && <AccountSecuritySettings handleCheckMeAlert={handleCheckMeAlertPassword}/>}
        </Container>
      </Box>

      {
      <Dialog
      fullWidth
      maxWidth="xs"
      onClose={setCheckMeAlert}
      open={!!checkMeAlert}
    >
        <Box sx={{ p: 3 }}>
          <Typography
            align="center"
            variant="h5"
          >
            {t('VerifyYourIdentity')}
          </Typography>
        </Box>
        <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p : 3,
              pt : 1
            }}
          >
            <TextField
              label={t("Password")}
              value={verifyPassword}
              type={'password'}
              onChange={handleVerifyPassword}
              size="small"
                sx={{
                    flexGrow: 1,
                    mr: 3
                  }}
                />
            <Button
              onClick={verifyIdentity}
            >
              {t("Confirm")}
            </Button>
          </Box>
    </Dialog>
    }
    {
      <CheckModal
        callback={handleLogout}
        icon={<PersonIcon fontSize='large' color={"secondary"}/>}
        open={deleteModal}
        data={{
          title:  t("DeleteAccount"),
          content: t("DeleteAccountComplete")
        }}
        cancelButton={false}
      />}
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
