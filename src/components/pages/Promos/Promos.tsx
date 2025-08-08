'use client';

import { BreadCrumbsText, Icon } from '@/components/ui';
import { getBackendUrl } from '@/constants/url';
import { getBenefitsProductPromos } from '@/services/benefits';
import { getPdf } from '@/services/promos';
import {
  Box,
  CircularProgress,
  Grid2,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PromosPage = () => {
  const [id, setId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const { data: promos, isFetching } = useQuery({
    queryKey: ['benefit-item'],
    queryFn: () => getBenefitsProductPromos(),
    select: (data) => data?.data,
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const [inputValue, setInputValue] = useState<[null | number, string]>([
    null,
    '',
  ]);

  const { mutate } = useMutation({
    mutationFn: async ({ id, saving }: { id: number; saving: number }) => {
      const session = await getSession();
      return axios.post(
        `${getBackendUrl}/api/private/promo/${id}/saving`,
        { saving: saving },
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` },
        },
      );
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue[1] !== '' && savingId !== null) {
        const args = { id: savingId, saving: Number(inputValue[1]) };
        mutate(args);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue, savingId, mutate]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isFetching: loadingPDF } = useQuery({
    queryKey: ['promo-pdf'],
    queryFn: async () => {
      if (id) {
        const pdf = await getPdf(id);
        openPDF(pdf);
        return pdf;
      }
    },
    enabled: !!id,
  });

  const handleClickView = (id: number) => {
    router.push(`/benefits/product/${id}`);
  };
  const handleClickDownload = (id: number) => {
    setId(id);
  };

  const openPDF = (pdf: AxiosResponse | undefined) => {
    if (pdf == null) return;
    if (pdf.data == null) return;
    if (pdf.data.source == null) return;
    setTimeout(() => {
      setId(null);
      queryClient.removeQueries({ queryKey: ['promo-pdf'] });
    });
    window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${pdf.data.source}`,
      '_blank',
    );
  };

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      <BreadCrumbsText
        data={[{ text: 'Главная', link: '/main' }, { text: 'Промокоды' }]}
      />

      <Typography variant="h3" lineHeight={'57px'}>
        Мои скидки и льготы
      </Typography>
      {!isFetching ? (
        <Grid2 container spacing={2}>
          {promos.length ? (
            /*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
            promos.map((el: any, id: number) => (
              <Grid2 size={12} key={String(el.id).concat(id.toString())}>
                <Paper
                  sx={{
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '20px',
                    overflow: 'hidden',
                    height: '231px',
                  }}
                >
                  <Box>
                    <img
                      alt="promo"
                      src={el.image_url || `data:image/png;base64,${el.image}`}
                      style={{
                        aspectRatio: '17 / 9',
                        height: '231px',
                        borderRadius: '24px 0 0 24px',
                      }}
                    ></img>
                  </Box>
                  <Box padding={'20px'} width={'100%'}>
                    <Typography
                      variant="h3"
                      fontSize={'16px'}
                      color="rgb(32, 34, 36)"
                    >
                      {el.name}
                    </Typography>
                    <Typography
                      variant="h3"
                      fontSize={'14px'}
                      color="rgb(166, 166, 166)"
                    >
                      Код:{' '}
                      <span style={{ color: 'rgb(32, 34, 36)' }}>
                        {el.promo.code}
                      </span>
                    </Typography>
                    <Typography
                      variant="h3"
                      fontSize={'14px'}
                      color="rgb(166, 166, 166)"
                    >
                      Действует до:{' '}
                      <span style={{ color: 'rgb(32, 34, 36)' }}>
                        {[
                          String(
                            new Date(el.promo.end_date).getDate(),
                          ).padStart(2, '0'),
                          String(
                            new Date(el.promo.end_date).getMonth() + 1,
                          ).padStart(2, '0'),
                          new Date(el.promo.end_date).getFullYear(),
                        ].join('.')}
                      </span>
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginLeft: '-8px',
                        marginTop: '70px',
                        width: '100%',
                      }}
                    >
                      {loadingPDF == false ? (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleClickDownload(el.promo.id);
                          }}
                        >
                          <Icon name="print" />
                          <Typography
                            variant="h4"
                            fontWeight={600}
                            marginLeft={0.4}
                          >
                            Скачать
                          </Typography>
                        </IconButton>
                      ) : (
                        <CircularProgress sx={{ marginX: 3.6 }} size={34} />
                      )}
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleClickView(el.id);
                        }}
                      >
                        <Icon name="document" color={'rgb(53, 27, 27)'} />
                        <Typography
                          variant="h4"
                          fontWeight={600}
                          marginLeft={0.4}
                        >
                          Смотреть
                        </Typography>
                      </IconButton>
                      <Box>
                        <span style={{ lineHeight: '40px' }}>
                          Сумма экономии
                        </span>
                        <TextField
                          defaultValue={el.saving}
                          value={
                            inputValue[0] === id ? inputValue[1] : el.saving
                          }
                          onChange={(e) => {
                            setInputValue([id, e.target.value]);
                            setSavingId(el.promo.id);
                          }}
                          sx={{
                            height: '40px',
                            marginLeft: '4px',
                            width: '70px',
                            '& > div > input': {
                              height: '40px',
                              padding: '0 8px',
                            },
                            '& > div': { height: '40px' },
                          }}
                          type="number"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid2>
            ))
          ) : (
            <Typography variant="h3">Здесь пока пусто</Typography>
          )}
        </Grid2>
      ) : (
        <CircularProgress></CircularProgress>
      )}
    </Box>
  );
};

export default PromosPage;
