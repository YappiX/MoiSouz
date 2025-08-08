'use client';

import { Box, Grid2, Typography } from '@mui/material';
import React from 'react';
import s from './steps.module.scss';
import Step from './StepItem/Item';
import Image from 'next/image';
import useMedia from 'use-media';

const Steps = () => {
  const laptop = useMedia({ maxWidth: '980px' });
  return (
    <Box component="section" className={s.wrapper}>
      <Typography variant="h2" textTransform="uppercase" marginBottom={6}>
        5 простых шагов к успешному
        <br />
        профсоюзу
      </Typography>
      <Box className={s.box}>
        <Grid2 container spacing={laptop ? 7.5 : 0}>
          <Grid2
            size={{ xs: 12, sm: 12, md: 4 }}
            display={'flex'}
            justifyContent={laptop ? 'center' : 'start'}
            order={laptop ? 1 : 1}
          >
            <Step
              id={1}
              text={
                'После проверки данных будет обеспечен полнофункциональный доступ в сервис'
              }
              title={'Зарегистрируйтесь'}
            />
          </Grid2>
          <Grid2
            size={{ xs: 12, sm: 12, md: 4 }}
            display={'flex'}
            justifyContent={'center'}
            order={laptop ? 3 : 2}
          >
            <Step
              id={3}
              text={
                'Используя пошаговый мастер введите необходимые данные в систему'
              }
              title={'Ввод основных данных'}
            />
          </Grid2>
          <Grid2
            size={{ xs: 12, sm: 12, md: 4 }}
            display={'flex'}
            justifyContent={laptop ? 'center' : 'end'}
            order={laptop ? 5 : 3}
          >
            <Step
              id={5}
              text={
                'Конструктор процессов и структуры позволяют автоматизировать работу без лишних сложностей'
              }
              title={'Настройте структуру и автоматизируйте процессы'}
              last
            />
          </Grid2>
          <Grid2
            size={{ xs: 12, sm: 12, md: 7 }}
            display={'flex'}
            justifyContent={'center'}
            order={laptop ? 2 : 4}
          >
            <Step
              id={2}
              text={
                'Доступна оплата картой и по реквизитам организации (без НДС)'
              }
              title={'Выберите опции и оплатите'}
            />
          </Grid2>
          <Grid2
            size={{ xs: 12, sm: 12, md: 5 }}
            display={'flex'}
            justifyContent={laptop ? 'center' : 'start'}
            order={laptop ? 4 : 5}
          >
            <Step
              id={4}
              text={
                'Видеоинструкция и примеры использования сервиса доступны в любой момент времени'
              }
              title={'Изучите возможности МойСоюз'}
            />
          </Grid2>
        </Grid2>
        <Image
          src="/images/Vector1.svg"
          width={115}
          height={115}
          alt="Arrow"
          className={s.arrow1}
        />
        <Image
          src="/images/Vector6.svg"
          width={115}
          height={115}
          alt="Arrow"
          className={s.arrow2}
        />
        <Image
          src="/images/Vector6.svg"
          width={115}
          height={115}
          alt="Arrow"
          className={s.arrow3}
        />
        <Image
          src="/images/Vector1.svg"
          width={115}
          height={115}
          alt="Arrow"
          className={s.arrow4}
        />
      </Box>
    </Box>
  );
};

export default Steps;
