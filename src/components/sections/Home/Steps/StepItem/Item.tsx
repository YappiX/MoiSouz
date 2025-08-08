import React, { FC } from 'react';
import s from './step.module.scss';
import { IStep } from '@/models/Step';
import { Box, Typography } from '@mui/material';

const Step: FC<IStep> = ({ id, text, title, last }) => {
  return (
    <Box className={!last ? s.item : s.itemLast}>
      <Box className={s.box}>
        <Typography variant="body1" color="#fff" fontWeight={700}>
          {`Шаг ${id}.`}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        fontWeight={700}
        marginBottom={0.6}
        marginLeft={3}
      >
        {title}
      </Typography>
      <Typography variant="body1" marginLeft={3}>
        {text}
      </Typography>
    </Box>
  );
};

export default Step;
