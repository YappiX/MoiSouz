import { FC } from 'react';
import Image from 'next/image';
import { Box, ButtonBase, Typography } from '@mui/material';

import { Soon } from '@/components/ui';

import { IFormNews } from '@/models/News';
import { PropsWithSX } from '@/models/Props';

interface Props {
  data: IFormNews;
  soon?: boolean;
}

export const NewsCardBig: FC<PropsWithSX & Props> = ({
  sx = {},
  data,
  soon,
}) => {
  return (
    <ButtonBase
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'white',
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxShadow: '5px 5px 10px rgba(0,0,0,0.05)',
        ...sx,
      }}
    >
      {data.image && (
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${data.image}`}
          width={404}
          height={230}
          alt={data.title || ''}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '230px',
            objectFit: 'cover',
          }}
        />
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          gap: 1.5,
          padding: 2,
          width: '100%',
          height: '100%',
        }}
      >
        <Typography fontSize={16} fontWeight={700} align="left">
          {data.title}
        </Typography>
        <Typography fontSize={14} fontWeight={400} align="left" color="gray">
          {data.preview}
        </Typography>
        <Typography
          fontSize={10}
          fontWeight={400}
          align="left"
          color="gray"
          marginTop="auto"
        >
          {data.date}
        </Typography>
      </Box>

      {soon && <Soon />}
    </ButtonBase>
  );
};
