import React, { FC } from 'react';

import { Box, ButtonBase, Typography } from '@mui/material';

import { IBenefitsProduct } from '@/models/Benefits';
import { PropsWithSX } from '@/models/Props';

interface IProps {
  data: IBenefitsProduct;
  onClick?: (data: IBenefitsProduct) => void;
  active?: boolean;
}

export const BenefitsProduct: FC<PropsWithSX & IProps> = ({
  sx,
  data,
  onClick,
  active,
}) => {
  return (
    <ButtonBase
      sx={{
        width: '100%',
        borderRadius: '14px',
        overflow: 'hidden',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: active ? 'primary.main' : 'transparent',
        ...(sx || {}),
      }}
      onClick={() => onClick && onClick(data)}
    >
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        justifyContent="space-between"
        bgcolor="white"
        width="100%"
        height="auto"
      >
        <img
          style={{
            height: '160px',
            objectFit: 'cover',
            objectPosition: 'top left',
            backgroundColor: 'gray',
            pointerEvents: 'none',
          }}
          src={data.image_url || `data:image/png;base64,${data.image}`}
        />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={80}
          px={1.5}
        >
          <Typography fontSize={16} fontWeight={600}>
            {data.name}
          </Typography>
        </Box>
      </Box>
    </ButtonBase>
  );
};
