/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import s from './forms.module.scss';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ITradeUnion, TtyTypes } from '@/models/TradeUnion';
import { useRouter } from 'next/navigation';
import { InputImage } from '../ui/form/input-image';
import { InputCheckbox, InputDate } from '../ui/form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ruRU } from '@mui/x-date-pickers/locales';
import { registration } from '@/hooks/UseFormTUReg';
import { getAddress } from '@/services/getAddress';
import { getApplications } from '@/services/getApplications';
import {
  ValidateKsOrRs,
  ValidateOktmo,
  validateBik,
  validateInn,
  validateKpp,
  validateOgrn,
} from '@/utils/validateDocs';
import { InputFile } from '../ui/form/input-file';
import { TextFieldCustom } from '../ui/form/entities/input-textfield';
import { saveFormTULogo, saveFormTUScan } from '@/services/postLogoandFile';
import { getMyTU } from '@/services/getMyTU';
import { convertSizeToBites } from '@/utils/convertStringToB';
import { saveFormTUUsers } from '@/hooks/useTU';
import { useFetchProfile } from '@/hooks/useFetchProfile';
import theme from '@/styles/theme';
import { getParents } from '@/services/getParents';

const schema = yup
  .object({
    parent: yup.string().nullable(),
    tuType: yup
      .mixed<TtyTypes>()
      .oneOf(
        [
          'Первичная профсоюзная организация',
          'Первичная профсоюзная организация без ИНН',
          'Профсоюзная организация',
        ],
        'Выберите корректный тип профсоюза',
      )
      .required('Обязательное поле'),
    email: yup
      .string()
      .required('Обязательное поле')
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
        'Некорректный адрес электронной почты',
      ),
    phone: yup
      .string()
      .required('Обязательное поле')
      .matches(
        /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
        'Введите корректный номер (+7XXXXXXXXXX)',
      )
      .test('phone-length', 'Номер должен содержать 11 цифр', (value) => {
        const cleaned = value?.replace(/[^\d]/g, '');
        return cleaned?.length === 11;
      }),
    title: yup.string().required('Обязательное поле'),
    creationDate: yup.string().required('Обязательное поле'),
    ogrn: yup
      .string()
      .required('Обязательное поле')
      .test(
        'ogrn',
        (params) => validateOgrn(params.value),
        (value) => !validateOgrn(String(value)),
      ),
    inn: yup.string().when('tuType', {
      is: (tuType: TtyTypes) =>
        tuType === 'Первичная профсоюзная организация без ИНН',
      then: (schema) => schema.notRequired(), // Необязательно
      otherwise: (schema) =>
        schema.required('Обязательное поле').test(
          'inn-validation',
          'Некорректный ИНН',
          (value) => !validateInn(String(value)), // Валидация ИНН
        ),
    }),
    kpp: yup
      .string()
      .required('Обязательное поле')
      .test(
        'kpp',
        (params) => validateKpp(params.value),
        (value) => !validateKpp(String(value)),
      ),
    registrationDate: yup.string().required('Обязательное поле'),
    okato: yup
      .string()
      .required('Обязательное поле')
      .max(11, 'ОКАТО состоит макс. из 11 цифр'),
    oktmo: yup
      .string()
      .required('Обязательное поле')
      .test(
        'oktmo',
        (params) => ValidateOktmo(params.value),
        (value) => !ValidateOktmo(String(value)),
      ),
    titleForDocs: yup.string().required('Обязательное поле'),
    address: yup.object({
      postcode: yup
        .string()
        .required('Укажите индекс')
        .length(6, 'Почтовый индекс должен содержать 6 символов'),
      region: yup.string().required('Укажите регион'),
      area: yup.string(),
      city: yup.string().required('Укажите населенный пункт'),
      street: yup.string().required('Укажите улицу'),
      house: yup.string().required('Укажите дом/здание'),
      flat: yup.string(),
    }),
    chairmanEmail: yup
      .string()
      .required('Обязательное поле')
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
        'Некорректный адрес электронной почты',
      ),
    chairmanPhone: yup
      .string()
      .required('Обязательное поле')
      .matches(
        /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
        'Введите корректный номер (+7XXXXXXXXXX)',
      ),
    bank: yup.object({
      bank: yup.string().required('Обязательное поле'),
      rs: yup
        .string()
        .required('Обязательное поле')
        .test(
          'rs',
          (params) => ValidateKsOrRs(params.value),
          (value) => !ValidateKsOrRs(String(value)),
        ),
      bik: yup
        .string()
        .required('Обязательное поле')
        .test(
          'bik',
          (params) => validateBik(params.value),
          (value) => !validateBik(String(value)),
        ),
      ks: yup
        .string()
        .required('Обязательное поле')
        .test(
          'ks',
          (params) => ValidateKsOrRs(params.value),
          (value) => !ValidateKsOrRs(String(value)),
        ),
    }),
    chairman: yup.object({
      firstName: yup.string().required('Обязательное поле'),
      lastName: yup.string().required('Обязательное поле'),
      middleName: yup.string().nullable(),
    }),
    employer: yup
      .object({
        title: yup.string().required('Обязательное поле'),
        firstName: yup.string().required('Обязательное поле'),
        lastName: yup.string().required('Обязательное поле'),
        middleName: yup.string().nullable(),
        inn: yup
          .string()
          .required('Обязательное поле')
          .test(
            'inn',
            (params) => validateInn(params.value),
            (value) => !validateInn(String(value)),
          ),
      })
      .when('tuType', {
        is: (tuType: string) => tuType != 'Профсоюзная организация',
        otherwise: (schema) =>
          schema.shape({
            title: yup.string().nullable(),
            firstName: yup.string().nullable(),
            lastName: yup.string().nullable(),
            middleName: yup.string().nullable(),
            inn: yup.string().nullable(),
          }),
      }),
    percents: yup
      .number()
      .transform((value) => (Number.isNaN(value) ? 0 : value))
      .min(0, 'Взнос должен быть больше 0')
      .max(100, 'Взнос должен быть не больше 100')
      .required('Обязательное поле'),
    isActive: yup
      .bool()
      .oneOf([true], 'Необходимо принять согласие')
      .required('Необходимо принять согласие'),
    logo: yup
      .mixed()
      .nullable()
      .test('fileSize', 'Максимальный размер - 2 МБ', (value) => {
        if (!value || typeof value === 'string') return true;
        //@ts-expect-error none
        return convertSizeToBites(value.size) <= 2 * 1048576;
      }),
    scan: yup
      .mixed()
      .required('Обязательное поле')
      .test('fileSize', 'Максимальный размер - 2 МБ', (value) => {
        if (!value || typeof value === 'string') return true;
        //@ts-expect-error none
        return convertSizeToBites(value.size) <= 2 * 1048576;
      }),
  })
  .required();

