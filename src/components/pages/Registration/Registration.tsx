'use client';

import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  InputLabel,
  IconButton,
  InputAdornment,
  CircularProgress,
  Checkbox,
  FormControl,
  FormHelperText,
  Tabs,
  Tab,
} from '@mui/material';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useMobile from '@/hooks/UseMobile';
import { getBackendUrl } from '@/constants/url';
import { Icon } from '@/components/ui';
import { type IReg } from '@/models/Reg';
import s from './reg.module.scss';
import { ButtonFeedback } from '@/components/entities/profile';
import { globalTheme } from '@/styles/theme';

const Registration = () => {
  const [tabs, setTabs] = useState<number>(0);
  const schema = yup
    .object({
      isTradeunion: yup.boolean(),
      email: yup
        .string()
        .required('Обязательное поле')
        .matches(
          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
          'Некорректный адрес электронной почты',
        ),
      password: yup
        .string()
        .required('Введите пароль')
        .matches(
          /^[A-Za-z0-9]+$/,
          'Пароль должен содержать только латинские буквы и цифры',
        )
        .matches(
          /[A-Z]/,
          'Пароль должен содержать хотя бы одну заглавную букву',
        )
        .matches(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
        .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
        .min(8, 'Пароль должен содержать как минимум 8 символов'),
      passwordRepeat: yup
        .string()
        .oneOf([yup.ref('password'), ''], 'Пароли должны совпадать')
        .required('Введите пароль'),
      personalData: yup.boolean().isTrue('Необходимо согласие').required(),
    })
    .required();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IReg>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    context: { tabs },
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    passwordRepeat: false,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const mobile = useMobile();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabs(newValue);
  };
  const handleOpen = () => setOpen(true);

  const {
    mutate,
    data: resData,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: (data: IReg) => {
      return axios.post(`${getBackendUrl}/api/registration`, data);
    },
    onError: (e) => {
      //@ts-expect-error none
      setError(e.response.data.description);
    },
  });

  const onSubmit: SubmitHandler<IReg> = async (data) => {
    mutate({ ...data, isTradeunion: !!tabs });
    handleOpen();
  };

  return (
    <Box className={s.container}>
      <Paper className={s.paper}>
        <ButtonFeedback className={s.help} withEmail />
        <Link href={'/'} className={s.cross}>
          <IconButton>
            <Icon name="close" />
          </IconButton>
        </Link>

        {open && resData?.data.description ? (
          <>
            <Typography variant="h3" textAlign={'center'} marginTop={'24px'}>
              {
                'Мы отправили на Ваш адрес электронной почты ссылку для подтверждения регистрации!'
              }
            </Typography>
            {/* {<Link href="/" style={{ width: '100%' }}>
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
            </Link>} */}
          </>
        ) : error ? (
          <>
            <Typography variant="h3" textAlign={'center'} marginTop={'24px'}>
              {error}
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography className={s.title}>Регистрация</Typography>
            <Tabs value={tabs} onChange={handleChange} sx={{ mb: 1.2 }}>
              <Tab value={0} label={'Частное лицо'} />
              <Tab value={1} label={'Юридическое лицо'} />
            </Tabs>
            <InputLabel sx={{ marginTop: '20px' }}>
              Адрес электронной почты:
            </InputLabel>
            <TextField
              sx={{ marginBottom: '20px' }}
              {...register('email')}
              placeholder="example@mail.ru"
              error={!!errors.email?.message}
              helperText={errors.email?.message || ''}
            />
            <InputLabel>Придумайте пароль</InputLabel>
            <TextField
              {...register('password')}
              type={showPassword.password ? 'text' : 'password'}
              error={!!errors.password?.message}
              helperText={errors.password?.message || ''}
              sx={{ marginBottom: !!errors.password?.message ? 4.4 : 2 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            password: !prev.password,
                          }))
                        }
                        edge="end"
                      >
                        {!showPassword.password ? (
                          <Icon name="eye-on" color="gray" />
                        ) : (
                          <Icon name="eye-off" color="gray" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
                formHelperText: { style: { whiteSpace: 'wrap' } },
              }}
            />
            <InputLabel>Повторите пароль</InputLabel>
            <TextField
              sx={{ marginBottom: '20px' }}
              {...register('passwordRepeat')}
              type={showPassword.passwordRepeat ? 'text' : 'password'}
              error={!!errors.passwordRepeat?.message}
              helperText={errors.passwordRepeat?.message || ''}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            passwordRepeat: !prev.passwordRepeat,
                          }))
                        }
                        edge="end"
                      >
                        {!showPassword.passwordRepeat ? (
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
            <Box alignSelf={'start'}>
              <FormControl error={!!errors.personalData?.message}>
                <Box display={'flex'} alignItems={'center'}>
                  <Checkbox {...register('personalData')} />
                  <Typography
                    component={'span'}
                    variant="body1"
                    fontWeight={600}
                  >
                    <a href={'/politics.pdf'} target="_blank">
                      Я соглашаюсь с политикой обработки персональных данных
                    </a>
                  </Typography>
                </Box>
                <FormHelperText>
                  {errors.personalData?.message || ''}
                </FormHelperText>
              </FormControl>
            </Box>
            {!!errors.personalData?.message}
            <Button
              type="submit"
              variant="contained"
              sx={{
                padding: '15px 100px',
                fontSize: '20px',
                lineHeight: '27px',
                marginTop: '24px',
                width: '320px',
                '&.Mui-disabled': {
                  backgroundColor: `${globalTheme.palette.primary.main} !important`,
                  color: 'white !important',
                },
              }}
            >
              {isPending && !isSuccess ? (
                <CircularProgress color="secondary" size="27px" />
              ) : (
                'Регистрация'
              )}
            </Button>
            <Typography variant="body1" className={s.bottomText}>
              Уже есть аккаунт?
              <Link href={'/signin'} className={s.link}>
                Войти
              </Link>
            </Typography>
            <Typography variant="body1" className={s.bottomText}>
              Регистрируясь в сервисе, Вы соглашаетесь с
              <span>
                {' '}
                <a href={'/politics.pdf'} target="_blank">
                  политикой обработки персональных данных,
                </a>{' '}
              </span>
              и на получение информационных сообщений от группы компаний Мой
              Союз
            </Typography>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default Registration;
