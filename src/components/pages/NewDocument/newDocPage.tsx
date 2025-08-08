'use client';

import NewDocumentForm from '@/components/forms/NewDocumentForm';
import { Icon } from '@/components/ui';
import ProgressBar from '@/components/ui/progressBar';
import { INewDoc } from '@/models/Doc';
import { getDoc } from '@/services/getDocs';
import { stepTransformationAg } from '@/utils/stepTransformation';
import { Box, Button, Grid2, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NewDocument = () => {
  const path = usePathname();
  const number = path.split('/')[3];

  const { data: doc } = useQuery({
    queryKey: ['doc'],
    queryFn: () => getDoc<INewDoc>(number),
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
            Повестка заседания Профкома
          </Typography>
          {doc && (
            <Link href={`/new_protocol?agenda=${doc.guid}`}>
              <Button variant="contained">
                <Icon
                  name={'newDoc'}
                  color="#ffffff"
                  sx={{ marginRight: '6px' }}
                ></Icon>
                Создать протокол
              </Button>
            </Link>
          )}
        </Box>
      </Grid2>
      <Grid2 size={8}>
        <NewDocumentForm doc={doc} guid={number} />
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

export default NewDocument;
