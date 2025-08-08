import axios from 'axios';
import { getBackendUrl } from '@/constants/url';

export const getAddress = async (address: string) => {
  return axios.post(`${getBackendUrl}/api/address`, {
    address: address,
  });
};
