import { FC, PropsWithChildren } from 'react';

import { InputLabel } from '@mui/material';

import { PropsWithSX } from '@/models/Props';
import theme from '@/styles/theme';

interface Props {
  error?: string | boolean;
}

export const InputLabelRequired: FC<
  PropsWithChildren & PropsWithSX & Props
> = ({ children, sx, error }) => {
  return (
    <InputLabel sx={sx}>
      {children}{' '}
      <span
        style={
          !!error
            ? { color: theme.palette.red.main }
            : { color: theme.palette.primary.main }
        }
      >
        *
      </span>
    </InputLabel>
  );
};
