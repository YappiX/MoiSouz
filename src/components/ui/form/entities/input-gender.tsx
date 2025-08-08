'use client';

import React, { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  FormControlLabel,
  FormGroup,
  InputLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

import { InputLabelRequired } from '../../input';

import { PropsWithSX } from '@/models/Props';

interface Props {
  name: string;
  label?: React.ReactNode;
  labelRequired?: boolean;
  defaultValue?: 'female' | 'male';
  disabled?: boolean;
}

export const InputGender: FC<PropsWithSX & Props> = ({
  sx,
  name,
  label,
  labelRequired,
  disabled,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <FormGroup
          sx={{
            minWidth: 40,
            ...(sx || {}),
          }}
        >
          {label &&
            (labelRequired ? (
              <InputLabelRequired error={error != null}>
                {label}
              </InputLabelRequired>
            ) : (
              <InputLabel error={error != null}>{label}</InputLabel>
            ))}
          <RadioGroup
            sx={{ mr: 'auto' }}
            name={name}
            defaultValue={undefined}
            value={value}
            onChange={onChange}
          >
            <FormControlLabel
              sx={{ ml: 0, mr: '24px' }}
              value="male"
              control={
                <Radio
                  color="primary"
                  style={{ height: '29px', width: '29px' }}
                  disabled={disabled}
                />
              }
              label={
                <Typography color={value == 'male' ? 'primary' : undefined}>
                  Муж
                </Typography>
              }
              labelPlacement="start"
            />
            <FormControlLabel
              sx={{ ml: 0, mr: '24px' }}
              value="female"
              control={
                <Radio
                  color={'error'}
                  style={{ height: '29px', width: '29px' }}
                  disabled={disabled}
                />
              }
              label={
                <Typography color={value == 'female' ? 'red' : undefined}>
                  Жен
                </Typography>
              }
              labelPlacement="start"
            />
          </RadioGroup>
        </FormGroup>
      )}
    />
  );
};
