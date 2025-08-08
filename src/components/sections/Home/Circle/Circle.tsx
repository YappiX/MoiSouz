'use client';

import React from 'react';
import s from './circle.module.scss';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import useMobile from '@/hooks/UseMobile';
import TextAroundBlock from './TextAroundBlock/TextAroundBlock';
import Link from 'next/link';

const Circle = () => {
  const mobile = useMobile();
  return (
    <Box component="section" className={s.wrapper}>
      <Typography
        variant="h2"
        textTransform="uppercase"
        marginBottom={!mobile ? 6.9 : 4.8}
      >
        ВОЗМОЖНОСТИ СЕРВИСА
      </Typography>
      <Box className={s.box}>
        <Image
          width={!mobile ? 500 : 330}
          height={!mobile ? 500 : 330}
          alt="Circle"
          src={!mobile ? '/images/circle.svg' : '/images/circle-no-dots.svg'}
          className={s.image}
        />
        <Typography className={s.circleTitle}>
          <span>Мой</span>Союз
        </Typography>
        <Typography className={s.circleText} variant="body1">
          модульность решения позволяет
          <br />
          подключать необходимые блоки в любой
          <br />
          момент времени
        </Typography>
        <Link href="/registration">
          <Button className={s.circleBtn} variant="outlined">
            Начать пользоваться
          </Button>
        </Link>
      </Box>
      <Box className={s.textAround}>
        <TextAroundBlock />
      </Box>
    </Box>
  );
};

export default Circle;
