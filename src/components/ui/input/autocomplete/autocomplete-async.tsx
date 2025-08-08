'use client';

import { FC, useEffect, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

import { IOption } from '@/models/Option';
import { PropsWithSX } from '@/models/Props';
import { useOptions } from '@/hooks/UseOptions';

type Props = {
  api: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convert?: (value: any) => IOption;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  freeSolo?: boolean;
} & (PropsSingle | PropsMultiple);

interface PropsSingle {
  multiple?: false;
  value: IOption | null;
  onChange: (value: IOption | null) => void;
}

interface PropsMultiple {
  multiple: true;
  value: IOption[];
  onChange: (value: IOption[]) => void;
}

export const InputAutocompleteAsync: FC<PropsWithSX & Props> = ({
  sx = {},
  api,
  convert,
  placeholder,
  multiple,
  disabled,
  error,
  value,
  onChange,
  freeSolo,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>('');

  const { data: cities, loading } = useOptions({
    name: api,
    params: {
      q: search,
    },
    convert,
  });

  useEffect(() => {
    if (multiple) {
      setSearch('');
      return;
    }
    setSearch(value ? value.title : '');
  }, [value]);

  const handleOpen = () => {
    setOpen(true);
    (async () => {})();
  };

  const handleClose = () => {
    setOpen(false);

    if (multiple) {
      setSearch('');
      return;
    }
    setSearch(value ? value.title : '');
  };

  return (
    <Autocomplete
      sx={sx}
      freeSolo={freeSolo}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      options={cities?.data || []}
      loading={loading}
      multiple={multiple}
      disabled={disabled}
      value={multiple ? (value as IOption[]) : (value as IOption)}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.title
      }
      onChange={(_, value) =>
        multiple == true
          ? onChange(value as IOption[])
          : onChange(value as IOption)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          error={error != null}
          helperText={error}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};
