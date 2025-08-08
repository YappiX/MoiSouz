import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { Icon, IconName } from '@/components/ui';

import { PropsWithSX } from '@/models/Props';

interface Props {
  icon: IconName;
  color: string;
  title: string;
  value: string;
}

export const MainStatsCardMini: FC<PropsWithSX & Props> = ({
  sx = {},
  icon,
  color,
  title,
  value,
}) => {
  return (
    <Box sx={{ bgcolor: 'white', borderRadius: 3.5, p: 2, py: 1, ...sx }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <Typography fontSize={16} fontWeight={600}>
            {title}
          </Typography>
          <Typography fontSize={25} fontWeight={700} marginTop={0.5}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              bgcolor: color,
              opacity: 0.25,
              borderRadius: 5.5,
            }}
          ></Box>
          <Icon sx={{ position: 'relative' }} name={icon} color={color} />
        </Box>
      </Box>
    </Box>
  );
};
