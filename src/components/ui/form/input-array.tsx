/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, useEffect } from 'react';
import { Box, IconButton, InputLabel } from '@mui/material';
import {
  FieldValues,
  useFieldArray,
  useFormContext,
  UseFormRegister,
} from 'react-hook-form';

import { Icon } from '@/components/ui/Icon';
import { PropsWithSX } from '@/models/Props';
import { InputLabelRequired } from '../input';

interface Props {
  name: string;
  label?: string | React.ReactNode;
  labelRequired?: boolean;
  labelExtra?: string;

  render: (
    name: string,
    index: number,
    register: UseFormRegister<any>,
    errors?: FieldValues,
  ) => ReactNode;
  defaultValue: any;
  preadd?: boolean;
  desc?: string;
  disabled?: boolean;
}

export const InputArray: FC<PropsWithSX & Props> = ({
  sx,
  name,
  label,
  labelRequired,
  labelExtra,
  render,
  defaultValue,
  preadd,
  desc,
  disabled,
}) => {
  const { control, register, formState } = useFormContext();
  const { fields, append, remove } = useFieldArray<FieldValues>({
    control,
    name,
  });

  const errors: any = formState.errors;

  useEffect(() => {
    if (!preadd) return;
    if (fields.length != 0) return;
    append(defaultValue);
  }, [append]);

  return (
    <Box sx={sx}>
      <Box sx={{ display: 'flex' }}>
        {label &&
          (labelRequired ? (
            <InputLabelRequired error={errors[name] != null}>
              {label}
            </InputLabelRequired>
          ) : (
            <InputLabel>{label}</InputLabel>
          ))}
        {!disabled && (
          <>
            <InputLabel
              sx={{
                maxWidth: 'fit-content',
                pr: '12px',
                mb: 0,
                lineHeight: '32px',
              }}
            >
              {desc}
            </InputLabel>

            <IconButton
              variant="contained"
              onClick={() => append(defaultValue)}
            >
              <Icon name="plus" color="white" />
            </IconButton>
          </>
        )}
      </Box>
      {fields.length > 0 && (
        <>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {render(name, 0, register, errors[name] && errors[name][0])}
            {!disabled && preadd != true && (
              <IconButton
                sx={{ mt: 1.2 }}
                variant="contained-gray"
                onClick={() => remove(0)}
              >
                <Icon name="minus" color="white" />
              </IconButton>
            )}
          </Box>
        </>
      )}

      {fields.length > 1 && (
        <>
          {labelExtra && (
            <Box sx={{ display: 'flex', mt: 3 }}>
              <InputLabel>{labelExtra}</InputLabel>

              {!disabled && (
                <IconButton variant="contained-gray" onClick={() => remove(1)}>
                  <Icon name="minus" color="white" />
                </IconButton>
              )}
            </Box>
          )}
          {fields.map(({ id }, index) =>
            index == 0 ? null : (
              <Box
                key={id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  mt: !labelExtra || index > 1 ? 2 : 0,
                }}
              >
                {render(
                  name,
                  index,
                  register,
                  errors[name] && errors[name][index],
                )}
                {!disabled && (!labelExtra || index > 1) && (
                  <IconButton
                    sx={{ mt: 1.2 }}
                    variant="contained-gray"
                    onClick={() => remove(index)}
                  >
                    <Icon name="minus" color="white" />
                  </IconButton>
                )}
              </Box>
            ),
          )}
        </>
      )}
    </Box>
  );
};
