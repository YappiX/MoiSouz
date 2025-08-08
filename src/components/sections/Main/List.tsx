import { PropsWithSX } from '@/models/Props';
import { Box } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

export const MainList: FC<PropsWithSX & PropsWithChildren> = ({
  sx = {},
  children,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'white',
        borderRadius: 4,
        border: '1px solid lightgray',
        overflow: 'hidden',
        '& > *': {
          p: 1.5,
          px: 2.5,
        },
        '& > :not(:first-of-type)': {
          borderTop: '1px solid lightgray',
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
