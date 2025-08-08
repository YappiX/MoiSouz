'use client';

import React, { Suspense, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { Box, Button, CircularProgress, Typography } from '@mui/material';

import { Icon } from '@/components/ui';
import {
  ColleagueCard,
  ColleagueCardExtended,
} from '@/components/sections/Colleagues';

import { useFetchProfile } from '@/hooks/useFetchProfile';
import { useFetchColleagueProfile } from '@/hooks/UseFormColleagueProfile';

const ColleagueShowWrapper = () => {
  const params = useParams();
  const isCreate = (params.guid as string) == 'create';

  const { info } = useFetchProfile();

  const {
    data: user,
    isLoading: isLoadingUser,
    clear: clearUser,
  } = useFetchColleagueProfile((params.guid as string) || '');

  useEffect(() => {
    if (isCreate) return;
    return () => clearUser();
  }, []);

  //if (info) info.hasTradeunionOwner = false;

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

      {info != null && isLoadingUser == false ? (
        <>
          {user ? (
            <>
              <Typography variant="h3" marginBottom={2}>
                Карточка контакта
              </Typography>
              {info?.hasTradeunionOwner ? (
                <ColleagueCardExtended user={user} />
              ) : (
                <ColleagueCard user={user} />
              )}
            </>
          ) : (
            <Typography fontSize={14} textAlign="center">
              Пользователь не найден
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

const ColleagueShowPage = () => {
  return (
    <Suspense>
      <ColleagueShowWrapper />
    </Suspense>
  );
};

export default ColleagueShowPage;
