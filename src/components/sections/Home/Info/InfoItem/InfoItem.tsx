import React, { FC } from 'react';
import s from './item.module.scss';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { IInfoItem } from '@/models/InfoItem';

const InfoItem: FC<IInfoItem> = ({ cover, title, text }) => {
  return (
    <Box className={s.box}>
      <Image width={150} height={150} alt="Image" src={cover} />
      <Box className={s.textBlock}>
        <Typography variant="body1" fontWeight={700} marginBottom={0.6}>
          {title}
        </Typography>
        <Typography variant="body1">{text}</Typography>
      </Box>
    </Box>
  );
};

export default InfoItem;
