'use client';

import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, FormGroup, InputLabel, TextField } from '@mui/material';

import { TextFieldCustom } from './input-textfield';
import { InputLabelRequired } from '../../input';

import { PropsWithSX } from '@/models/Props';

interface Props {
  name: string;
  label?: string | React.ReactNode;
  labelRequired?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
  disabled?: boolean;
}

export const InputAddress: FC<PropsWithSX & Props> = ({
  sx,
  name,
  label,
  labelRequired,
  errors,
  disabled,
}) => {
  const { register } = useFormContext();

  return (
    <FormGroup
      sx={{
        minWidth: 260,
        ...(sx || {}),
      }}
    >
      {label &&
        (labelRequired ? (
          <InputLabelRequired error={errors[name] != null}>
            {label}
          </InputLabelRequired>
        ) : (
          <InputLabel>{label}</InputLabel>
        ))}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextFieldCustom
            register={register(`${name}.postcode`)}
            sx={{ flex: 1 }}
            placeholder="Индекс"
            error={errors[name]?.postcode?.message}
            disabled={disabled}
            maxL={6}
          />
          <TextField
            {...register(`${name}.region`)}
            sx={{ flex: 3 }}
            placeholder="Регион"
            error={errors && !!errors[name]?.region?.message}
            helperText={(errors && errors[name]?.region?.message) || ''}
            disabled={disabled}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            {...register(`${name}.municipal`)}
            placeholder="Муниципальное образование"
            error={errors && !!errors[name]?.municipal?.message}
            helperText={(errors && errors[name]?.municipal?.message) || ''}
            disabled={disabled}
          />
          <TextField
            {...register(`${name}.locality`)}
            placeholder="Населенный пункт"
            error={errors && !!errors[name]?.locality?.message}
            helperText={(errors && errors[name]?.locality?.message) || ''}
            disabled={disabled}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            {...register(`${name}.street`)}
            sx={{ flex: 1 }}
            placeholder="Улица"
            error={errors && !!errors[name]?.street?.message}
            helperText={(errors && errors[name]?.street?.message) || ''}
            disabled={disabled}
          />
          <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <TextField
              {...register(`${name}.house`)}
              placeholder="Дом/Здание"
              error={errors && !!errors[name]?.house?.message}
              helperText={(errors && errors[name]?.house?.message) || ''}
              disabled={disabled}
            />
            <TextField
              {...register(`${name}.flat`)}
              placeholder="Квартира"
              error={errors && !!errors[name]?.flat?.message}
              helperText={(errors && errors[name]?.flat?.message) || ''}
              disabled={disabled}
            />
          </Box>
        </Box>
      </Box>
    </FormGroup>
  );
};
