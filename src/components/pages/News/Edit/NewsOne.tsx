'use client';

import React, { Suspense, useEffect, useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  Box,
  Button,
  CircularProgress,
  Grid2,
  Typography,
} from '@mui/material';

import { Icon } from '@/components/ui';
import { NewsForm } from '@/components/forms/NewsForm';

import { useFetchProfile } from '@/hooks/useFetchProfile';
import { canEditNews, useFetchNewsOne, useForm } from '@/hooks/useNews';
import { useFetchTUOwner } from '@/hooks/useTU';

import { IFormNews } from '@/models/News';
import { ITradeUnion } from '@/models/TradeUnion';

const NewsEditOneWrapper = () => {
  const params = useParams();
  const pathname = usePathname();
  const isCreate = pathname.endsWith('/create');

  const tuOwner = useFetchTUOwner();
  const { info } = useFetchProfile();

  const {
    data: newsOne,
    isLoading: isLoadingNewsOne,
    clear: clearNewsOne,
  } = useFetchNewsOne({ code: (params.code as string) || '' });

  const { onCancel, onSubmit, isLoading: isLoadingForm, error } = useForm();
  const errors = useMemo(() => {
    switch (error?.message) {
      case 'image':
        return { image: 'Загрузка только png, jpg, jpeg, не более 2МБ' };
    }
    return null;
  }, [error]);

  useEffect(() => {
    if (isCreate) return;
    return () => clearNewsOne();
  }, []);

  const canEdit = useMemo(
    () => canEditNews(newsOne as IFormNews, tuOwner as ITradeUnion),
    [newsOne, tuOwner],
  );

  if (isCreate != true && canEdit == false) return null;
  if (info == null || info?.hasTradeunionOwner == false) return null;
  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      <Link href="/news/edit">
        <Button
          variant="text"
          sx={{
            width: 'fit-content',
            gap: 0.5,
            textDecoration: 'underline',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <Icon name="arrow-back" color="black" />
          назад к списку новостей
        </Button>
      </Link>

      {info != null && (isCreate == true || isLoadingNewsOne == false) ? (
        <>
          {info?.hasTradeunionOwner == true ? (
            <Grid2 sx={{ width: '100%', maxWidth: '700px' }} size={5}>
              <NewsForm
                onCancel={onCancel}
                onSubmit={onSubmit}
                defaultValues={isCreate ? null : newsOne}
                loading={isLoadingForm}
                errorsExtra={errors}
              />
            </Grid2>
          ) : (
            <Typography fontSize={14} textAlign="center">
              Не удалось выполнить операцию
            </Typography>
          )}
        </>
      ) : (
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

const NewsEditOnePage = () => {
  return (
    <Suspense>
      <NewsEditOneWrapper />
    </Suspense>
  );
};

export default NewsEditOnePage;
