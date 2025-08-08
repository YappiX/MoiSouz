import { getBackendUrl } from '@/constants/url';
import { getHeaders } from '@/utils/axios';
import axios from 'axios';

export const getPdf = async (id: number) => {
  const response = await axios.get(
    `${getBackendUrl}/api/private/promo/${id}/view`,
    {
      headers: { ...(await getHeaders()) },
    },
  );

  return response;
};
