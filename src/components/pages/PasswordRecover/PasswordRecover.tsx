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
} from '@mui/material';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import * as yup from 'yup';
import { Icon } from '@/components/ui';
import { ButtonFeedback } from '@/components/entities/profile';
import s from './password.module.scss';
import { sendEmail } from '@/services/passwordRecover';
import { useMutation } from '@tanstack/react-query';
import useMobile from '@/hooks/UseMobile';
import { globalTheme } from '@/styles/theme';

const schema = yup
  .object({
    email: yup
      .string()
      .required('Обязательное поле')
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
        'Некорректный адрес электронной почты',
      ),
  })
  .required();

const PasswordRecover = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { mutate, data, isPending } = useMutation({
    mutationFn: (email: string) => {
      return sendEmail(email);
    },
  });

  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const mobile = useMobile();

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    mutate(data.email);
    handleOpen();
  };

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
              <InputLabel>Адрес электронной почты:</InputLabel>
              <TextField
                {...register('email')}
                placeholder="example@mail.ru"
                error={!!errors.email?.message}
                helperText={errors.email?.message || ''}
                sx={{ marginBottom: '25px' }}
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
                {isPending ? (
                  <CircularProgress color="secondary" size="27px" />
                ) : (
                  'Восстановить'
                )}
              </Button>
              <Typography variant="body1" className={s.bottomText}>
                Уже есть аккаунт?
                <Link href={'/signin'} className={s.link}>
                  Войти
                </Link>
              </Typography>
            </form>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default PasswordRecover;
