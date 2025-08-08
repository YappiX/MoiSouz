'use client';

import { getSession } from 'next-auth/react';

interface PropsGetHeaders {
  Authorization: string;
}

export const getHeaders = async (): Promise<PropsGetHeaders> => {
  const session = await getSession();

  return { Authorization: `Bearer ${session?.user?.token}` };
};
