import { FC } from 'react';
import { Box, IconButton, Typography } from '@mui/material';

import { Icon } from '@/components/ui';

interface Props {
  count: number;
}

export const ButtonNotify: FC<Props> = ({ count }) => {
  return (
    <IconButton>
      <Icon name="bell" />
      {count > 0 && (
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            right: 0,
            top: 0,
            height: '16px',
            minWidth: '16px',
            px: 0.4,
            borderRadius: '16px',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'red.main',
          }}
        >
          <Typography color="white" fontSize={12} fontWeight={700}>
            {count}
          </Typography>
        </Box>
      )}
    </IconButton>
  );
};
