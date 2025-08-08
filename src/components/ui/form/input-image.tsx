'use client';

import { createRef, FC, ReactNode, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, Button, FormHelperText } from '@mui/material';

import { Icon, IconName } from '@/components/ui/Icon';

import { getBackendUrl } from '@/constants/url';
import { PropsWithSX } from '@/models/Props';

interface Props {
  name: string;
  label?: ReactNode;
  disabled?: boolean;
  icon?: IconName | null;
  errorLabel?: boolean;
}

export const InputImage: FC<PropsWithSX & Props> = ({
  sx,
  name,
  label,
  disabled,
  icon = 'file-add',
  errorLabel = true,
}) => {
  const { control, getValues } = useFormContext();
  const ref = createRef<HTMLInputElement>();

  const [input, setInput] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const value = getValues(name) || input;

  useEffect(() => {
    if (value == null) {
      setPreview(null);
      return;
    }
    switch (typeof value) {
      case 'object':
        const urlImage = URL.createObjectURL(value);
        const formData = new FormData();
        formData.append('avatar', value);
        setPreview(urlImage);
        break;

      case 'string':
        setPreview(`${getBackendUrl}${value}`);
        break;

      default:
        break;
    }
  }, [value]);

  const handleOpen = () => {
    ref.current?.click();
  };

  return (
    <Controller
      name={name}
      control={control}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            ...(sx || {}),
          }}
        >
          <input
            style={{ display: 'none' }}
            ref={ref}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            id={name}
            name={name}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(event: any) => {
              const file = event.target.files[0];
              if (file == null) return;
              onChange(file);
              setInput(file);
            }}
          />
          <Button
            name={name}
            sx={{
              p: 0,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              width: '100%',
              flex: 1,
              backgroundColor: 'rgb(241, 244, 249)',
              borderColor: error ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)',
              color: 'rgb(166, 166, 166)',
              backgroundImage: preview && `url( ${preview} )`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',

              '&:hover': {
                borderColor: 'rgba(0, 0, 0, 0.87)',
              },
            }}
            variant="outlined"
            onClick={handleOpen}
            disabled={disabled}
          >
            {preview == null && (
              <>
                {label}
                {disabled != true && icon && (
                  <Icon name={icon} color="rgb(166, 166, 166)" />
                )}
              </>
            )}
            {errorLabel && (
              <FormHelperText
                sx={{ maxWidth: '100%', whiteSpace: 'break-spaces' }}
                id={`${name}-helper`}
                error={true}
              >
                {error && error?.message}
              </FormHelperText>
            )}
          </Button>
        </Box>
      )}
    />
  );
};
