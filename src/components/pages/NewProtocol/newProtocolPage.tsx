'use client';

import NewProtocolForm from '@/components/forms/NewProtocolForm';
import ProgressBar from '@/components/ui/progressBar';
import { INewProtocol } from '@/models/Protocol';
import { getDoc } from '@/services/getDocs';
import { stepTransformationAg } from '@/utils/stepTransformation';
import { Box, Grid2, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React from 'react';

const NewProtocol = () => {
  const path = usePathname();
  const number = path.split('/')[3];
  const { data: doc } = useQuery({
    queryKey: ['doc'],
    queryFn: () => getDoc<INewProtocol>(number),
  });

  return (
    <Grid2 container sx={{ p: 2 }} spacing={1.2}>
      <Grid2 size={12}>
        <Box
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
        >
          <Typography variant="h3" marginBottom={2}>
            Протокол заседания профкома
          </Typography>
        </Box>
      </Grid2>
      <Grid2 size={8}>
        <NewProtocolForm key={doc ? doc.guid : 'new'} doc={doc} />
      </Grid2>

      <Grid2 size={4}>
        <ProgressBar
          initialSteps={
            doc?.step === 'Отказ' || doc?.step === 'Отклонено'
              ? ['Черновик', 'На согласовании', 'Отклонено']
              : ['Черновик', 'На согласовании', 'Утверждено']
          }
          steps={stepTransformationAg(String(doc?.step))}
        />
      </Grid2>
    </Grid2>
  );
};

export default NewProtocol;
