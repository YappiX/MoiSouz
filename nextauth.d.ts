import { DefaultUser } from 'next-auth';

//common interface for JWT and Session
interface IUser extends DefaultUser {
  token?: string;
  data?: IProfile;
  ROLES?: string[];
  avatar?: string;
  address?: unknown;
  birthdate?: string;
  children?: unknown;
  education?: string;
  email?: string;
  firstName?: string;
  gender?: string;
  guid?: string;
  hasTradeunionOwner?: boolean;
  hasTradeunionMember?: boolean;
  hasUserProfile?: boolean;
  hobbies?: string[];
  id?: number;
  isActive?: boolean;
  lastName?: string;
  middleName?: string;
  name?: string;
  phone?: string;
  phoneDop?: string;
  position?: string[];
  profession?: string[];
  employerTitle?: string;
  employerName?: string;
}
declare module 'next-auth' {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}
declare module 'next-auth/jwt' {
  interface JWT extends IUser {}
}
