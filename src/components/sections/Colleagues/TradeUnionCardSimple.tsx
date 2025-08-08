import React, { FC } from 'react';
import Image from 'next/image';

import { Box, Typography } from '@mui/material';

import { ITradeUnion } from '@/models/TradeUnion';

interface IProps {
  data: ITradeUnion;
}

export const TradeUnionCardSimple: FC<IProps> = ({ data }) => {
  return (
    <Box display="flex" alignItems="center" gap={2} mb={2} overflow="hidden">
      <Image
        style={{
          borderRadius: 10,
        }}
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${data.logo}`}
        alt=""
        width={75}
        height={75}
      />
      <Box>
        <Typography fontSize={18} color="primary" fontWeight="bold">
          {data.title}
        </Typography>
      </Box>
    </Box>
  );
};
