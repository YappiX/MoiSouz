import { getBackendUrl } from '@/constants/url';
import { getHeaders } from '@/utils/axios';
import axios from 'axios';

export const getMyTU = async () => {
  const response = await axios.get(
    `${getBackendUrl}/api/private/tradeunion-owner`,
    {
      headers: { ...(await getHeaders()) },
    },
  );

  return response;
};
