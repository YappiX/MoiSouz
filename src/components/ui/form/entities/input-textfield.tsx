'use client';

import { FC } from 'react';
import { InputLabel, TextField } from '@mui/material';
import { PropsWithSX } from '@/models/Props';
import { useIMask } from 'react-imask';

interface Props {
  label?: string;
  placeholder?: string;
  error?: string;
  maxL: number;
  disabled?: boolean;
  fullWidth?: boolean;
  register: object;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: any;
  allowPlus?: boolean; // Новый проп для разрешения знака +
}

export const TextFieldCustom: FC<PropsWithSX & Props> = ({
  sx,
  label,
  placeholder,
  error,
  maxL,
  disabled,
  fullWidth,
  register,
  onChange,
  allowPlus = false,
}) => {
  const { ref } = useIMask({
    mask: allowPlus ? '+7'.repeat(1) + '0'.repeat(maxL) : '0'.repeat(maxL),
    prepare: (value) => {
      if (allowPlus) {
        const hasPlus = value.startsWith('+');
        const cleaned = value.replace(/[^0-9]/g, '');
        return hasPlus ? '+' + cleaned : cleaned;
      }
      return value.replace(/[^0-9]/g, '');
    },
    maxLength: maxL,
    blocks: {
      '0': { mask: /[0-9]/ },
    },
  });

  return (
    <>
      {label && <InputLabel error={error != null}>{label}</InputLabel>}
      <TextField
        sx={{
          ...(sx || {}),
        }}
        {...register}
        placeholder={placeholder}
        error={!!error}
        helperText={error || ''}
        disabled={disabled}
        fullWidth={fullWidth}
        slotProps={{
          htmlInput: {
            maxLength: maxL + (allowPlus ? 1 : 0),
            ref: ref,
          },
        }}
        onChange={onChange}
      />
    </>
  );
};
