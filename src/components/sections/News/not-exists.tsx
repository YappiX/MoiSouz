import { Icon } from '@/components/ui';
import { Box, Typography } from '@mui/material';
import { FC } from 'react';

export const NewsNotExists: FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        p: 5,
      }}
    >
      <Icon name="news-not-exists" />
      <Typography sx={{ fontSize: 14, fontWeight: 600, textAlign: 'center' }}>
        Новостей пока нет, но скоро появятся
      </Typography>
    </Box>
  );
};
