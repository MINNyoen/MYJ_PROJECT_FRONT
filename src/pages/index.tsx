import type { NextPage } from "next";
import Head from "next/head";
import { MainLayout } from "layout/main-layout";
import { MainFirst } from "components/home/home-first";
import { HomeThird } from "components/home/home-third";
import useTransition from "next-translate/useTranslation";
import { AuthGuard } from "components/authentication/auth-guard";
import { Box } from "@mui/material";

const Home: NextPage = () => {
  const { t } = useTransition("common");

  return (
    <>
      <Head>
        <title>{t("HomeTitle")}</title>
      </Head>
      <Box role="main">
        <MainFirst />
        <HomeThird />
      </Box>
    </>
  );
};

Home.getLayout = (page) => {
  return (
    <AuthGuard>
      <MainLayout>{page}</MainLayout>
    </AuthGuard>
  );
};

export default Home;
