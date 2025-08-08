'use client';

import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  InputLabel,
  IconButton,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import * as yup from 'yup';
import { Icon } from '@/components/ui';
import { ButtonFeedback } from '@/components/entities/profile';
import s from './password.module.scss';
import { sendPassword, sendToken } from '@/services/passwordRecover';
import { useMutation } from '@tanstack/react-query';
import useMobile from '@/hooks/UseMobile';
import { globalTheme } from '@/styles/theme';
import { usePathname } from 'next/navigation';

const schema = yup
  .object({
    password: yup
      .string()
      .required('Обязательное поле')
      .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
      .matches(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
      .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
      .min(8, 'Пароль должен содержать как минимум 8 символов'),
    passwordRepeat: yup
      .string()
      .required('Обязательное поле')
      .when('password', (password, schema) => {
        return schema.test({
          test: (passwordRepeat) => String(password) === passwordRepeat,
          message: 'Пароли не совпадают',
        });
      }),
  })
  .required();

const PasswordConfirm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { mutate: mutateToken, data: newData } = useMutation({
    mutationFn: (token: string) => {
      return sendToken(token);
    },
  });

  const {
    mutate: mutatePass,
    isPending: isPendingPass,
    data,
  } = useMutation({
    mutationFn: (data: { token: string; pass: string }) => {
      return sendPassword(data.token, data.pass);
    },
  });
  const token = usePathname().split('/')[3];
  const [open, setOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const mobile = useMobile();

  const onSubmit: SubmitHandler<{ password: string }> = async (data) => {
    mutatePass({ token: newData?.data.token, pass: data.password });
    handleOpen();
  };

  useEffect(() => {
    mutateToken(token);
  }, []);

  return (
    <Box className={s.container}>
      <Paper className={s.paper}>
        {open && !!data?.data.description ? (
          <>
            <Typography variant="h3" textAlign={'center'} marginTop={'24px'}>
              {data?.data.description}
            </Typography>
            <Link href="/" style={{ width: '100%' }}>
              <Button
                variant="contained"
                sx={{
                  padding: '15px 100px',
                  fontSize: '20px',
                  lineHeight: '27px',
                  minWidth: mobile ? '106px' : '338px',
                  marginTop: '24px',
                  width: '100%',
                  '&.Mui-disabled': {
                    backgroundColor: `${globalTheme.palette.primary.main} !important`,
                    color: 'white !important',
                  },
                }}
              >
                {mobile ? 'Главная' : 'Перейти на стартовую страницу'}
              </Button>
            </Link>
            <Link href="/signin" style={{ width: '100%' }}>
              <Button
                variant="contained"
                sx={{
                  padding: '15px 100px',
                  fontSize: '20px',
                  lineHeight: '27px',
                  minWidth: mobile ? '106px' : '338px',
                  marginTop: '24px',
                  width: '100%',
                  '&.Mui-disabled': {
                    backgroundColor: `${globalTheme.palette.primary.main} !important`,
                    color: 'white !important',
                  },
                }}
              >
                {mobile ? 'Войти' : 'Войти в личный кабинет'}
              </Button>
            </Link>
          </>
        ) : (
          <>
            <ButtonFeedback className={s.help} withEmail />
            <Link href={'/'} className={s.cross}>
              <IconButton>
                <Icon name="close" />
              </IconButton>
            </Link>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography className={s.title}>Восстановление пароля</Typography>
              <InputLabel>Придумайте новый пароль</InputLabel>
              <TextField
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password?.message}
                sx={{ marginBottom: '25px' }}
                helperText={errors.password?.message || ''}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowPassword((prevShow: boolean) => !prevShow)
                          }
                          edge="end"
                        >
                          {!showPassword ? (
                            <Icon name="eye-on" color="gray" />
                          ) : (
                            <Icon name="eye-off" color="gray" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <InputLabel>Повторите новый пароль</InputLabel>
              <TextField
                {...register('passwordRepeat')}
                type={showPasswordRepeat ? 'text' : 'password'}
                error={!!errors.passwordRepeat?.message}
                sx={{ marginBottom: '25px' }}
                helperText={errors.passwordRepeat?.message || ''}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowPasswordRepeat(
                              (prevShow: boolean) => !prevShow,
                            )
                          }
                          edge="end"
                        >
                          {!showPasswordRepeat ? (
                            <Icon name="eye-on" color="gray" />
                          ) : (
                            <Icon name="eye-off" color="gray" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  padding: '15px 100px',
                  margin: '12px auto 0',
                  fontSize: '20px',
                  lineHeight: '27px',
                  width: '260px',
                }}
              >
                {isPendingPass ? (
                  <CircularProgress color="secondary" size="27px" />
                ) : (
                  'Сохранить'
                )}
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default PasswordConfirm;
