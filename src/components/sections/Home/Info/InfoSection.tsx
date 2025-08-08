import React from 'react';
import s from './info.module.scss';
import { Box, Grid2 } from '@mui/material';
import { items } from '@/constants/infoItems';
import InfoItem from './InfoItem/InfoItem';

const InfoSection = () => {
  return (
    <Box component="section" className={s.wrapper}>
      <Grid2 container spacing={1.6}>
        {items.length &&
          items.map((item) => (
            <Grid2 key={item.title} size={{ xs: 12, md: 6 }}>
              <InfoItem
                cover={item.cover}
                text={item.text}
                title={item.title}
              />
            </Grid2>
          ))}
      </Grid2>
    </Box>
  );
};

export default InfoSection;
