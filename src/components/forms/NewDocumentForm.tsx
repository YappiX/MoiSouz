import React, { useEffect, useState } from 'react';
import s from './forms.module.scss';
import {
  Button,
  CircularProgress,
  Grid2,
  InputLabel,
  Paper,
  TextField,
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
import { useRouter } from 'next/navigation';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ruRU } from '@mui/x-date-pickers/locales';
import { InputDate } from '../ui/form/input-date';
import dayjs from 'dayjs';
import { type INewDoc } from '@/models/Doc';
import { InputArrayOfObjects } from '../ui/form/input-array-of-objects';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { getBackendUrl } from '@/constants/url';
import { type INewDocument } from '@/models/NewDocument';
import { getDocs } from '@/services/getDocs';
import { getMembers } from '@/services/members';
import QuestionFields from '../ui/form/question';
import { InputLabelRequired, InputAutocomplete } from '../ui';

const itemSchema = yup.object().shape({
  speaker: yup.string().required('Обязательное поле'),
  question: yup.string().required('Обязательное поле'),
  document: yup.string(),
});

const memberSchema = yup.object().shape({
  name: yup.string().required('Обязательное поле'),
  role: yup.string().required('Обязательное поле'),
});
const memberISchema = yup.object().shape({
  firstName: yup.string().required('Обязательное поле'),
  lastName: yup.string().required('Обязательное поле'),
  middleName: yup.string().required('Обязательное поле'),
  role: yup.string().required('Обязательное поле'),
});

const schema = yup
  .object({
    documentDate: yup.string(),
    documentNumber: yup.string(),
    address: yup.string().required('Обязательное поле'),
    members: yup.array().of(memberSchema).nullable(),
    invitedMembers: yup.array().of(memberISchema).nullable(),
    questions: yup.array().of(itemSchema),
  })
  .required();

