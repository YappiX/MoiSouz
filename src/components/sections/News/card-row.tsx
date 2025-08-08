import { FC } from 'react';
import Image from 'next/image';
import { Box, ButtonBase, Typography } from '@mui/material';

import { IFormNews } from '@/models/News';
import { PropsWithSX } from '@/models/Props';

interface Props {
  data: IFormNews;
}

export const NewsCardRow: FC<PropsWithSX & Props> = ({ sx = {}, data }) => {
  return (
    <ButtonBase
      sx={{
        overflow: 'hidden',
        bgcolor: 'white',
        borderRadius: 5,
        display: 'flex',
        alignItems: 'start',
        width: '100%',
        boxShadow: '5px 5px 10px rgba(0,0,0,0.05)',
        ...sx,
      }}
    >
      {data.image && (
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${data.image}`}
          width={299}
          height={230}
          alt={data.title || ''}
          style={{
            width: '100%',
            maxWidth: '299px',
            height: '230px',
            objectFit: 'cover',
          }}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          gap: 1.5,
          p: 2,
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          gap={2}
        >
          <Typography
            fontSize={14}
            fontWeight={700}
            align="left"
            maxWidth="65%"
          >
            {data.title}
          </Typography>
          {data.tradeunions && data.tradeunions.length > 0 && (
            <Typography
              fontSize={14}
              fontWeight={700}
              align="left"
              color="primary"
              maxWidth="65%"
            >
              Источник:{' '}
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (data.tradeunions[0] as any).title
              }
            </Typography>
          )}
        </Box>
        <Typography fontSize={14} fontWeight={400} align="left">
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
    </ButtonBase>
  );
};
