import React, { FC } from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import { IBenefitsCategory } from '@/models/Benefits';
import { PropsWithSX } from '@/models/Props';
import { Icon } from '@/components/ui';
import { BBCategoryIconByName } from '@/utils/BBCategoryIconByName';

interface IProps {
  data: IBenefitsCategory;
  onClick?: (data: IBenefitsCategory) => void;
  active?: boolean;
}

export const BenefitsCategory: FC<PropsWithSX & IProps> = ({
  sx,
  data,
  onClick,
  active,
}) => {
  return (
    <ButtonBase
      sx={{
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
        p={1.5}
        gap={1.5}
        width="100%"
        height="100%"
      >
        <Icon
          sx={{ scale: 0.75 }}
          name={BBCategoryIconByName(data.name)}
          color={active ? 'primary.main' : '#000000'}
        />
        <Typography
          fontSize={16}
          fontWeight={600}
          lineHeight={1}
          color={active ? 'primary.main' : '#000000'}
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {data.name}
        </Typography>
      </Box>
    </ButtonBase>
  );
};
