'use client';

import { FC, useMemo } from 'react';
import { Box, InputLabel, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Form } from '@/components/entities/profile';
import {
  InputArray,
  InputAutocomplete,
  InputCheckbox,
  InputDate,
  InputFile,
  InputImage,
  InputManyModal,
} from '@/components/ui/form';
import {
  InputAddress,
  InputGender,
  TextFieldCustom,
} from '@/components/ui/form/entities';
import { TradeUnionCardSimple } from '@/components/sections/Colleagues';

import { useFetchTUOwner, useFetchTUs } from '@/hooks/useTU';
import { useOptions } from '@/hooks/UseOptions';
import { useProtocols } from '@/hooks/UseFormColleagueProfile';

import { IFormColleagueProfile } from '@/models/Colleague';
import { ITradeUnion } from '@/models/TradeUnion';
import { IOption } from '@/models/Option';
import { OPTIONS_EDUCATION, OPTIONS_ROLES } from '@/constants/options';
import { InputLabelRequired } from '../ui';

const schema = yup
  .object({
    firstName: yup
      .string()
      .min(2, 'Минимальная длина имени - 2 символа')
      .required('Введите имя'),
    lastName: yup
      .string()
      .min(2, 'Минимальная длина фамилии - 2 символа')
      .required('Введите фамилию'),
    middleName: yup.string().nullable(),
    birthdate: yup
      .string()
      .required('Укажите дату рождения')
      .typeError('Укажите дату рождения'),
    gender: yup.string().required('Укажите пол'),
    education: yup.string().nullable(),
    avatar: yup
      .mixed()
      .nullable()
      .test('fileSize', 'Максимальный размер - 2 МБ.', (value) => {
        if (!value || typeof value === 'string') return true;
        //@ts-expect-error none
        return convertSizeToBites(value.size) <= 2 * 1048576;
      }),
    code: yup.string(),
    profession: yup.array(
      yup.string().min(2, 'Укажите профессию').required('Укажите профессию'),
    ),
    position: yup
      .array(
        yup.string().min(2, 'Укажите должность').required('Укажите должность'),
      )
      .required(),
    address: yup.object({
      postcode: yup.string().nullable(),
      region: yup.string().nullable(),
      municipal: yup.string().nullable(),
      locality: yup.string().nullable(),
      street: yup.string().nullable(),
      house: yup.string().nullable(),
      flat: yup.string().nullable(),
    }),
    phone: yup
      .string()
      .nullable()
      .transform((_, value) => (value?.length > 0 ? value : null))
      .matches(/^(\+7|7|8)+([0-9]){10}$/, 'Укажите корректный телефон'),
    phoneDop: yup
      .string()
      .nullable()
      .transform((_, value) => (value?.length > 0 ? value : null))
      .matches(/^(\+7|7|8)+([0-9]){10}$/, 'Укажите корректный телефон'),
    children: yup.array(
      yup.object({
        name: yup.string().min(2, 'Укажите имя').required('Укажите имя'),
        gender: yup.string().min(2, 'Укажите пол').required('Укажите пол'),
        birthdate: yup
          .string()
          .required('Укажите дату рождения')
          .typeError('Укажите дату рождения'),
      }),
    ),
    hobbies: yup
      .array(yup.number().required())
      .transform((value) => (value ? value : [])),
    isActive: yup.bool(),
    email: yup.string().email('Укажите почту').required('Укажите почту'),
    role: yup.string().required('Укажите роль'),
    reason: yup.string().nullable(),
    isCommittee: yup.boolean().nullable(),
    history: yup.array(
      yup.object({
        name: yup
          .string()
          .min(2, 'Укажите название')
          .required('Укажите название'),
        startDate: yup
          .string()
          .required('Укажите дату принятия')
          .typeError('Укажите дату принятия'),
        finishDate: yup
          .string()
          .required('Укажите дату выхода')
          .typeError('Укажите дату выхода'),
      }),
    ),
  })
  .required();

interface Props {
  onCancel: () => void;
  onSubmit: (data: IFormColleagueProfile) => Promise<void>;
  loading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues?: IFormColleagueProfile | any;
  errorsExtra?: { [key: string]: string } | null;
}

