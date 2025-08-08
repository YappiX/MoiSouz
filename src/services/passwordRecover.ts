import axios from 'axios';
import { getBackendUrl } from '@/constants/url';

export const sendEmail = async (email: string) => {
  return axios.post(`${getBackendUrl}/api/recover`, {
    email: email,
  });
};

export const sendToken = async (token: string) => {
  return axios.post(`${getBackendUrl}/api/confirm/recover/`, {
    token: token,
  });
};

export const sendPassword = async (token: string, pass: string) => {
  return axios.post(`${getBackendUrl}/api/confirm/password/`, {
    token: token,
    password: pass,
  });
};