const NewDocumentForm = ({
  doc,
  guid,
}: {
  doc?: INewDoc | null;
  guid: string;
}) => {
  const [articlesL, setArticlesL] = useState<number>(0);
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: docs, isLoading } = useQuery({
    queryKey: ['docs'],
    queryFn: getDocs,
    select: (data) => data,
  });

  const { data: membersData, isLoading: isMembersLoading } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
    select: (data) => data.data,
  });

  const [members, setMembers] = useState<{ role: string; name: string }[]>([]);
  const [selectedNotInvitedMembers, setSelectedNotInvitedMembers] = useState<
    { role: string; name: string }[]
  >([]);

  useEffect(() => {
    if (membersData) {
      setMembers(() => {
        return [
          ...membersData
            .filter((el) => el.isCommittee)
            .map((el) => ({
              role: el.role,
              name: el.name || '',
            })),
        ];
      });
    }
  }, [membersData]);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue: setFormValue,
    getValues,
    reset,
    control,
  } = methods;

  const { members: membersWatch } = useWatch({ control });

  const { mutate, isSuccess, data } = useMutation({
    mutationFn: async (data: INewDocument) => {
      const session = await getSession();

      return await axios.post(
        `${getBackendUrl}/api/private/document`,
        {
          documentDate: data.documentDate,
          documentNumber: data.documentNumber,
          data: {
            address: data.address,
            questions: data.questions,
            members: data.members,
            invitedMembers: data.invitedMembers,
          },
        },
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` },
        },
      );
    },
  });

  const { mutate: mutateByGuid, isSuccess: isSuccessByGuid } = useMutation({
    mutationFn: async (data: INewDocument) => {
      const session = await getSession();
      if (doc)
        return await axios.post(
          `${getBackendUrl}/api/private/document`,
          {
            documentDate: data.documentDate,
            documentNumber: data.documentNumber,
            data: {
              address: data.address,
              questions: data.questions,
              members: data.members,
              invitedMembers: data.invitedMembers,
            },
            guid: doc.guid,
          },
          {
            headers: { Authorization: `Bearer ${session?.user?.token}` },
          },
        );
    },
  });

  const onSubmit: SubmitHandler<INewDocument> = async (data) => {
    if (doc && doc.guid) mutateByGuid(data);
    else mutate(data);
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['doc'] });
  }, [guid]);

  useEffect(() => {
    if (isSuccess) {
      router.push(`/documents/${data?.data.guid}`);
    }
    if (isSuccessByGuid && doc) {
      router.push(`/documents/${doc.guid}`);
    }
  }, [isSuccess, data, doc, isSuccessByGuid]);

  useEffect(() => {
    setFormValue('documentNumber', 'AGXXXXX');
    setFormValue('documentDate', dayjs().format('DD.MM.YYYY'));
  }, []);

  useEffect(() => {
    if (doc) {
      setFormValue('documentNumber', doc.documentNumber);
      setFormValue('documentDate', doc.documentDate);
      setFormValue(`address`, doc.data.address);
      if (doc.data?.questions && doc.data.questions?.length) {
        doc.data.questions?.forEach((el, id) => {
          setFormValue(
            `questions.${id}.speaker`,
            //@ts-expect-error none
            doc.data.questions[id].speaker,
          );
          setFormValue(
            `questions.${id}.question`,
            //@ts-expect-error none
            doc.data.questions[id].question,
          );
          setFormValue(
            `questions.${id}.document`,
            //@ts-expect-error none
            doc.data.questions[id].document,
          );
        });
      }
      if (doc.data.invitedMembers && doc.data?.invitedMembers.length) {
        doc.data.invitedMembers?.forEach((el, id) => {
          setFormValue(`invitedMembers.${id}`, el);
        });
      }
    } else {
      reset();
      setFormValue('documentNumber', 'AGXXXXX');
      setFormValue('documentDate', dayjs().format('DD.MM.YYYY'));
    }
  }, [doc]);

  useEffect(() => {
    if (docs && !doc) {
      const filteredDocs = docs.filter(
        (el) =>
          el.documentType === 'AM' && el.step === 'На проверке профсоюзом',
      );
      if (filteredDocs && filteredDocs.length) {
        filteredDocs.forEach((el, id) => {
          setFormValue(`questions.${id}.document`, el.guid);
          setFormValue(
            `questions.${id}.question`,
            //@ts-expect-error none
            `О приёме в профсоюз на основании заявления\nЗаявитель: ${el.user.name}\nДата рождения: ${el.user.birthdate}`,
          );
        });
      }
      setArticlesL(filteredDocs.length);
    }
  }, [docs, doc]);

  useEffect(() => {
    if (members) {
      setSelectedNotInvitedMembers([...members]);
      if (doc) {
        if (doc.data.members && doc.data?.members.length) {
          doc.data.members?.forEach((el, id) => {
            setFormValue(`members.${id}`, el);
          });
        }
      }
    }
  }, [members, doc]);

  return (
    <Paper className={s.paper} style={{ paddingBottom: '55px' }}>
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
              <Grid2 size={6}>
                <InputLabel>Номер документа</InputLabel>
                <TextField
                  {...register('documentNumber')}
                  disabled
                  error={!!errors.documentNumber?.message}
                  helperText={errors.documentNumber?.message || ''}
                />
              </Grid2>
              <Grid2 size={6}>
                <InputDate
                  name="documentDate"
                  label="Дата документа"
                  labelRequired
                  isFutureAccess
                />
              </Grid2>
              <Grid2 size={12}>
                <InputLabelRequired error={!!errors.address?.message}>
                  Место проведения
                </InputLabelRequired>
                <TextField
                  {...register(`address`)}
                  placeholder="Место проведения"
                  error={!!errors.address?.message}
                  helperText={errors.address?.message || ''}
                />
              </Grid2>
              {!isMembersLoading && members && members.length && (
                <Grid2 size={12}>
                  <Controller
                    name="members"
                    control={control}
                    render={({
                      field: { onChange },
                      fieldState: { error },
                    }) => (
                      <InputAutocomplete
                        label="Участники - члены профсоюзной организации"
                        options={members.map((el) => ({
                          id: `${el.role} - ${el.name}`,
                          title: `${el.role} - ${el.name}`,
                        }))}
                        placeholder="Выберите участников"
                        value={
                          membersWatch?.map(
                            (el) => `${el.role} - ${el.name}`,
                          ) || []
                        }
                        onChange={(value) =>
                          onChange(
                            (members || []).filter((el) =>
                              value.includes(`${el.role} - ${el.name}`),
                            ),
                          )
                        }
                        multiple
                        error={error?.message}
                      />
                    )}
                  />
                </Grid2>
              )}
              {!isLoading && (
                <Grid2 size={12}>
                  <InputArrayOfObjects
                    name={'invitedMembers'}
                    defaultValue={''}
                    position
                    desc="Добавить участника"
                    labelExtra="Участники - приглашенные"
                    labelRequired
                    render={(name, index, register, errors) => (
                      <Grid2 container spacing={1.2} marginBottom={2}>
                        <Grid2 size={12} sx={{ display: 'none' }}>
                          <TextField
                            {...register(`${name}.${index}.role`)}
                            value={'Приглашенный участник'}
                          ></TextField>
                        </Grid2>
                        <Grid2 size={4}>
                          <TextField
                            {...register(`${name}.${index}.lastName`)}
                            placeholder="Фамилия"
                            error={!!errors?.lastName}
                            helperText={errors?.lastName?.message || ''}
                          ></TextField>
                        </Grid2>
                        <Grid2 size={4}>
                          <TextField
                            {...register(`${name}.${index}.firstName`)}
                            placeholder="Имя"
                            error={!!errors?.firstName}
                            helperText={errors?.firstName?.message || ''}
                          ></TextField>
                        </Grid2>
                        <Grid2 size={4}>
                          <TextField
                            {...register(`${name}.${index}.middleName`)}
                            placeholder="Отчество"
                            error={!!errors?.middleName}
                            helperText={errors?.middleName?.message || ''}
                          ></TextField>
                        </Grid2>
                      </Grid2>
                    )}
                  />
                </Grid2>
              )}
              {!isLoading ? (
                <Grid2 size={12}>
                  <InputArrayOfObjects
                    name="questions"
                    desc="Добавить вопрос"
                    render={(name, index, register, errors) => (
                      <QuestionFields
                        name={name}
                        index={index}
                        register={register}
                        errors={errors}
                        members={selectedNotInvitedMembers}
                        isMembersLoading={isMembersLoading}
                        articlesL={articlesL}
                        getValues={getValues}
                        setFormValue={setFormValue}
                      />
                    )}
                    defaultValue=""
                  />
                </Grid2>
              ) : (
                <Grid2 size={12} display={'flex'} justifyContent={'center'}>
                  <CircularProgress />
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
                    const values = getValues();
                    if (
                      values?.questions?.[values.questions.length - 1]
                        ?.question == '' ||
                      values?.questions?.[values.questions.length - 1]
                        ?.question == undefined
                    ) {
                      values?.questions?.pop();
                    }
                    await onSubmit(values);
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

export default NewDocumentForm;
