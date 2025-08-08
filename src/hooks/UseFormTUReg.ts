import axios from 'axios';

import { getHeaders } from '@/utils/axios';
import { getBackendUrl } from '@/constants/url';
import { ITradeUnion } from '@/models/TradeUnion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveAvatar = async (file: any) => {
  if (typeof file != 'object') {
    return null;
  }

  const formData = new FormData();
  formData.append('avatar', file);

  return axios.post<ITradeUnion>(
    `${getBackendUrl}/api/private/tradeunion-logo`,
    formData,
    {
      headers: {
        ...(await getHeaders()),
      },
    },
  );
};

export const registration = async (data: ITradeUnion) => {
  return axios.post<ITradeUnion>(
    `${getBackendUrl}/api/private/tradeunion-owner`,
    data,
    {
      headers: {
        ...(await getHeaders()),
      },
    },
  );
};
