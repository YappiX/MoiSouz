'use client';

import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { InputAutocomplete as BaseInputAutocomplete } from '@/components/ui/input';

import { PropsWithSX } from '@/models/Props';
import { IOption } from '@/models/Option';

interface Props {
  name: string;
  label?: React.ReactNode;
  labelRequired?: boolean;
  placeholder?: string;
  options: IOption[];
  multiple?: boolean;
  disabled?: boolean;
  error?: string;
}

export const InputAutocomplete: FC<PropsWithSX & Props> = ({
  sx,
  name,
  label,
  labelRequired,
  placeholder,
  options,
  multiple,
  disabled,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <BaseInputAutocomplete
          sx={sx}
          label={label}
          labelRequired={labelRequired}
          options={options}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          multiple={multiple}
          disabled={disabled}
          error={error?.message}
        />
      )}
    />
  );
};
