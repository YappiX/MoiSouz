'use client';

import { FC, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';

import { PropsWithSX } from '@/models/Props';

interface Props {
  name: string;
  label?: ReactNode;
  defaultValue?: boolean;
  link?: string;
  disabled?: boolean;
}

export const InputCheckbox: FC<PropsWithSX & Props> = ({
  sx,
  name,
  label,
  link,
  disabled,
}) => {
  const { control } = useFormContext();
  let fhalf = '';
  let shalf = '';
  let symb = '';
  if (typeof label === 'string' && link) {
    if (label.includes('с ')) {
      symb = 'с ';
    }
    const arr = label.split(symb);
    fhalf = arr[0];
    shalf = arr[1] || '';
  }

  return (
    <Box sx={{ display: 'flex', ...(sx || {}) }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <FormControlLabel
            control={
              <Checkbox
                sx={{ color: error ? '#d32f2f' : null }}
                value={value == true}
                checked={value == true}
                onChange={onChange}
                disabled={disabled}
              />
            }
            label={
              <Typography
                whiteSpace="break-spaces"
                component={'span'}
                variant="body1"
                fontWeight={600}
              >
                <a href={link} target="_blank">
                  {fhalf && shalf ? (
                    <span>
                      {fhalf}c{' '}
                      <span
                        style={{
                          color: 'rgb(72, 128, 255)',
                          textDecoration: 'underline',
                        }}
                      >
                        {shalf}
                      </span>
                    </span>
                  ) : (
                    label
                  )}
                </a>
              </Typography>
            }
          />
        )}
      />
    </Box>
  );
};
