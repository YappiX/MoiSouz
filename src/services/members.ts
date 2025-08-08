import { getBackendUrl } from '@/constants/url';
import { IFormColleagueProfile } from '@/models/Colleague';
import { getHeaders } from '@/utils/axios';
import axios from 'axios';

export const getMembers = async () => {
  const response = await axios.get<IFormColleagueProfile[]>(
    `${getBackendUrl}/api/private/tradeunion-users`,
    {
      headers: { ...(await getHeaders()) },
    },
  );

  return response;
};
