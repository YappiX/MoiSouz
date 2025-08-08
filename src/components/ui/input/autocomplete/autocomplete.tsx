'use client';

import { FC } from 'react';
import {
  Autocomplete,
  Box,
  Chip,
  FormGroup,
  InputLabel,
  TextField,
} from '@mui/material';

import { InputLabelRequired } from '../label-required';

import { PropsWithSX } from '@/models/Props';
import { IOption, IOptionValue } from '@/models/Option';

type Props = {
  label?: string | React.ReactNode;
  labelRequired?: boolean;
  placeholder?: string;
  options: IOption[];
  disabled?: boolean;
  error?: string;
  freeSolo?: boolean;
} & (PropsSingle | PropsMultiple);

interface PropsSingle {
  multiple?: false;
  value: IOptionValue | null;
  onChange: (value: IOptionValue | null) => void;
}

interface PropsMultiple {
  multiple: true;
  value: IOptionValue[];
  onChange: (value: IOptionValue[]) => void;
}

export const InputAutocomplete: FC<PropsWithSX & Props> = ({
  sx,
  label,
  labelRequired,
  placeholder,
  options,
  multiple,
  disabled,
  error,
  value,
  onChange,
  freeSolo,
}) => {
  return (
    <FormGroup sx={sx}>
      {label &&
        (labelRequired ? (
          <InputLabelRequired error={error}>{label}</InputLabelRequired>
        ) : (
          <InputLabel>{label}</InputLabel>
        ))}
      <Autocomplete
        freeSolo={freeSolo ? freeSolo : false}
        value={
          (value &&
            (multiple
              ? options.filter((el) =>
                  (value as IOptionValue[]).includes(el.id),
                )
              : options.find((el) => el.id == value))) ||
          (multiple ? [] : null)
        }
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.title
        }
        onChange={(_, value) =>
          multiple == true
            ? onChange((value as IOption[]).map((el) => el.id))
            : onChange((value as IOption).id)
        }
        disablePortal
        multiple={multiple}
        options={options}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            error={error != null}
            helperText={error}
          />
        )}
        renderTags={(value, getTagProps) => (
          <Box
            sx={{
              maxHeight: 230,
              overflowY: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {value.map((option, index) => (
              <Chip
                label={option.title}
                {...getTagProps({ index })}
                key={option.id}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        )}
        disabled={disabled}
      />
    </FormGroup>
  );
};
