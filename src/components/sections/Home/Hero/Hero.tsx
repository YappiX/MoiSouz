import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import Link from 'next/link';

import { Icon } from '@/components/ui';

import s from './hero.module.scss';

const Hero = () => {
  return (
    <Box component="section" className={s.wrapper}>
      <Typography variant="h1" className={s.title}>
        <span>Мой</span> Союз
      </Typography>
      <Typography className={s.subtitle}>
        комплексное решение для <span>автоматизации</span> деятельности
        <span> профсоюзов</span>
      </Typography>
      <Link href="/registration">
        <Button variant="contained" className={s.btn}>
          <Icon name="heart" color="secondary" />
          Попробовать бесплатно
        </Button>
      </Link>
    </Box>
  );
};

export default Hero;
