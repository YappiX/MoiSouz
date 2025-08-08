export interface IFormProfile {
  firstName: string;
  lastName: string;
  middleName?: string | null;
  birthdate: string;
  gender: string;
  education: string;
  avatar: object;
  profession: string[];
  position: string[];
  address: {
    postcode: string;
    region: string;
    municipal?: string | null;
    locality: string;
    street: string;
    house: string;
    flat?: string;
  };
  phone: string;
  phoneDop?: string | null;
  children?: {
    name: string;
    gender: string;
    birthdate: string;
  }[];
  hobbies: number[];
  isActive: boolean;
}

export interface IFormFeedback {
  title: string;
  message?: string;
  email?: string;
}
