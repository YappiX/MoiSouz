import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { PropsWithSX } from '@/models/Props';

interface Props {
  title: string;
  count: number;
}

export const MainPendingStatus: FC<PropsWithSX & Props> = ({
  sx = {},
  title,
  count,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        ...sx,
      }}
    >
      <Typography fontSize={14} fontWeight={600}>
        {title}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minWidth: 93,
          maxWidth: 93,
          height: 23,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            bgcolor: count > 0 ? '#EF3826' : '#00B69B',
            opacity: 0.2,
            borderRadius: 1.5,
          }}
        ></Box>

        <Typography
          sx={{
            position: 'relative',
            fontSize: 12,
            fontWeight: 700,
            color: count > 0 ? '#EF3826' : '#00B69B',
          }}
        >
          {count > 0 ? count : 'Нет'}
        </Typography>
      </Box>
    </Box>
  );
};
