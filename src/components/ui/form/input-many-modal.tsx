'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  FormHelperText,
  InputLabel,
  Popover,
} from '@mui/material';

import { PropsWithSX } from '@/models/Props';
import { IOption, IOptionValue } from '@/models/Option';
import { InputLabelRequired } from '../input';

interface CardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const Card: FC<CardProps> = ({ label, selected, onClick }) => {
  return (
    <Button sx={{ gap: 1, backgroundColor: 'white' }} onClick={onClick}>
      <Box
        sx={{
          backgroundColor: selected ? 'primary.main' : '',
          border: !selected ? '2px solid transparent' : '',
          borderColor: !selected ? 'secondary.main' : '',
          width: 16,
          height: 16,
          borderRadius: '100%',
        }}
      />{' '}
      {label}
    </Button>
  );
};

interface Props {
  name: string;
  label?: string | React.ReactNode;
  labelRequired?: boolean;
  placeholder?: string;
  options?: IOption[];
  disabled?: boolean;
}

export const InputManyModal: FC<PropsWithSX & Props> = ({
  sx,
  name,
  label,
  labelRequired,
  placeholder,
  options = [],
  disabled,
}) => {
  const refButton = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState<number>(500);

  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const [selected, setSelected] = useState<IOptionValue[]>([]);

  useEffect(() => {
    const target = refButton.current;
    if (target == null) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(target);
    return () => resizeObserver.unobserve(target);
  }, [refButton.current]);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    const value = getValues(name);
    if (value)
      setSelected(
        options
          .filter((el: IOption) => value.includes(el.id))
          .map((el: IOption) => el.id),
      );
    else setSelected([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCard = (value: IOptionValue) => {
    if (selected.includes(value))
      setSelected(selected.filter((el) => el != value));
    else setSelected([...selected, value]);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            ...(sx || {}),
          }}
          ref={refButton}
        >
          {label &&
            (labelRequired ? (
              <InputLabelRequired error={errors[name] != null}>
                {label}
              </InputLabelRequired>
            ) : (
              <InputLabel>{label}</InputLabel>
            ))}
          <Button
            name={name}
            aria-describedby={name}
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 60,
              gap: 1,
              flex: 1,
              mb: 2.5,
              backgroundColor: 'rgb(241, 244, 249)',
              borderColor: error ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)',
              color: 'rgb(166, 166, 166)',
              fontSize: 17,
              alignItems: 'start',
              textAlign: 'left',

              '&:hover': {
                borderColor: 'rgba(0, 0, 0, 0.87)',
              },
            }}
            variant="outlined"
            onClick={handleOpen}
            disabled={disabled}
          >
            {value && value.length > 0 ? (
              <>
                {options
                  .filter((el) => value.includes(el.id))
                  .map((el) => el.title)
                  .join(', ')}
              </>
            ) : (
              <>{placeholder}</>
            )}
            <FormHelperText id={`${name}-helper`} error={true}>
              {error && error?.message}
            </FormHelperText>
          </Button>

          <Popover
            id={name}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            disableScrollLock
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2,
                backgroundColor: 'secondary.main',
                width: width - 45,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  overflowY: 'auto',
                  maxHeight: 500,
                }}
              >
                {options.map((el) => (
                  <Card
                    key={el.id}
                    label={el.title}
                    selected={selected.includes(el.id)}
                    onClick={() => handleCard(el.id)}
                  />
                ))}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  height: 40,
                }}
              >
                <Button variant="outlined" onClick={handleClose}>
                  Отмена
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    onChange(selected);
                    handleClose();
                  }}
                >
                  Сохранить
                </Button>
              </Box>
            </Box>
          </Popover>
        </Box>
      )}
    />
  );
};
