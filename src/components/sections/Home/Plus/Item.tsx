'use client';

import { IPlus } from '@/models/Plus';
import React, { FC } from 'react';
import s from './plus.module.scss';
import { Grid2, Typography } from '@mui/material';
import Image from 'next/image';
import useMobile from '@/hooks/UseMobile';

const Item: FC<IPlus> = ({ text, title, desc, digits }) => {
  const mobile = useMobile();
  return (
    <Grid2 container className={s.item} justifyContent={'center'}>
      <Image width={85} height={85} alt="Plus" src={'/images/plus.svg'} />

      <Grid2 size={{ xs: 12, sm: 5 }}>
        <Typography
          variant="h3"
          fontWeight={700}
          marginBottom={1.2}
          textAlign={mobile ? 'center' : 'start'}
        >
          {title}
        </Typography>
        <Typography variant="body1" textAlign={mobile ? 'center' : 'start'}>
          {text}
        </Typography>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 4 }}>
        <Typography
          variant="h3"
          fontWeight={700}
          marginBottom={1.2}
          textAlign={mobile ? 'center' : 'start'}
        >
          {digits}
        </Typography>
        <Typography variant="body1" textAlign={mobile ? 'center' : 'start'}>
          {desc}
        </Typography>
      </Grid2>
    </Grid2>
  );
};

export default Item;
