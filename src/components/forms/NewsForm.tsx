'use client';

import { FC, useMemo } from 'react';
import { Box, Button, InputLabel, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';

import { Form } from '@/components/entities/profile';
import {
  InputDate,
  InputImage,
  InputHTML,
  InputSwitch,
  InputAutocomplete,
} from '@/components/ui/form';

import { useFetchTUOwner } from '@/hooks/useTU';

import { convertSizeToBites } from '@/utils/convertStringToB';

import { IFormNews } from '@/models/News';
import { IOption } from '@/models/Option';
import { ITradeUnion } from '@/models/TradeUnion';
import theme from '@/styles/theme';

const schema = yup
  .object({
    title: yup.string().required('Введите заголовок'),
    preview: yup.string().required('Введите превью'),
    text: yup.string().required('Настройте контент'),
    image: yup
      .mixed()
      .required('Укажите изображение')
      .test('fileSize', 'Максимальный размер - 2 МБ.', (value) => {
        if (!value || typeof value === 'string') return true;
        //@ts-expect-error none
        return convertSizeToBites(value.size) <= 2 * 1048576;
      }),
    tradeunions: yup
      .array()
      .of(yup.string().required())
      .notRequired()
      .nullable(),
    date: yup.string().required('Укажите дату').typeError('Укажите дату'),
    status: yup.string().required('Укажите статус'),
    isActive: yup.bool().notRequired(),
    isMain: yup.bool().notRequired(),
  })
  .required();

interface Props {
  onCancel: () => void;
  onSubmit: (data: IFormNews) => Promise<void>;
  loading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues?: IFormNews | any;
  errorsExtra?: { [key: string]: string } | null;
}

export const NewsForm: FC<Props> = ({
  onCancel,
  onSubmit,
  loading,
  defaultValues,
  errorsExtra,
}) => {
  const methods = useForm<IFormNews>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          tradeunions: defaultValues.tradeunions
            ? defaultValues.tradeunions.map((el: ITradeUnion) => el.guid)
            : [],
        }
      : {
          date: dayjs().format('DD.MM.YYYY'),
        },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    //getValues,
    setValue,
  } = methods;

  const owner = useFetchTUOwner();

  const OPTIONS_TU_CHILDREN = useMemo(() => {
    const result: IOption[] = [];

    owner?.children
      ?.map((el) => ({
        id: el.guid,
        title: el.title,
      }))
      ?.forEach((el) => result.push(el));
    //if (owner) result.push({ id: owner.guid || '', title: owner.title });
    return result;
  }, [owner, owner]);

  const handleSelectAllTU = () => {
    setValue(
      'tradeunions',
      OPTIONS_TU_CHILDREN.map((el) => el.id as string),
    );
  };

  const handleClickPublished = () => {
    setValue('status', 'published');
  };

  const handleClickDraft = () => {
    setValue('status', 'draft');
  };

  return (
    <Form
      sx={{ pt: 3 }}
      title={
        defaultValues
          ? 'Публикация новости' /* edit */
          : 'Публикация новости' /* add */
      }
      loading={loading || isSubmitting}
      onCancel={onCancel}
      onSubmit={handleSubmit(onSubmit)}
      buttonsSubmit={[
        { text: 'В черновик', variant: 'outlined', onClick: handleClickDraft },
        { text: 'Опубликовать', onClick: handleClickPublished },
      ]}
      methods={methods}
      defaultValues={defaultValues}
      errorsExtra={errorsExtra}
      checkTradeUnionMember={false}
    >
      <InputLabel>
        Заголовок{' '}
        <span
          style={
            !!errors.title?.message
              ? { color: theme.palette.red.main }
              : { color: theme.palette.primary.main }
          }
        >
          *
        </span>
      </InputLabel>
      <TextField
        {...register('title')}
        placeholder="Заголовок"
        error={!!errors.title?.message}
        helperText={errors.title?.message || ''}
        multiline
      />

      <InputLabel sx={{ mt: 3 }}>
        Анонс (для показа на странице со списком новостей){' '}
        <span
          style={
            !!errors.preview?.message
              ? { color: theme.palette.red.main }
              : { color: theme.palette.primary.main }
          }
        >
          *
        </span>
      </InputLabel>
      <TextField
        {...register('preview')}
        placeholder="Краткий анонс (2000 символов)"
        error={!!errors.preview?.message}
        helperText={errors.preview?.message || ''}
        multiline
        slotProps={{
          htmlInput: {
            maxLength: 2000,
          },
        }}
      />

      <InputAutocomplete
        sx={{ mt: 3 }}
        name="tradeunions"
        label="Получатель новости"
        placeholder={
          OPTIONS_TU_CHILDREN.length == 0
            ? 'У вас нет нижестоящих организаций'
            : 'Выберите из списка'
        }
        options={OPTIONS_TU_CHILDREN}
        disabled={OPTIONS_TU_CHILDREN.length == 0}
        multiple
      />

      <Button onClick={handleSelectAllTU}>Выбрать всех получателей</Button>

      <InputHTML
        sx={{ mt: 3 }}
        name="text"
        label="Текст новости"
        labelRequired
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 3 }}>
        <InputDate
          sx={{ maxWidth: '190px' }}
          name="date"
          label="Дата публикации"
          isFutureAccess
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 2,
          }}
        >
          <InputLabel>Активность</InputLabel>
          <InputSwitch name="isActive" />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 2,
          }}
        >
          <InputLabel>Закрепить</InputLabel>
          <InputSwitch name="isMain" />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <InputImage
            sx={{
              height: '70px',
              maxHeight: '70px',
              width: '100px',
              maxWidth: '100px',
              mt: 'auto',
              mx: 2,
              flexDirection: 'column-reverse',
            }}
            name="image"
            icon="plus"
            errorLabel={false}
          />
          <InputLabel
            sx={{
              position: 'relative',
              display: 'flex',
              textAlign: 'center',
              fontSize: 14,
              width: '100%',
              maxWidth: 140,
              height: 25,
              m: 0,
              color: errors.image ? 'red !important' : undefined,
              overflow: 'unset !important',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                whiteSpace: 'break-spaces',
                lineHeight: 1.2,
                marginTop: 5,
              }}
            >
              {errors.image ? errors.image.message : 'Превью (jpg, png)'}
            </div>
          </InputLabel>
        </Box>
      </Box>
    </Form>
  );
};
