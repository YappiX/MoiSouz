import axios from 'axios';

import { getSession } from 'next-auth/react';
import { getHeaders } from '@/utils/axios';

import { getBackendUrl } from '@/constants/url';
import { IFormFeedback } from '@/models/Forms';

export const saveFormFeedback = async (data: IFormFeedback) => {
  const session = await getSession();
  return axios.post<{ description: string; status: string }>(
    `${getBackendUrl}/api/feedback`,
    data,
    {
      headers: {
        ...(session ? await getHeaders() : {}),
      },
    },
  );
};
