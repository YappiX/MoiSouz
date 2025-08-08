import { ISignin } from './Signin';

export interface IReg extends ISignin {
  passwordRepeat: string;
  personalData: true;
  isTradeunion?: boolean;
  parentOrganization?: string;
}
