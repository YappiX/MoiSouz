import React, { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormHelperText,
  Grid2,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import s from './forms.module.scss';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApplications } from '@/services/getApplications';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { getBackendUrl } from '@/constants/url';
import { ITradeUnion } from '@/models/TradeUnion';
import { getHeaders } from '@/utils/axios';

const schema = yup
  .object({
    tu: yup.string().required('Выберите Профсоюз'),
  })
  .required();

const MembershipForm = () => {
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const [currentTU, setCurrentTU] = useState<string | null>(null);

  const { data: tus } = useQuery({
    queryKey: ['tradeUnions'],
    queryFn: getApplications,
    select: (data) => data.data.data,
  });

  const { data: info } = useQuery({
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

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = methods;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, error } = useMutation({
    mutationFn: async (data: { tu: string }) => {
      const session = await getSession();
      return axios.put(
        `${getBackendUrl}/api/private/tradeunion-user-exists/${data.tu}`,
        null,
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      router.push('/documents?incoming');
    },
  });

  useEffect(() => {
    if (currentTU) setValue('tu', currentTU);
  }, [currentTU]);

  const onSubmit: SubmitHandler<{ tu: string }> = async (data) => {
    mutate(data);
  };

  return (
    <Paper className={s.paper}>
      {error && (
        <Typography
          variant="h3"
          textAlign={'center'}
          marginBottom={'12px'}
          color="#FF4949"
        >
          Пользователь не обнаружен в выбранном профсоюзе
        </Typography>
      )}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={2.5}>
            <Grid2 size={12} sx={{ position: 'relative' }}>
              <Select
                fullWidth
                sx={{
                  padding: 1.6,
                  '& .MuiSelect-select span::before': {
                    content: '"Выберите профсоюз"',
                    opacity: '0.54',
                  },
                }}
                value={currentTU}
                name="tu"
                onChange={(e) => setCurrentTU(e.target.value)}
              >
                {tus &&
                  info &&
                  tus
                    .filter(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (t: any) =>
                        info.find((ut: ITradeUnion) => ut.guid === t.guid) ===
                        undefined,
                    )
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map((tu: any) => (
                      <MenuItem key={tu.guid} value={tu.guid}>
                        {tu.title}
                      </MenuItem>
                    ))}
              </Select>
              {errors.tu && (
                <FormHelperText
                  sx={{
                    color: '#FF4949',
                    position: 'absolute',
                  }}
                >
                  {errors.tu.message}
                </FormHelperText>
              )}
            </Grid2>

            <Grid2 size={6}>
              <Button
                variant="outlined"
                sx={{
                  width: '100%',
                  padding: '16px 25px',
                  fontSize: '20px',
                  lineHeight: '27px',
                }}
                onClick={() => router.push('/documents')}
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
                Далее
              </Button>
            </Grid2>
          </Grid2>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default MembershipForm;