const TradeUnionRegistrationForm = () => {
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue: setFormValue,
    setError,
    getValues,
    control,
  } = methods;

  const router = useRouter();

  const [addressString, setAddressString] = useState<string>('');
  const [addressOptions, setAddressOptions] = useState<any[]>([]);
  const [value, setValue] = useState<any | null>(null);
  const [valueAuto, setValueAuto] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string | null>(null);
  const [percents, setPercents] = useState<number>();
  const [isMyName, setIsMyName] = useState<boolean>(false);
  const [chosenUnion, setChoosenUnion] = useState<ITradeUnion>();

  const { tuType } = useWatch({ control });

  const chosenUnionRequired = useMemo(() => {
    switch (tuType) {
      case 'Первичная профсоюзная организация без ИНН':
        return true;
    }
    return false;
  }, [tuType]);

  const employerShow = useMemo(() => {
    switch (tuType) {
      case 'Первичная профсоюзная организация':
      case 'Первичная профсоюзная организация без ИНН':
        return true;
    }
    return false;
  }, [tuType]);

  useEffect(() => {}, [tuType]);

  const queryClient = useQueryClient();

  const { refetch } = useFetchProfile();

  const {
    mutate,
    isSuccess,
    isPending: isLoading,
  } = useMutation({
    mutationFn: async (data: ITradeUnion) => {
      await registration(data);
      await saveFormTULogo(data.logo);
      await saveFormTUScan(data.scan);
      await saveFormTUUsers(data.participants);
      await refetch();
    },
  });

  const { mutate: mutateAddress } = useMutation({
    mutationFn: async (address: string) => {
      return await getAddress(address);
    },
    onSuccess: (data) => {
      setAddressOptions(data.data);
    },
  });

  const { data: tradeUnions } = useQuery({
    queryKey: ['tradeUnions'],
    queryFn: getApplications,
    select: (data) => data.data.data,
  });

  const { data: myTradeUnion } = useQuery({
    queryKey: ['myTradeUnion'],
    queryFn: getMyTU,
    select: (data) => data.data,
  });

  const { data: options } = useQuery({
    queryKey: ['parentOrganizations'],
    queryFn: getParents,
    select: (data) => data.data.data,
  });

  useEffect(() => {
    if (valueAuto) setFormValue('titleForDocs', valueAuto);
  }, [valueAuto]);

  useEffect(() => {
    if (inputText) setFormValue('titleForDocs', inputText);
  }, [inputText]);

  useEffect(() => {
    if (myTradeUnion) {
      reset(myTradeUnion);
      if (myTradeUnion?.title == myTradeUnion?.titleForDocs) setIsMyName(true);
      if (myTradeUnion.parent && myTradeUnion.parent.guid && tradeUnions) {
        setChoosenUnion(
          tradeUnions.find(
            (el: ITradeUnion) => el.guid === myTradeUnion?.parent.guid,
          ),
        );
      }
    }
  }, [myTradeUnion, tradeUnions]);

  useEffect(() => {
    if (options == null) return;
    if (options.length == 0) return;
    if (myTradeUnion == null) return;
    if (myTradeUnion.title == myTradeUnion.titleForDocs) return;
    if (myTradeUnion.titleForDocs == null) return;
    if (options.some((el: any) => el.title == myTradeUnion.titleForDocs)) {
      setValueAuto(myTradeUnion.titleForDocs);
      return;
    }
    setInputText(myTradeUnion.titleForDocs);
  }, [myTradeUnion, options]);

  const onSubmit: SubmitHandler<ITradeUnion> = async (data) => {
    if (chosenUnionRequired == true && chosenUnion == null) return;
    data.percents = Number(data.percents);
    mutate(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressString(e.target.value);
  };

  const handleOrgChange = (e: SelectChangeEvent) => {
    const elem = e.target.value.split('/');

    const union = tradeUnions.find(
      (el: ITradeUnion) => el.inn === elem[0] && el.title === elem[1],
    );

    setChoosenUnion(union);
  };

  useEffect(() => {
    if (isSuccess && !myTradeUnion?.tariff?.id) {
      router.push('/tariffs');
    } else if (isSuccess) {
      router.push('/documents?incoming');
    }
    queryClient.invalidateQueries({ queryKey: ['myTradeUnion'] });
  }, [isSuccess, myTradeUnion]);

  useEffect(() => {
    if (addressString) {
      const timer = setTimeout(() => {
        mutateAddress(addressString);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [addressString, mutateAddress]);

  useEffect(() => {
    if (isMyName) setFormValue('titleForDocs', getValues('title'));
  }, [isMyName]);

  useEffect(() => {
    if (value) {
      setFormValue('address.area', value?.area);
      setFormValue('address.city', value?.city || value?.settlement);
      setFormValue('address.region', value?.region);
      setFormValue('address.postcode', value?.postalCode);
      setFormValue('address.street', value?.street);
      setFormValue(
        'address.house',
        `${value?.houseType || ''} ${value?.house || ''} ${
          value?.blockType || ''
        } ${value?.block || ''}`,
      );
    }
  }, [value]);

  useEffect(() => {
    switch (tuType) {
      case 'Первичная профсоюзная организация':
        return;
      case 'Профсоюзная организация':
        return;
    }
    if (chosenUnion) {
      setFormValue('inn', chosenUnion?.inn);
      setFormValue('kpp', chosenUnion?.kpp);
      setFormValue('ogrn', chosenUnion?.ogrn);
      setFormValue('registrationDate', chosenUnion?.registrationDate);
      setFormValue('okato', chosenUnion?.okato);
      setFormValue('oktmo', chosenUnion?.oktmo);
      setFormValue('bank.bank', chosenUnion?.bank?.bank);
      setFormValue('bank.rs', chosenUnion?.bank?.rs);
      setFormValue('bank.bik', chosenUnion?.bank?.bik);
      setFormValue('bank.ks', chosenUnion?.bank?.ks);
      setFormValue('parent', chosenUnion?.guid);
      setError('inn', {});
      setError('kpp', {});
      setError('ogrn', {});
      setError('okato', {});
      setError('oktmo', {});
      setError('bank.rs', {});
      setError('bank.ks', {});
      setError('bank.bik', {});
      setError('registrationDate', {});
    }
  }, [chosenUnion]);

  return (
    <Paper className={s.paper}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="ru"
        localeText={
          ruRU.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset
              style={{
                border: 'none',
              }}
              disabled={isLoading}
            >
              <Grid2 container spacing={2}>
                <Grid2 size={12}>
                  <InputLabel>Тип организации</InputLabel>
                  <Controller
                    control={control}
                    name="tuType"
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Box sx={{ width: '100%', position: 'relative' }}>
                        <Select
                          key={value}
                          fullWidth
                          sx={{
                            padding: 1.6,
                            '& .MuiSelect-select span::before': {
                              content: '"Выберите тип организации"',
                              opacity: '0.54',
                            },
                          }}
                          defaultValue={value}
                          value={value}
                          onChange={(e) => {
                            onChange(e);
                            if (e.target.value !== 'Профсоюзная организация') {
                              setChoosenUnion(undefined);
                              setFormValue('parent', null);
                            }
                          }}
                          error={!!error?.message}
                        >
                          {[
                            'Первичная профсоюзная организация',
                            'Первичная профсоюзная организация без ИНН',
                            'Профсоюзная организация',
                          ].map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText id={'tuType'} error={true}>
                          {error && error?.message}
                        </FormHelperText>
                      </Box>
                    )}
                  />
                </Grid2>
                {tuType && tradeUnions && (
                  <Grid2 size={12}>
                    <InputLabel>
                      Вышестоящая организация
                      {chosenUnionRequired && chosenUnion == null && (
                        <span
                          style={
                            !!errors.creationDate?.message
                              ? { color: theme.palette.red.main }
                              : { color: theme.palette.primary.main }
                          }
                        >
                          {' *'}
                        </span>
                      )}
                    </InputLabel>
                    <Select
                      fullWidth
                      sx={{
                        padding: 1.6,
                        outline:
                          chosenUnionRequired && chosenUnion == null
                            ? '1px solid red !important'
                            : '',
                      }}
                      onChange={handleOrgChange}
                      value={
                        chosenUnion
                          ? chosenUnion?.inn + '/' + chosenUnion?.title
                          : ''
                      }
                    >
                      {tradeUnions &&
                        tradeUnions.map((el: ITradeUnion) => {
                          if (el.title !== myTradeUnion?.title)
                            return (
                              <MenuItem
                                key={el.title + el.inn}
                                value={el.inn + '/' + el.title}
                              >
                                {el.inn + ' - ' + el.title}
                              </MenuItem>
                            );
                        })}
                    </Select>
                  </Grid2>
                )}
                <Grid2 size={9} container>
                  <Grid2 size={12}>
                    <InputLabel>
                      Наименование{' '}
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
                      placeholder="Профсоюз"
                      error={!!errors.title?.message}
                      helperText={errors.title?.message || ''}
                    />
                  </Grid2>
                  <Grid2 size={12}>
                    <InputLabel>
                      Дата образования{' '}
                      <span
                        style={
                          !!errors.creationDate?.message
                            ? { color: theme.palette.red.main }
                            : { color: theme.palette.primary.main }
                        }
                      >
                        *
                      </span>
                    </InputLabel>
                    <InputDate name="creationDate" />
                  </Grid2>
                </Grid2>
                <Grid2 size={3}>
                  <InputImage
                    sx={{ width: '100%', height: 'calc(100% - 40px)', mt: 4 }}
                    name="logo"
                    label="Добавить логотип"
                  />
                </Grid2>
                <Grid2 size={4}>
                  <InputLabel>
                    ИНН{' '}
                    {tuType !== 'Первичная профсоюзная организация без ИНН' && (
                      <span
                        style={
                          !!errors.inn?.message
                            ? { color: theme.palette.red.main }
                            : { color: theme.palette.primary.main }
                        }
                      >
                        *
                      </span>
                    )}
                  </InputLabel>
                  <TextFieldCustom
                    register={register('inn')}
                    placeholder="111111111111"
                    error={errors.inn?.message}
                    maxL={12}
                  />
                </Grid2>
                <Grid2 size={4}>
                  <InputLabel>
                    КПП{' '}
                    <span
                      style={
                        !!errors.kpp?.message
                          ? { color: theme.palette.red.main }
                          : { color: theme.palette.primary.main }
                      }
                    >
                      *
                    </span>
                  </InputLabel>
                  <TextFieldCustom
                    register={register('kpp')}
                    placeholder="111111111"
                    error={errors.kpp?.message}
                    maxL={9}
                  />
                </Grid2>
                <Grid2 size={4}>
                  <InputLabel>
                    ОГРН{' '}
                    <span
                      style={
                        !!errors.ogrn?.message
                          ? { color: theme.palette.red.main }
                          : { color: theme.palette.primary.main }
                      }
                    >
                      *
                    </span>
                  </InputLabel>
                  <TextFieldCustom
                    register={register('ogrn')}
                    placeholder="1111111111111"
                    error={errors.ogrn?.message}
                    maxL={13}
                  />
                </Grid2>
                <Grid2 size={4}>
                  <InputLabel>
                    Дата пост. на учет{' '}
                    <span
                      style={
                        !!errors.registrationDate?.message
                          ? { color: theme.palette.red.main }
                          : { color: theme.palette.primary.main }
                      }
                    >
                      *
                    </span>
                  </InputLabel>
                  <InputDate name="registrationDate" />
                </Grid2>
                <Grid2 size={4}>
                  <InputLabel>
                    ОКАТО{' '}
                    <span
                      style={
                        !!errors.okato?.message
                          ? { color: theme.palette.red.main }
                          : { color: theme.palette.primary.main }
                      }
                    >
                      *
                    </span>
                  </InputLabel>
                  <TextFieldCustom
                    register={register('okato')}
                    placeholder="11111111111"
                    error={errors.okato?.message}
                    maxL={11}
                  />
                </Grid2>
                <Grid2 size={4}>
                  <InputLabel>
                    ОКТМО{' '}
                    <span
                      style={
                        !!errors.oktmo?.message
                          ? { color: theme.palette.red.main }
                          : { color: theme.palette.primary.main }
                      }
                    >
                      *
                    </span>
                  </InputLabel>

                  <TextFieldCustom
                    register={register('oktmo')}
                    placeholder="11111111111"
                    error={errors.oktmo?.message}
                    maxL={11}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <InputLabel sx={{ marginBottom: 0 }}>
                    Наименование профсоюзной организации для заявлений{' '}
                  </InputLabel>
                </Grid2>
                <Grid2 size={12}>
                  {isMyName ? (
                    <TextField
                      {...register('titleForDocs')}
                      error={!!errors?.titleForDocs?.message}
                      helperText={errors?.titleForDocs?.message || ''}
                      disabled
                    />
                  ) : (
                    options && (
                      <Controller
                        name={'titleForDocs'}
                        control={control}
                        render={() => (
                          <Autocomplete
                            sx={{
                              '&>div>div': {
                                outline: errors.titleForDocs
                                  ? '1px solid red'
                                  : '',
                              },
                            }}
                            freeSolo
                            options={options.map((el: any) => el.title)}
                            value={valueAuto}
                            onChange={(event, newValue) =>
                              setValueAuto(newValue)
                            }
                            inputValue={inputText ? inputText : ''}
                            onInputChange={(event, newInputValue) =>
                              setInputText(newInputValue)
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Введите наименование организации"
                              />
                            )}
                          />
                        )}
                      />
                    )
                  )}

                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isMyName}
                          value={isMyName}
                          onChange={() => setIsMyName((prev) => !prev)}
                        />
                      }
                      label={
                        <Typography
                          whiteSpace="break-spaces"
                          component={'span'}
                          variant="body1"
                          fontWeight={600}
                        >
                          Совпадает с наименованием профсоюзной организации
                        </Typography>
                      }
                    />
                  </Box>
                </Grid2>
                <Grid2 size={12}>
                  <InputLabel sx={{ marginBottom: 0 }}>
                    Адрес{' '}
                    <span
                      style={
                        !!errors.address?.postcode?.message ||
                        !!errors.address?.region?.message ||
                        !!errors.address?.city?.message ||
                        !!errors.address?.street?.message ||
                        !!errors.address?.house?.message ||
                        !!errors.address?.house?.message
                          ? { color: theme.palette.red.main }
                          : { color: theme.palette.primary.main }
                      }
                    >
                      *
                    </span>
                  </InputLabel>
                </Grid2>
                <Grid2 size={12}>
                  <Autocomplete
                    options={addressOptions}
                    getOptionLabel={(option) => option.value}
                    value={value}
                    onChange={(event: any, newValue: any) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        placeholder="Начните вводить адрес"
                        {...params}
                        value={addressString}
                        onChange={handleChange}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={4}>
                  <TextFieldCustom
                    register={register('address.postcode')}
                    placeholder="Индекс"
                    error={errors.address?.postcode?.message}
                    maxL={6}
                  />
                </Grid2>
                <Grid2 size={8}>
                  <TextField
                    {...register('address.region')}
                    placeholder="Регион"
                    error={!!errors.address?.region?.message}
                    helperText={errors.address?.region?.message || ''}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    {...register('address.area')}
                    placeholder="Муниципальное образование"
                  />
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    {...register('address.city')}
                    placeholder="Населенный пункт"
                    error={!!errors.address?.city?.message}
                    helperText={errors.address?.city?.message || ''}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    {...register('address.street')}
                    placeholder="Улица"
                    error={!!errors.address?.street?.message}
                    helperText={errors.address?.street?.message || ''}
                  />
                </Grid2>
                <Grid2 size={3}>
                  <TextField
                    {...register('address.house')}
                    placeholder="Здание"
                    error={!!errors.address?.house?.message}
                    helperText={errors.address?.house?.message || ''}
                  />
                </Grid2>
                <Grid2 size={3}>
                  <TextField {...register('address.flat')} placeholder="Пом." />
                </Grid2>
                <Grid2 size={12}>
                  <InputLabel sx={{ marginBottom: 0 }}>
                    Председатель{' '}
                    <span
                      style={
                        !!errors.chairman?.lastName?.message ||
                        !!errors.chairman?.firstName?.message
                          ? { color: theme.palette.red.main }
                          : { color: theme.palette.primary.main }
                      }
                    >
                      *
                    </span>
                  </InputLabel>
                </Grid2>
                <Grid2 size={12}>
                  <TextField
                    {...register('chairman.lastName')}
                    placeholder="Фамилия"
                    error={!!errors.chairman?.lastName?.message}
                    helperText={errors.chairman?.lastName?.message || ''}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <TextField
                    {...register('chairman.firstName')}
                    placeholder="Имя"
                    error={!!errors.chairman?.firstName?.message}
                    helperText={errors.chairman?.firstName?.message || ''}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <TextField
                    {...register('chairman.middleName')}
                    placeholder="Отчество"
                    error={!!errors.chairman?.middleName?.message}
                    helperText={errors.chairman?.middleName?.message || ''}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <InputLabel>
                    E-mail{' '}
                    <span
                      style={
                        !!errors.chairmanEmail?.message
                          ? { color: theme.palette.red.main }
                          : { color: theme.palette.primary.main }
                      }
                    >
                      *
                    </span>
                  </InputLabel>
                  <TextField
                    {...register('chairmanEmail')}
                    placeholder="prov@mail.ru"
                    error={!!errors.chairmanEmail?.message}
                    helperText={errors.chairmanEmail?.message || ''}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <InputLabel>
                    Телефон{' '}
                    <span
                      style={
                        !!errors.chairmanPhone?.message
                          ? { color: theme.palette.red.main }
                          : { color: theme.palette.primary.main }
                      }
                    >
                      *
                    </span>
                  </InputLabel>
                  <TextFieldCustom
                    register={register('chairmanPhone')}
                    placeholder="+79999999999"
                    error={errors.chairmanPhone?.message}
                    maxL={11}
                    allowPlus
                  />
                </Grid2>
                {employerShow && (
                  <>
                    <Grid2 size={12}>
                      <InputLabel sx={{ marginBottom: 0 }}>
                        Работодатель{' '}
                        <span
                          style={
                            !!errors.employer?.title?.message ||
                            !!errors.employer?.lastName?.message ||
                            !!errors.employer?.firstName?.message ||
                            !!errors.employer?.inn?.message
                              ? { color: theme.palette.red.main }
                              : { color: theme.palette.primary.main }
                          }
                        >
                          *
                        </span>
                      </InputLabel>
                    </Grid2>
                    <Grid2 size={12}>
                      <TextField
                        {...register('employer.title')}
                        placeholder="Полное наименование организации-работодателя"
                        error={!!errors.employer?.title?.message}
                        helperText={errors.employer?.title?.message || ''}
                      />
                    </Grid2>
                    <Grid2 size={6}>
                      <TextField
                        {...register('employer.lastName')}
                        placeholder="Фамилия руководителя организации-работодателя"
                        error={!!errors.employer?.lastName?.message}
                        helperText={errors.employer?.lastName?.message || ''}
                      />
                    </Grid2>
                    <Grid2 size={6}>
                      <TextField
                        {...register('employer.firstName')}
                        placeholder="Имя руководителя организации-работодателя"
                        error={!!errors.employer?.firstName?.message}
                        helperText={errors.employer?.firstName?.message || ''}
                      />
                    </Grid2>
                    <Grid2 size={6}>
                      <TextField
                        {...register('employer.middleName')}
                        placeholder="Отчество руководителя организации-работодателя"
                        error={!!errors.employer?.middleName?.message}
                        helperText={errors.employer?.middleName?.message || ''}
                      />
                    </Grid2>
                    <Grid2 size={6}>
                      <TextFieldCustom
                        register={register('employer.inn')}
                        placeholder="ИНН организации-работодателя"
                        error={errors.employer?.inn?.message}
                        maxL={12}
                      />
                    </Grid2>
                  </>
                )}
                <Grid2 size={12}>
                  <InputLabel
                    sx={{
                      marginBottom: 0,
                    }}
                  >
                    Банковские реквизиты{' '}
                    <span
                      style={
                        !!errors.bank?.bank?.message ||
                        !!errors.bank?.rs?.message ||
                        !!errors.bank?.bik?.message ||
                        !!errors.bank?.ks?.message
                          ? { color: theme.palette.red.main }
                          : { color: theme.palette.primary.main }
                      }
                    >
                      *
                    </span>
                  </InputLabel>
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    {...register('bank.bank')}
                    placeholder="Банк"
                    error={!!errors.bank?.bank?.message}
                    helperText={errors.bank?.bank?.message || ''}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <TextFieldCustom
                    register={register('bank.rs')}
                    placeholder="Р/с"
                    error={errors.bank?.rs?.message}
                    maxL={20}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <TextFieldCustom
                    register={register('bank.bik')}
                    placeholder="БИК"
                    error={errors.bank?.bik?.message}
                    maxL={9}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <TextFieldCustom
                    register={register('bank.ks')}
                    placeholder="К/с"
                    error={errors.bank?.ks?.message}
                    maxL={20}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <InputLabel>
                    Телефон организации{' '}
                    <span
                      style={
                        !!errors.phone?.message
                          ? { color: theme.palette.red.main }
                          : { color: theme.palette.primary.main }
                      }
                    >
                      *
                    </span>
                  </InputLabel>
                  <TextFieldCustom
                    register={register('phone')}
                    placeholder="+79999999999"
                    error={errors.phone?.message}
                    maxL={11}
                    allowPlus
                  />
                </Grid2>
                <Grid2 size={6}>
                  <InputLabel>
                    Е-мейл организации{' '}
                    <span
                      style={
                        !!errors.email?.message
                          ? { color: theme.palette.red.main }
                          : { color: theme.palette.primary.main }
                      }
                    >
                      *
                    </span>
                  </InputLabel>
                  <TextField
                    {...register('email')}
                    placeholder="prov@mail.ru"
                    error={!!errors.email?.message}
                    helperText={errors.email?.message || ''}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <InputLabel>
                    Размер взносов (%){' '}
                    <span
                      style={
                        !!errors.percents?.message
                          ? { color: theme.palette.red.main }
                          : { color: theme.palette.primary.main }
                      }
                    >
                      *
                    </span>
                  </InputLabel>
                  <TextField
                    {...register('percents')}
                    error={!!errors.percents?.message}
                    helperText={errors.percents?.message || ''}
                    onChange={(e) => {
                      if (!/^\d+$/.test(e.target.value))
                        setPercents(chosenUnion?.percents || 0);
                      else
                        setPercents(
                          Math.min(100, Math.max(0, Number(e.target.value))),
                        );
                    }}
                    value={percents}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <InputFile
                    name="scan"
                    label={
                      <span>
                        Прикрепить Устав профсоюзной организации <br />
                        (документ в формате pdf размером до 2МБ)
                      </span>
                    }
                    accept=".pdf"
                    imageSelect="pdf"
                    type="secondary"
                  />
                </Grid2>
                <Grid2 size={12}>
                  <InputFile
                    name="participants"
                    label={
                      <span>
                        Загрузить участников <br />
                        (документ в формате xls размером до 2МБ)
                      </span>
                    }
                    accept=".xls,.xlsx"
                    imageInit="upload"
                    type="secondary"
                  />
                </Grid2>
                <Grid2 size={12}>
                  <Box
                    width={'50%'}
                    m={'0 auto'}
                    display={'flex'}
                    alignItems={'center'}
                    gap={1.2}
                    justifyContent={'center'}
                    component={'a'}
                    href="/members-template.xlsx"
                    download
                  >
                    <img src="/images/xml.svg" alt="xml"></img>
                    <Typography
                      lineHeight={'27px'}
                      fontSize={16}
                      color="rgb(32, 34, 36)"
                      fontWeight={600}
                    >
                      Шаблон списка участников профсоюза
                    </Typography>
                  </Box>
                </Grid2>
                <Grid2 size={12}>
                  <InputCheckbox
                    sx={{ justifyContent: 'center' }}
                    name="isActive"
                    link={'/politics.pdf'}
                    label={`Я соглашаюсь с политикой обработки персональных данных `}
                  />
                </Grid2>
                {isLoading == false && (
                  <>
                    <Grid2 size={6}>
                      <Button
                        variant="outlined"
                        sx={{
                          width: '100%',
                          fontSize: '20px',
                          lineHeight: '27px',
                        }}
                        onClick={() => router.push('/documents?incoming')}
                      >
                        Отменить
                      </Button>
                    </Grid2>
                    <Grid2 size={6}>
                      <Button
                        variant="contained"
                        sx={{
                          width: '100%',
                          padding: '16px 25px',
                          fontSize: '20px',
                          lineHeight: '27px',
                        }}
                        type="submit"
                      >
                        Сохранить
                      </Button>
                    </Grid2>
                  </>
                )}
                {isLoading == true && (
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    width={'100%'}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </Grid2>
            </fieldset>
          </form>
        </FormProvider>
      </LocalizationProvider>
    </Paper>
  );
};

export default TradeUnionRegistrationForm;
