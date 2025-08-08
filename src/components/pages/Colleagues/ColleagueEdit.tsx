'use client';

import React, { Suspense, useEffect, useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

import { Box, Button, CircularProgress, Typography } from '@mui/material';

import { Icon } from '@/components/ui';
import { ColleagueForm } from '@/components/forms/ColleagueForm';

import { useFetchProfile } from '@/hooks/useFetchProfile';
import {
  useFetchColleagueProfile,
  useForm,
} from '@/hooks/UseFormColleagueProfile';

const ColleagueEditWrapper = () => {
  const params = useParams();
  const pathname = usePathname();
  const isCreate = pathname.endsWith('/create');

  const { info } = useFetchProfile();

  const {
    data: user,
    isLoading: isLoadingUser,
    clear: clearUser,
  } = useFetchColleagueProfile((params.guid as string) || '');

  const { onCancel, onSubmit, isLoading: isLoadingForm, error } = useForm();
  const errors = useMemo(() => {
    switch (error?.message) {
      case 'email':
        return { email: 'Указанная почта уже существует' };
    }
    return null;
  }, [error]);

  useEffect(() => {
    if (isCreate) return;
    return () => clearUser();
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      <Link href="/colleagues">
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
          назад к списку коллег
        </Button>
      </Link>

      {info != null && (isCreate == true || isLoadingUser == false) ? (
        <>
          {info?.hasTradeunionOwner == true ? (
            <ColleagueForm
              onCancel={onCancel}
              onSubmit={onSubmit}
              defaultValues={user}
              loading={isLoadingForm}
              errorsExtra={errors}
            />
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

const ColleagueEditPage = () => {
  return (
    <Suspense>
      <ColleagueEditWrapper />
    </Suspense>
  );
};

export default ColleagueEditPage;
