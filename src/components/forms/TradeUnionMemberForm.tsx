import React, { useEffect, useState } from 'react';
import s from './forms.module.scss';
import {
  Button,
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
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ITradeUnionMember } from '@/models/TradeUnionMember';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ruRU } from '@mui/x-date-pickers/locales';
import { InputDate } from '../ui/form/input-date';
import dayjs from 'dayjs';
import { useFetchProfile } from '@/hooks/useFetchProfile';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getApplications } from '@/services/getApplications';
import { ITradeUnion } from '@/models/TradeUnion';
import { InputCheckbox } from '../ui/form/input-checkbox';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { getBackendUrl } from '@/constants/url';
import { IDoc } from '@/models/Doc';
import { getHeaders } from '@/utils/axios';
import { InputAutocomplete } from '../ui/form';
import theme from '@/styles/theme';

const schema = yup
  .object({
    documentDate: yup.string(),
    documentNumber: yup.string(),
    data: yup.object({
      inviteDate: yup.string().required('Обязательное поле'),
      lastName: yup.string().required('Обязательное поле'),
      firstName: yup.string().required('Обязательное поле'),
      middleName: yup.string().nullable(),
      position: yup.string().required('Обязательное поле'),
      percents: yup
        .number()
        .typeError('Обязательное поле')
        .min(0, 'Взнос должен быть больше 0')
        .max(100, 'Взнос должен быть не больше 100')
        .required('Обязательное поле'),
      isActive: yup
        .bool()
        .oneOf([true], 'Необходимо принять согласие')
        .required('Необходимо принять согласие'),
    }),
    tradeunion: yup.number().required('Обязательное поле'),
    id: yup.number().nullable(),
  })
  .required();

