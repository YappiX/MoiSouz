'use client';

import { useFetchProfile } from '@/hooks/useFetchProfile';
import { Grid2, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ProfilePage from '../Profile/Profile';
import MembershipForm from '@/components/forms/MembershipForm';

const TradeUnionConfirmMembershipPage = () => {
  const [steps, setSteps] = useState<number>(1);
  const { info } = useFetchProfile();

  useEffect(() => {
    if (!!info?.phone) {
      setSteps(2);
    }
  }, [info]);
  return (
    <Grid2 container spacing={1.2}>
      {steps === 1 ? (
        <Grid2 size={12}>
          <ProfilePage
            stepTitle="Необходимо заполнить анкету профиля"
            setSteps={setSteps}
          />
        </Grid2>
      ) : (
        <Grid2 size={8}>
          <Typography variant="h3" marginBottom={2} pt={3}>
            Выберите Профсоюз, участником которого являетесь
          </Typography>
          <MembershipForm />
        </Grid2>
      )}
    </Grid2>
  );
};

export default TradeUnionConfirmMembershipPage;
