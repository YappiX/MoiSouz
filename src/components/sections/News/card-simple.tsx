import { FC } from 'react';
import { ButtonBase, Typography } from '@mui/material';

import { IFormNews } from '@/models/News';
import { PropsWithSX } from '@/models/Props';

interface Props {
  data: IFormNews;
}

export const NewsCardSimple: FC<PropsWithSX & Props> = ({ sx = {}, data }) => {
  return (
    <ButtonBase
      sx={{
        padding: 2,
        overflow: 'hidden',
        bgcolor: 'white',
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: 1.5,
        width: '100%',
        boxShadow: '5px 5px 10px rgba(0,0,0,0.05)',
        ...sx,
      }}
    >
      <Typography fontSize={14} fontWeight={700} align="left">
        {data.title}
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
    </ButtonBase>
  );
};
