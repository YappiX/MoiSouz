'use client';

import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import { PropsWithSX } from '@/models/Props';
import { InputSwitch as BaseInputSwitch } from '../input';

interface Props {
  name: string;
  label?: string;
  defaultValue?: boolean;
  disabled?: boolean;
}

export const InputSwitch: FC<PropsWithSX & Props> = ({
  sx,
  name,
  label,
  disabled,
}) => {
  const { control } = useFormContext();

  return (
    <Box sx={{ display: 'flex', ...(sx || {}) }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <BaseInputSwitch
            sx={{
              color: error ? '#d32f2f' : null,
              border: error && '2px solid red',
              borderRadius: 10,
            }}
            label={label}
            value={value == true}
            checked={value == true}
            onChange={(_, v) => onChange(v)}
            disabled={disabled}
          />
        )}
      />
    </Box>
  );
};
