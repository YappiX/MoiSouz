'use client';

import { createRef, FC, ReactNode, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, Button, FormHelperText, Typography } from '@mui/material';

import { Icon, IconName } from '@/components/ui/Icon';
import { PropsWithSX } from '@/models/Props';
import { getBackendUrl } from '@/constants/url';

const STYLES = {
  icon: {
    primary: {
      color: 'secondary.main',
    },
    secondary: {
      color: 'rgb(166, 166, 166)',
    },
  },
  button: {
    primary: {
      backgroundColor: 'primary.main',
      border: 'none',
      color: 'white',
    },
    secondary: {
      border: '1px dotted rgb(226, 226, 226)',
      '&:hover': {
        borderColor: 'rgba(0, 0, 0, 0.87)',
      },
    },
  },
  fileName: {
    primary: {
      color: 'secondary.main',
    },
    secondary: {},
  },
};

interface Props {
  name: string;
  label?: ReactNode;
  mw?: string;
  accept?: string;
  /** Deafult is "cloud" */
  imageInit?: IconName;
  /** Deafult is imageInit */
  imageSelect?: IconName;
  /** Deafult is "primary" */
  type?: 'primary' | 'secondary'; //
  defaultFile?: string;
}

export const InputFile: FC<PropsWithSX & Props> = ({
  sx,
  name,
  label,
  mw,
  accept,
  imageInit = 'cloud',
  imageSelect,
  type = 'primary',
  defaultFile,
}) => {
  const { control, getValues, setValue } = useFormContext();
  const ref = createRef<HTMLInputElement>();

  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | string | null>(null);
  const value = getValues(name);

  useEffect(() => {
    if (defaultFile) setPreview(defaultFile);
  }, [defaultFile]);

  useEffect(() => {
    if (value == null) {
      setPreview(null);
      if (ref.current) {
        ref.current.type = 'text';
        ref.current.type = 'file';
      }
      return;
    }

    switch (typeof value) {
      case 'object':
        const formData = new FormData();
        setUploadedFile(value);
        formData.append('file', value);
        setPreview(value.name || value.originalName);
        break;

      case 'string':
        setPreview(`${getBackendUrl}${value}`);
        setUploadedFile(`${getBackendUrl}${value}`);
        break;

      default:
        break;
    }
  }, [value]);

  const handleOpen = () => {
    ref.current?.click();
  };

  const handleClear = () => {
    setValue(name, null, { shouldValidate: true });
    setPreview(null);
  };

  const handleDownload = () => {
    if (!uploadedFile) return;
    if (typeof uploadedFile === 'object') {
      const url = URL.createObjectURL(uploadedFile);
      const link = document.createElement('a');
      link.href = url;
      link.download = uploadedFile.name;
      link.click();
      URL.revokeObjectURL(url);
    }
    if (typeof uploadedFile === 'string') {
      const link = document.createElement('a');
      link.href = uploadedFile;
      link.download = uploadedFile;
      link.target = '_blank';
      link.click();
    }
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
            justifyContent: 'center',
            ...(sx || {}),
          }}
        >
          <input
            style={{ display: 'none' }}
            ref={ref}
            type="file"
            accept={accept}
            id={name}
            name={name}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(event: any) => {
              const file = event.target.files[0];
              if (file == null) return;
              setValue(name, file, { shouldValidate: true, shouldTouch: true });
              setPreview(file.name || file.originalName);
            }}
          />
          <Button
            name={name}
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              width: '50%',
              minWidth: mw || 320,
              flex: 1,
              margin: '0 auto',
              ...((type && STYLES.button[type]) || {}),
              lineHeight: '27px',
              fontSize: '16px',
              color: 'rgb(32, 34, 36)',
            }}
            variant="outlined"
            onClick={preview == null ? handleOpen : handleDownload}
          >
            {preview == null ? (
              <Box
                display={'flex'}
                alignItems={'center'}
                gap={'12px'}
                justifyContent={'center'}
                width={'100%'}
              >
                <Icon name={imageInit} color={STYLES.icon[type]?.color} />
                {label}
              </Box>
            ) : (
              <Box
                display={'flex'}
                alignItems={'center'}
                gap={'12px'}
                maxWidth={'100%'}
              >
                <Icon
                  name={imageSelect || imageInit}
                  color={STYLES.icon[type]?.color}
                />
                <Typography
                  sx={{
                    maxWidth: 'calc(100%)',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    ...((type && STYLES.fileName[type]) || {}),
                  }}
                >
                  {preview}
                </Typography>
                {!defaultFile && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                  >
                    <Icon name="close" color="#000" />
                  </span>
                )}
              </Box>
            )}
            <FormHelperText id={`${name}-helper`} error={true}>
              {error && error?.message}
            </FormHelperText>
          </Button>
        </Box>
      )}
    />
  );
};
