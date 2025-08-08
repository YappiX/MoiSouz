import React, { FC } from 'react';

import { Box, ButtonBase, Typography } from '@mui/material';

import { Icon, IconName } from '@/components/ui';
import { PropsWithSX } from '@/models/Props';

interface IProps {
  name: string;
  value: string | number;
  icon: IconName;
  color?: string;
  onClick?: () => void;
  active?: boolean;
}

export const BenefitsStat: FC<PropsWithSX & IProps> = ({
  sx,
  name,
  value,
  icon,
  color,
  onClick,
  active,
}) => {
  return (
    <ButtonBase
      sx={{
        width: 'fit-content',
        borderRadius: '14px',
        overflow: 'hidden',
        outlineWidth: 2,
        outlineStyle: 'solid',
        outlineColor: active ? 'primary.main' : 'transparent',
        ...(sx || {}),
      }}
      onClick={() => onClick && onClick()}
    >
      <Box
        display="flex"
        flex={1}
        justifyContent="space-between"
        bgcolor="white"
        p={1.5}
        gap={1.5}
        width="100%"
        height="auto"
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography fontSize={16}>{name}</Typography>
          <Box display="flex" gap={0.5}>
            <Typography fontSize={25} fontWeight="bold">
              {value}
            </Typography>
          </Box>
        </Box>
        <Box
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
          width={70}
          height={70}
          borderRadius={5.5}
          sx={{
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              opacity: 0.4,
              backgroundColor: color || 'primary.main',
              borderRadius: '23px',
            },
          }}
        >
          <Icon
            sx={{ scale: 1.1 }}
            name={icon}
            color={color || 'secondary.main'}
          />
        </Box>
      </Box>
    </ButtonBase>
  );
};