export const ColleagueForm: FC<Props> = ({
  onCancel,
  onSubmit,
  loading,
  defaultValues,
  errorsExtra,
}) => {
  const methods = useForm<IFormColleagueProfile>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const { data: hobbies } = useOptions({ name: 'hobbies' });

  const tuOwner = useFetchTUOwner();
  const tuList = useFetchTUs();

  const tradeunion: ITradeUnion | undefined = useMemo(
    () =>
      tuOwner && tuList?.data
        ? tuList.data.find((el) => el.guid == tuOwner?.guid)
        : undefined,
    [tuOwner, tuList],
  );

  const { data: protocols } = useProtocols();
  const optionsProtocol: IOption[] = useMemo(
    () => protocols?.map((el) => ({ id: el.guid, title: el.title })) || [],
    [protocols],
  );

  const isDisabled = useMemo(() => {
    if (defaultValues == null) return false;

    const isEmptyString = (value: string) =>
      value == null || value.trim().length == 0;

    if (isEmptyString(defaultValues.lastName)) return false;
    if (isEmptyString(defaultValues.firstName)) return false;
    if (isEmptyString(defaultValues.middleName)) return false;
    if (isEmptyString(defaultValues.birthdate)) return false;
    if (isEmptyString(defaultValues.gender)) return false;
    if (isEmptyString(defaultValues.education)) return false;
    if (defaultValues.position == null || defaultValues.position.length == 0)
      return false;
    if (isEmptyString(defaultValues.phone)) return false;
    if (isEmptyString(defaultValues.email)) return false;

    return true;
  }, [defaultValues]);

  return (
    <Form
      sx={{ pt: 3 }}
      title={
        isDisabled
          ? 'Учётная карточка члена профсоюза'
          : 'Добавление учётной карточки члена профсоюза'
      }
      loading={loading || isSubmitting}
      onCancel={onCancel}
      buttonsSubmit={defaultValues ? undefined : [{ text: 'Добавить' }]}
      onSubmit={handleSubmit(onSubmit)}
      methods={methods}
      defaultValues={defaultValues}
      errorsExtra={errorsExtra}
      checkTradeUnionMember={false}
    >
      {tradeunion && <TradeUnionCardSimple data={tradeunion} />}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <InputLabelRequired error={errors.lastName?.message}>
            Фамилия
          </InputLabelRequired>
          <TextField
            {...register('lastName')}
            placeholder="Иванов"
            error={!!errors.lastName?.message}
            helperText={errors.lastName?.message || ''}
            disabled={isDisabled}
          />

          <InputLabelRequired sx={{ mt: 3 }} error={errors.firstName?.message}>
            Имя
          </InputLabelRequired>
          <TextField
            {...register('firstName')}
            placeholder="Иван"
            error={!!errors.firstName?.message}
            helperText={errors.firstName?.message || ''}
            disabled={isDisabled}
          />
          <InputLabel sx={{ mt: 3 }}>Отчество</InputLabel>
          <TextField
            {...register('middleName')}
            placeholder="Иванович"
            error={!!errors.middleName?.message}
            helperText={errors.middleName?.message || ''}
            disabled={isDisabled}
          />
        </Box>

        <InputImage sx={{ mt: 4, minWidth: '250px' }} name="avatar" disabled />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <InputDate
          name="birthdate"
          label="Дата рождения"
          labelRequired
          disabled={isDisabled}
        />

        <InputGender
          name="gender"
          label="Пол"
          labelRequired
          disabled={isDisabled}
        />

        <InputAutocomplete
          sx={{ width: '80%' }}
          name="education"
          label="Образование"
          placeholder="Выберите из списка"
          options={OPTIONS_EDUCATION}
          disabled={isDisabled}
        />
      </Box>

      <InputArray
        sx={{ mt: 3 }}
        name="profession"
        label="Специальность по образованию"
        labelExtra="Дополнительная профессия"
        desc="Добавить специальность"
        render={(name, index, register, errors) => (
          <TextField
            {...register(`${name}.${index}`)}
            placeholder="Специальность по образованию"
            error={!!errors?.message}
            helperText={errors?.message || ''}
            disabled={isDisabled}
          />
        )}
        defaultValue=""
        disabled={isDisabled}
      />

      <InputArray
        sx={{ mt: 3 }}
        name="position"
        label="Должность"
        labelRequired
        labelExtra="Дополнительная должность"
        desc="Добавить должность"
        render={(name, index, register, errors) => (
          <TextField
            {...register(`${name}.${index}`)}
            placeholder="Должность"
            error={!!errors?.message}
            helperText={errors?.message || ''}
            disabled={isDisabled}
          />
        )}
        defaultValue=""
        preadd
        disabled={isDisabled}
      />

      <InputAddress
        sx={{ mt: 3 }}
        name="address"
        label="Адрес проживания"
        labelRequired
        errors={errors}
        disabled={isDisabled}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Box sx={{ flex: 1 }}>
          <InputLabel>Номер телефона</InputLabel>
          <TextFieldCustom
            register={register('phone')}
            placeholder="+79999999999"
            error={errors.phone?.message}
            maxL={11}
            allowPlus
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <InputLabel>Доп. номер</InputLabel>
          <TextFieldCustom
            register={register('phoneDop')}
            placeholder="+79999999999"
            error={errors.phone?.message}
            maxL={11}
            allowPlus
          />
        </Box>
      </Box>

      <InputArray
        sx={{ mt: 3 }}
        name="children"
        label="Дети"
        render={(name, index, register, errors) => (
          <Box sx={{ display: 'flex', flex: 1, gap: 2 }}>
            <TextField
              {...register(`${name}.${index}.name`)}
              placeholder="Имя"
              error={!!errors?.name?.message}
              helperText={errors?.name?.message || ''}
              disabled={isDisabled}
            />
            <InputGender
              name={`${name}.${index}.gender`}
              defaultValue="female"
              disabled={isDisabled}
            />
            <InputDate
              name={`${name}.${index}.birthdate`}
              disabled={isDisabled}
            />
          </Box>
        )}
        defaultValue={{}}
        disabled={isDisabled}
      />

      <InputLabelRequired sx={{ mt: 3 }} error={errors.email?.message}>
        Почта
      </InputLabelRequired>
      <TextField
        {...register('email')}
        placeholder="Почта"
        error={!!errors.email?.message}
        helperText={errors.email?.message || ''}
        disabled={isDisabled}
      />

      <InputLabel sx={{ mt: 3 }}>Уникальный номер</InputLabel>

      <TextField
        {...register('code')}
        placeholder="Уникальный номер"
        error={!!errors.code?.message}
        helperText={errors.code?.message || ''}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <InputAutocomplete
          sx={{ flex: 1 }}
          name="role"
          label="Роль"
          labelRequired
          placeholder="Выберите из списка"
          options={OPTIONS_ROLES}
        />
        <InputAutocomplete
          sx={{ flex: 1 }}
          name="reason"
          label="Основание"
          placeholder="Выберите из списка"
          options={optionsProtocol}
        />
        <InputDate
          sx={{ flex: 0.6 }}
          name={`invitedAt`}
          label="Дата вступления"
        />
      </Box>
      <InputCheckbox
        sx={{ justifyContent: 'center', margin: '12px 0' }}
        name="isCommittee"
        label={`Член профсоюзного комитета`}
      />

      <InputFile
        sx={{ mt: 2 }}
        name="reasonFile"
        label={
          <span>
            Прикрепить Документ, на основании которого присвоена роль <br />
            (документ в формате pdf размером до 2МБ)
          </span>
        }
        accept=".pdf"
        imageSelect="pdf"
        type="secondary"
      />

      <InputArray
        sx={{ mt: 3 }}
        name="history"
        label="История участия в профсоюзных организациях"
        render={(name, index, register, errors) => (
          <Box sx={{ display: 'flex', flex: 1, gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel>Cостоял в профсоюзе</InputLabel>
              <TextField
                {...register(`${name}.${index}.name`)}
                placeholder="Название профсоюзной организации"
                error={!!errors?.name?.message}
                helperText={errors?.name?.message || ''}
                disabled={isDisabled}
              />
            </Box>
            <InputDate
              sx={{ flex: 0.4 }}
              name={`${name}.${index}.startDate`}
              label="Дата принятия"
              disabled={isDisabled}
            />
            <InputDate
              sx={{ flex: 0.4 }}
              name={`${name}.${index}.finishDate`}
              label="Дата выхода"
              disabled={isDisabled}
            />
          </Box>
        )}
        defaultValue={{}}
        disabled={isDisabled}
      />

      <InputManyModal
        sx={{ mt: 3 }}
        name="hobbies"
        label="Увлечения"
        placeholder="Выберите из списка"
        options={hobbies?.data || []}
        disabled={isDisabled}
      />

      <InputCheckbox
        sx={{ justifyContent: 'center' }}
        name="isActive"
        link={'/politics.pdf'}
        label={`Я соглашаюсь с политикой обработки персональных данных `}
        disabled={isDisabled}
      />
    </Form>
  );
};
