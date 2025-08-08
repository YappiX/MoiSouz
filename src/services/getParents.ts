import { getBackendUrl } from '@/constants/url';
import { getHeaders } from '@/utils/axios';
import axios from 'axios';

export const getParents = async () => {
  const response = await axios.get(
    `${getBackendUrl}/api/organizations?page=1&itemsPerPage=30`,
    {
      headers: { ...(await getHeaders()) },
    },
  );

  return response;
};
