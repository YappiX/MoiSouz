'use client';
import TradeUnionMemberForm from '@/components/forms/TradeUnionMemberForm';
import { Grid2, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ProfilePage from '../Profile/Profile';
import ProgressBar from '@/components/ui/progressBar';
import { useFetchProfile } from '@/hooks/useFetchProfile';
import { usePathname } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { getDoc } from '@/services/getDocs';
import { stepTransformation } from '@/utils/stepTransformation';
import { IDoc } from '@/models/Doc';

const TradeUnionMemberPage = () => {
  const [steps, setSteps] = useState<number>(1);
  const { info } = useFetchProfile();
  const path = usePathname();
  const number = path.split('/')[3];

  const { data: doc, isLoading } = useQuery({
    queryKey: ['doc'],
    queryFn: () => getDoc<IDoc>(number),
    select: (data) => data,
  });

  useEffect(() => {
    if (!!info?.phone || info?.ROLES?.includes('ROLE_TRADEUNION')) {
      setSteps(2);
    }
  }, [info]);
  return (
    <Grid2 container spacing={1.2}>
      {steps === 1 ? (
        <Grid2 size={doc?.step ? 8 : 12}>
          <ProfilePage
            stepTitle="Необходимо заполнить анкету профиля"
            setSteps={setSteps}
          />
        </Grid2>
      ) : (
        <Grid2 size={doc?.step ? 8 : 12}>
          <Typography variant="h3" marginBottom={2} pt={3}>
            Форма заявления на вступление в профсоюз
          </Typography>
          <TradeUnionMemberForm doc={doc} />
        </Grid2>
      )}
      <Grid2 size={4}>
        {doc?.step && !isLoading && (
          <ProgressBar
            initialSteps={
              doc?.step === 'Отказ' || doc?.step === 'Отклонено'
                ? [
                    'Ожидает отправки',
                    'Отправлено в профсоюз',
                    'На проверке профсоюзом',
                    'Отказ',
                  ]
                : [
                    'Ожидает отправки',
                    'Отправлено в профсоюз',
                    'На проверке профсоюзом',
                    'Решение положительное, ожидает передачи оригинала в профсоюз',
                    'Оригинал получен',
                  ]
            }
            steps={stepTransformation(String(doc?.step))}
            decision={doc?.step === 'Отказ'}
          />
        )}
      </Grid2>
    </Grid2>
  );
};

export default TradeUnionMemberPage;
