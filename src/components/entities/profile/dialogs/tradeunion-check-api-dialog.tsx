'use client';

import React, { FC, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';

import {
  TradeunionCheckDialog,
  TradeunionCheckHasDocumentDialog,
  TradeunionCheckWaitDocumentDialog,
} from '@/components/entities/profile';

import { getDocs } from '@/services/getDocs';

import { IDoc } from '@/models/Doc';

interface Props {
  open: boolean;
  setOpen?: (tf: boolean) => void;
}

export const TradeunionCheckDocumentDialog: FC<Props> = ({ open, setOpen }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: docs, isLoading } = useQuery({
    queryKey: ['docs'],
    queryFn: getDocs,
    select: (data) => data,
  });

  const document = useMemo(
    () => docs?.find((el) => el.documentType == 'AM'),
    [docs],
  );

  if (isLoading == true) return null;

  if (document != null) {
    if ((document as IDoc).status == 'NEW') {
      return (
        <TradeunionCheckHasDocumentDialog
          open={open}
          setOpen={setOpen}
          guidDocument={document.guid as string}
        />
      );
    }

    if (pathname == '/documents' && searchParams.has('outgoing')) return null;
    return <TradeunionCheckWaitDocumentDialog open={open} setOpen={setOpen} />;
  }

  return <TradeunionCheckDialog open={open} setOpen={setOpen} />;
};
