import { ISignin } from '@/models/Signin';
import axios from 'axios';

export const loginFn = async (credentials: ISignin) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login_check`,
    {
      ...credentials,
    },
  );

  return response;
};
