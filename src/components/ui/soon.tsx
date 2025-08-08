import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { Icon } from './Icon';

import { PropsWithSX } from '@/models/Props';

export const Soon: FC<PropsWithSX> = ({ sx = {} }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        ...sx,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          bgcolor: 'white',
          opacity: 0.8,
        }}
      ></Box>
      <Icon sx={{ position: 'relative' }} name="soon" color="black" />
      <Typography
        sx={{
          position: 'relative',
          fontSize: 18,
          fontWeight: 700,
          color: 'black',
        }}
      >
        Скоро
      </Typography>
    </Box>
  );
};
