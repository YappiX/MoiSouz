import React from 'react';
import s from './home.module.scss';
import { Box, Container } from '@mui/material';
import LandingFooter from '@/components/layout/Landing/LandingFooter';
import LandingHeader from '@/components/layout/Landing/LandingHeader';
import ScrollButton from '@/components/ui/NavBtn';
import Hero from '@/components/sections/Home/Hero/Hero';
import InfoSection from '@/components/sections/Home/Info/InfoSection';
import Circle from '@/components/sections/Home/Circle/Circle';
import Steps from '@/components/sections/Home/Steps/Steps';
import Plus from '@/components/sections/Home/Plus/Plus';
import Benefits from '@/components/sections/Home/Benefits/Benefits';
import Tariffs from '@/components/sections/Home/Tariffs/Tariffs';

const HomePage = () => {
  return (
    <Box component={'main'} className={s.wrapper}>
      <Container>
        <LandingHeader />
        <Hero />
        <InfoSection />
        <Circle />
        <Steps />
        <Plus />
        <Benefits />
        <Tariffs noPrice isSoon />
      </Container>
      <LandingFooter />
      <ScrollButton />
    </Box>
  );
};

export default HomePage;
