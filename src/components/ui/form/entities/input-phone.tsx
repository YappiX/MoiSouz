'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { useIMask } from 'react-imask';

interface InputPhoneProps {
  name: string;
  label?: string;
  required?: boolean;
}

export const InputPhone: React.FC<InputPhoneProps> = ({
  name,
  label = 'Телефон',
  required = false,
}) => {
  const { control } = useFormContext();
  const { ref: imaskRef } = useIMask({
    mask: '+{7}0000000000',

    blocks: {
      '0': { mask: /[0-9]/ },
    },
  });

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? 'Обязательное поле' : false,
        pattern: {
          value: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
          message: 'Введите корректный номер (+7 XXX XXX-XX-XX)',
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          inputRef={(el) => {
            field.ref(el);
          }}
          slotProps={{ htmlInput: { ref: imaskRef } }}
          label={label}
          placeholder="+7 (XXX) XXX-XX-XX"
          error={!!error}
          helperText={error?.message}
          fullWidth
          margin="normal"
        />
      )}
    />
  );
};
