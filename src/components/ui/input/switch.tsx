'use client';

import {
  FormControlLabel,
  styled,
  Switch,
  SwitchProps,
  Typography,
} from '@mui/material';
import { FC } from 'react';

const SwitchStyled = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 37,
  height: 20,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: 'primary',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: 'primary',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 16,
    height: 16,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

interface Props extends SwitchProps {
  label?: string;
}

export const InputSwitch: FC<Props> = ({ label, ...rest }) => {
  return (
    <FormControlLabel
      sx={{ ml: 0 }}
      control={<SwitchStyled {...rest} />}
      label={
        <Typography
          whiteSpace="break-spaces"
          component={'span'}
          fontWeight={600}
          marginLeft={1}
        >
          {label}
        </Typography>
      }
    />
  );
};
