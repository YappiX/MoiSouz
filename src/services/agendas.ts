import { getBackendUrl } from '@/constants/url';

import { INewDoc } from '@/models/Doc';
import { getHeaders } from '@/utils/axios';
import axios from 'axios';

export const getAgendas = async () => {
  const response = await axios.get<INewDoc[]>(
    `${getBackendUrl}/api/private/documents?documentType[]=AG`,
    {
      headers: { ...(await getHeaders()) },
    },
  );

  return response;
};
