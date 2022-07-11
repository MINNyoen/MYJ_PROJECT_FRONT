import type { NextPage } from 'next';
import Head from 'next/head';
import { Divider } from '@mui/material';
import { MainLayout } from 'layout/main-layout';
import { HomeClients } from 'components/home/home-clients';
import { HomeHero } from 'components/home/home-hero';
import { HomeDevelopers } from 'components/home/home-developers';
import { HomeDesigners } from 'components/home/home-designers';
import { HomeFeatures } from 'components/home/home-features';
import { HomeTestimonials } from 'components/home/home-testimonials';
import useTransition from 'next-translate/useTranslation'

const Home: NextPage = () => {
  const {t} = useTransition('common');

  return (
    <>
      <Head>
        <title>
        {t('HomeTitle')}
        </title>
      </Head>
      <main>
        <HomeHero />
        <Divider />
        <HomeDevelopers />
        <Divider />
        <HomeDesigners />
        <HomeTestimonials />
        <HomeFeatures />
        <Divider />
        <HomeClients />
      </main>
    </>
  );
};

Home.getLayout = (page) => {
  return (
  <MainLayout>
    {page}
  </MainLayout>
)};

export default Home;