const TradeUnionMemberForm = ({ doc }: { doc?: IDoc | null }) => {
  const [chosenUnion, setChoosenUnion] = useState<ITradeUnion>();
  const [percents, setPercents] = useState<number>();
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue: setFormValue,
    getValues,
  } = methods;

  const { data: infoUT } = useQuery({
    queryKey: ['user-tradeunions'],
    queryFn: async () =>
      axios.get<ITradeUnion[]>(
        `${getBackendUrl}/api/private/user-tradeunions`,
        {
          headers: {
            ...(await getHeaders()),
          },
        },
      ),
    select: (data) => data.data,
    refetchOnMount: 'always',
  });

  const { mutate, isSuccess, data } = useMutation({
    mutationFn: async (data: ITradeUnionMember) => {
      const session = await getSession();

      return axios.post(`${getBackendUrl}/api/private/document`, data, {
        headers: { Authorization: `Bearer ${session?.user?.token}` },
      });
    },
  });

  const { mutate: mutateByGuid, isSuccess: isSuccessByGuid } = useMutation({
    mutationFn: async (data: ITradeUnionMember) => {
      const session = await getSession();
      if (doc)
        return axios.post(
          `${getBackendUrl}/api/private/document`,
          { ...data, guid: doc.guid },
          {
            headers: { Authorization: `Bearer ${session?.user?.token}` },
          },
        );
    },
  });

  const onSubmit: SubmitHandler<ITradeUnionMember> = async (data) => {
    data.data.percents = Number(data.data.percents);
    if (!doc) mutate(data);
    else mutateByGuid(data);
  };

  const { info } = useFetchProfile();
  const [show, setShow] = useState<boolean>(false);

  const { data: tradeUnions } = useQuery({
    queryKey: ['tradeUnions'],
    queryFn: getApplications,
    select: (data) => data.data.data,
  });

  useEffect(() => {
    if (isSuccess) {
      router.push(`/documents/${data?.data.guid}`);
    }
    if (isSuccessByGuid && doc) {
      router.push(`/documents/${doc.guid}`);
    }
  }, [isSuccess, data, doc, isSuccessByGuid]);

  useEffect(() => {
    if (info) {
      setFormValue('data.middleName', info.middleName);
      setFormValue('data.firstName', String(info.firstName));
      setFormValue('data.lastName', String(info.lastName));
      setFormValue('data.position', String(info.position && info.position[0]));
      setFormValue('documentNumber', 'AMXXXXX');
      setFormValue('documentDate', dayjs().format('DD.MM.YYYY'));
    }
  }, [info]);

  useEffect(() => {
    if (doc) {
      setFormValue('documentNumber', doc.documentNumber);
      setFormValue('documentDate', doc.documentDate);
      setFormValue('data.percents', doc.data.percents);
      setFormValue('data.position', doc.data.position);
      setFormValue('data.inviteDate', doc.data.inviteDate);
      setFormValue('data.isActive', doc.data.isActive);
      setFormValue('id', doc.id ? doc.id : null);
      setChoosenUnion(doc.tradeunion);
    }
  }, [doc]);

  const handleOrgChange = (e: SelectChangeEvent) => {
    const union = tradeUnions.find(
      (el: ITradeUnion) => Number(el.id) === Number(e.target.value),
    );

    setPercents(union.percents || 0);
    setFormValue('data.percents', union.percents || 0);
    setChoosenUnion(union);
    setFormValue('documentNumber', doc?.documentNumber || 'AMXXXXX');
    setFormValue(
      'documentDate',
      doc?.documentDate || dayjs().format('DD.MM.YYYY'),
    );
    setFormValue(
      'data.inviteDate',
      doc?.data.inviteDate || dayjs().format('DD.MM.YYYY'),
    );
    setShow(true);
  };
  useEffect(() => {
    if (chosenUnion && chosenUnion.id) {
      setFormValue('tradeunion', chosenUnion.id);
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
            <Grid2 container spacing={2}>
              {doc && (
                <>
                  <Grid2 size={6}>
                    <InputLabel>Номер документа</InputLabel>
                    <TextField
                      {...register('documentNumber')}
                      disabled
                      error={!!errors.data?.firstName?.message}
                      helperText={errors.data?.firstName?.message || ''}
                    />
                  </Grid2>
                  <Grid2 size={6}>
                    <InputLabel>Дата документа</InputLabel>
                    <InputDate name="documentDate" dis />
                  </Grid2>
                </>
              )}
              <Grid2 size={12}>
                <InputLabel>
                  Фамилия{' '}
                  <span
                    style={
                      !!errors.data?.lastName?.message
                        ? { color: theme.palette.red.main }
                        : { color: theme.palette.primary.main }
                    }
                  >
                    *
                  </span>
                </InputLabel>
                <TextField
                  {...register('data.lastName')}
                  placeholder="Иванов"
                  error={!!errors.data?.lastName?.message}
                  helperText={errors.data?.lastName?.message || ''}
                  slotProps={{ input: { readOnly: true } }}
                />
              </Grid2>
              <Grid2 size={12}>
                <InputLabel>
                  Имя{' '}
                  <span
                    style={
                      !!errors.data?.firstName?.message
                        ? { color: theme.palette.red.main }
                        : { color: theme.palette.primary.main }
                    }
                  >
                    *
                  </span>
                </InputLabel>
                <TextField
                  {...register('data.firstName')}
                  placeholder="Иван"
                  error={!!errors.data?.firstName?.message}
                  helperText={errors.data?.firstName?.message || ''}
                  slotProps={{ input: { readOnly: true } }}
                />
              </Grid2>
              <Grid2 size={12}>
                <InputLabel>Отчество</InputLabel>
                <TextField
                  {...register('data.middleName')}
                  placeholder="Иванович"
                  error={!!errors.data?.middleName?.message}
                  helperText={errors.data?.middleName?.message || ''}
                  slotProps={{ input: { readOnly: true } }}
                />
              </Grid2>

              <InputAutocomplete
                sx={{ width: '100%' }}
                name="data.position"
                label={
                  <>
                    Должность{' '}
                    <span
                      style={
                        !!errors.data?.position?.message
                          ? { color: theme.palette.red.main }
                          : { color: theme.palette.primary.main }
                      }
                    >
                      *
                    </span>
                  </>
                }
                placeholder="Выберите должность"
                options={
                  info?.position?.map((el) => ({ id: el, title: el })) || []
                }
              />

              <Grid2 size={12} sx={{ position: 'relative' }}>
                <InputLabel>
                  Наименования профсоюза{' '}
                  <span
                    style={
                      !!errors.tradeunion?.message
                        ? { color: theme.palette.red.main }
                        : { color: theme.palette.primary.main }
                    }
                  >
                    *
                  </span>
                </InputLabel>
                <Select
                  fullWidth
                  sx={{ padding: 1.6 }}
                  onChange={handleOrgChange}
                  value={String(chosenUnion?.id) || ''}
                  error={!!errors.tradeunion?.message}
                >
                  {tradeUnions &&
                    infoUT &&
                    tradeUnions
                      .filter(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (t: any) =>
                          infoUT.find(
                            (ut: ITradeUnion) => ut.guid === t.guid,
                          ) === undefined,
                      )
                      .map((el: ITradeUnion) => (
                        <MenuItem key={el.id} value={el.id}>
                          {el.title}
                        </MenuItem>
                      ))}
                </Select>
                {!!errors.tradeunion?.message && (
                  <Typography className={s.errorText}>
                    {errors.tradeunion?.message}
                  </Typography>
                )}
              </Grid2>
              <Grid2 size={4}>
                <InputLabel>
                  Дата вступления{' '}
                  <span
                    style={
                      !!errors.data?.inviteDate?.message
                        ? { color: theme.palette.red.main }
                        : { color: theme.palette.primary.main }
                    }
                  >
                    *
                  </span>
                </InputLabel>
                <InputDate name="data.inviteDate" isFutureAccess />
              </Grid2>
              <Grid2 size={8}>
                <InputLabel>
                  Размер взносов (%){' '}
                  <span
                    style={
                      !!errors.data?.percents?.message
                        ? { color: theme.palette.red.main }
                        : { color: theme.palette.primary.main }
                    }
                  >
                    *
                  </span>
                </InputLabel>
                <TextField
                  {...register('data.percents')}
                  error={!!errors.data?.percents?.message}
                  helperText={errors.data?.percents?.message || ''}
                  disabled
                  onChange={(e) => {
                    if (!/^\d+$/.test(e.target.value))
                      setPercents(chosenUnion?.percents || 0);
                    else
                      setPercents(
                        Math.min(
                          100,
                          Math.max(
                            chosenUnion?.percents || 0,
                            Number(e.target.value),
                          ),
                        ),
                      );
                  }}
                  value={percents}
                />
              </Grid2>

              {show && (
                <Grid2 size={12}>
                  <InputCheckbox
                    sx={{ justifyContent: 'center' }}
                    name="data.isActive"
                    link={getBackendUrl + String(chosenUnion?.scan) || ''}
                    label={`Ознакомлен/на с уставом профсоюзной организации `}
                  />
                </Grid2>
              )}
              <Grid2 size={4}>
                <Button
                  variant="outlined"
                  sx={{ width: '100%', fontSize: '20px', lineHeight: '27px' }}
                  onClick={() => router.push('/documents?incoming')}
                >
                  Отменить
                </Button>
              </Grid2>
              <Grid2 size={4}>
                <Button
                  variant="outlined"
                  sx={{
                    width: '100%',
                    padding: '16px 25px',
                    fontSize: '20px',
                    lineHeight: '27px',
                  }}
                  onClick={async () => {
                    await onSubmit(getValues());
                    router.push('/documents?drafts');
                  }}
                >
                  В черновик
                </Button>
              </Grid2>
              <Grid2 size={4}>
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
                  Далее
                </Button>
              </Grid2>
            </Grid2>
          </form>
        </FormProvider>
      </LocalizationProvider>
    </Paper>
  );
};

export default TradeUnionMemberForm;
