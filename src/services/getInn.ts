import axios from 'axios';
import { getBackendUrl } from '@/constants/url';

export const getInn = async (inn: string) => {
  return axios.post(`${getBackendUrl}/api/company`, {
    query: inn,
  });
};
