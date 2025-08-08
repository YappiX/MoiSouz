import axios from 'axios';
import { getBackendUrl } from '@/constants/url';
import { getHeaders } from '@/utils/axios';

export const getTariffs = async () => {
  return axios.get(`${getBackendUrl}/api/tariffs`);
};

export const sendTariffs = async (id: number | undefined) => {
  if (id)
    return axios.post(
      `${getBackendUrl}/api/private/tradeunion-tariff`,
      { tariff: id },
      {
        headers: {
          ...(await getHeaders()),
        },
      },
    );
};
