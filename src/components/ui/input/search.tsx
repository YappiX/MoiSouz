'use client';

import { FC, useEffect, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';

import { Icon } from '@/components/ui';
import { PropsWithSX } from '@/models/Props';

interface Props {
  defaultValue?: string;
  onSearch: (value: string) => void;
}

export const InputSearch: FC<PropsWithSX & Props> = ({
  sx,
  defaultValue,
  onSearch,
}) => {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [value, setValue] = useState<string>(defaultValue || '');

  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  useEffect(() => {
    if (timer == null) return;
    return () => clearTimeout(timer);
  }, [timer]);

  const handleChange = (value: string) => {
    setValue(value);

    const timer = setTimeout(() => onSearch(value), 1000);
    setTimer(timer);
  };

  const handleClick = () => {
    setValue('');
    onSearch('');
  };

  return (
    <TextField
      sx={sx}
      placeholder="Поиск"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Icon name="search" sx={{ scale: 1.35 }} />
            </InputAdornment>
          ),
          endAdornment: value.length > 0 && (
            <InputAdornment position="start">
              <IconButton onClick={handleClick}>
                <Icon name="close" sx={{ opacity: 0.5, scale: 1.35 }} />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      value={value || ''}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
};
