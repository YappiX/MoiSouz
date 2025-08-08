'use client';

import React, { FC, useEffect, useState } from 'react';
import {
  Dialog,
  IconButton,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Icon } from '@/components/ui';
import { Form } from '../form';

import { saveFormFeedback } from '@/hooks/UseFeedback';

import { IFormFeedback } from '@/models/Forms';

const schemaDefault = yup
  .object({
    title: yup.string().required('Укажите вопрос'),
    message: yup.string(),
  })
  .required();

const schemaWithEmail = yup
  .object({
    title: yup.string().required('Укажите вопрос'),
    message: yup.string(),
    email: yup.string().email('Укажите почту').required('Укажите почту'),
  })
  .required();

interface IDialogProps {
  open: boolean;
  onClose?: () => void;
  withEmail?: boolean;
}

export const FeedbackDialog: FC<IDialogProps> = ({
  open,
  onClose,
  withEmail,
}) => {
  const [reseted, setReseted] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const methods = useForm<IFormFeedback>({
    mode: 'onChange',
    resolver: yupResolver(withEmail ? schemaWithEmail : schemaDefault),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  // reset form on open
  useEffect(() => {
    if (open == false) {
      if (reseted == true) setReseted(false);
      return;
    }

    if (open == true && reseted == false) {
      methods.reset();
      setSuccessMessage(null);
      setSuccess(false);
      setReseted(true);
    }
  }, [methods, open]);

  // send
  const onSubmit = async (data: IFormFeedback) => {
    const response = await saveFormFeedback(data);

    // success
    if (onClose) onClose();
    setSuccess(true);
    setSuccessMessage(
      response.data?.description ||
        'Спасибо за обращение!\r\nВаш вопрос принят.',
    );
  };

  return (
    <>
      <Dialog
        sx={{ width: '100%' }}
        open={open}
        onClose={isSubmitting ? undefined : onClose}
        PaperProps={{
          sx: {
            maxWidth: '630px',
            width: '100%',
          },
        }}
      >
        <IconButton
          sx={{ position: 'absolute', right: 10, top: 10 }}
          onClick={isSubmitting ? undefined : onClose}
        >
          <Icon name="close" />
        </IconButton>
        <Form
          loading={isSubmitting}
          buttonsCancel={[]}
          buttonsSubmit={[{ text: 'Отправить' }]}
          onSubmit={handleSubmit(onSubmit)}
          methods={methods}
          checkTradeUnionMember={false}
        >
          <Typography variant="h3" marginBottom={2} textAlign={'center'}>
            Поддержка
          </Typography>
          <InputLabel sx={{ mt: 3 }}>Ваш вопрос</InputLabel>

          <TextField
            {...register('title')}
            placeholder="Опишите проблему"
            error={!!errors.title?.message}
            helperText={errors.title?.message || ''}
          />

          <InputLabel sx={{ mt: 3 }}>Комментарий</InputLabel>
          <TextField
            {...register('message')}
            sx={{ mb: 3 }}
            placeholder="Опишите проблему"
            error={!!errors.message?.message}
            helperText={errors.message?.message || ''}
            multiline
            rows={4}
          />

          {withEmail && (
            <>
              <InputLabel>Почта</InputLabel>
              <TextField
                {...register('email')}
                placeholder="Почта"
                error={!!errors.email?.message}
                helperText={errors.email?.message || ''}
              />
            </>
          )}
        </Form>
      </Dialog>

      <Dialog
        open={success}
        onClose={() => setSuccess(false)}
        PaperProps={{
          sx: {
            p: 4,
            gap: 2,
          },
        }}
      >
        <Typography variant="h3" textAlign="center" whiteSpace="pre-line">
          {successMessage}
        </Typography>
      </Dialog>
    </>
  );
};
