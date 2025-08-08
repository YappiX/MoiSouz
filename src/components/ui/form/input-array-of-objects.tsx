/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, useEffect } from 'react';
import { Box, IconButton, InputLabel } from '@mui/material';
import {
  FieldValues,
  useFieldArray,
  useFormContext,
  UseFormRegister,
  useWatch,
} from 'react-hook-form';
import { Icon } from '@/components/ui/Icon';
import { PropsWithSX } from '@/models/Props';
import { InputLabelRequired } from '../input';

interface Props {
  name: string;
  label?: string;
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
  position?: boolean;
  onArrayChange?: (values: any[]) => void;
}

export const InputArrayOfObjects: FC<PropsWithSX & Props> = ({
  sx,
  name,
  label,
  labelRequired,
  labelExtra,
  render,
  defaultValue,
  desc,
  position,
  onArrayChange,
}) => {
  const { control, register, formState } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const arrayValues = useWatch({
    control,
    name,
    defaultValue: fields.map((field) => field),
  });

  const errors: any = formState.errors;

  useEffect(() => {
    if (onArrayChange) {
      onArrayChange(arrayValues);
    }
  }, [arrayValues, onArrayChange]);

  useEffect(() => {
    if (fields.length != 0) return;
    if (fields.length == 0) append(defaultValue);
  }, []);

  return (
    <Box sx={sx}>
      {!!fields.length && (
        <>
          {labelExtra && (
            <Box sx={{ display: 'flex', mt: 3 }}>
              {labelRequired ? (
                <InputLabelRequired error={errors[name] != null}>
                  {labelExtra}
                </InputLabelRequired>
              ) : (
                <InputLabel>{labelExtra}</InputLabel>
              )}
              <IconButton variant="contained-gray" onClick={() => remove(1)}>
                <Icon name="minus" color="white" />
              </IconButton>
            </Box>
          )}

          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{
                display: 'flex',
                gap: 2,
                mt: !labelExtra || index > 1 ? 2 : 0,
                position: 'relative',
              }}
            >
              {render(
                name,
                index,
                register,
                errors[name] && errors[name][index],
              )}
              {(!labelExtra || index > 1) && (
                <IconButton
                  sx={{
                    mt: 1.2,
                    position: 'absolute',
                    top: !position ? '-16px' : '0px',
                    right: !position ? '0px' : '-40px',
                  }}
                  variant="contained-gray"
                  onClick={() => remove(index)}
                >
                  <Icon name="minus" color="white" />
                </IconButton>
              )}
            </Box>
          ))}
        </>
      )}
      <Box
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}
      >
        {label &&
          (labelRequired ? (
            <InputLabelRequired error={errors[name] != null}>
              {label}
            </InputLabelRequired>
          ) : (
            <InputLabel>{label}</InputLabel>
          ))}
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
        <IconButton variant="contained" onClick={() => append(defaultValue)}>
          <Icon name="plus" color="white" />
        </IconButton>
      </Box>
    </Box>
  );
};
