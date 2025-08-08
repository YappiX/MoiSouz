import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { Icon, IconName, Soon } from '@/components/ui';

import { PropsWithSX } from '@/models/Props';

interface Props {
  icon: IconName;
  color: string;
  title: string;
  value: string;
  percent: number;
  soon?: boolean;
}

export const MainStatsCard: FC<PropsWithSX & Props> = ({
  sx = {},
  icon,
  color,
  title,
  value,
  percent,
  soon
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'white',
        borderRadius: 3.5,
        p: 2,
        ...sx,
      }}
    >
  
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          {soon && <Soon sx={{ zIndex: 1, '& > div': {borderRadius:"14px",}}}></Soon>}
          <Typography fontSize={16} fontWeight={600}>
            {title}
          </Typography>
          <Typography fontSize={25} fontWeight={700} marginTop={2.5}>
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
      {percent !== 0 && <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.4,
          marginTop: 'auto',
          paddingTop: 2,
        }}
      >
        <Icon
          name={percent < 0 ? 'stats-arrow-to-down' : 'stats-arrow-to-up'}
          color={percent < 0 ? 'red' : 'green'}
        />
        <Typography
          fontSize={16}
          fontWeight={600}
          color={percent < 0 ? 'red' : 'green'}
          marginLeft={0.6}
        >
          {percent}%
        </Typography>
        <Typography fontSize={16} fontWeight={600}>
          за месяц
        </Typography>
      </Box>}
    </Box>
  );
};
