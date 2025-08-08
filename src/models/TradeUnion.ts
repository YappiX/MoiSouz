export interface ITradeUnion {
  title: string;
  titleForDocs: string;
  creationDate: string;
  ogrn: string;
  inn?: string;
  kpp: string;
  id?: number;
  guid?: string;
  address?: {
    postcode: string;
    region: string;
    area?: string | null;
    city: string;
    street: string;
    house: string;
    flat?: string | null;
  };
  registrationDate: string;
  okato: string;
  oktmo: string;
  chairman?: {
    lastName: string;
    firstName: string;
    middleName?: string | null;
  };
  employer?: {
    lastName: string;
    firstName: string;
    middleName?: string | null;
    inn: string;
    title: string;
  };
  chairmanEmail: string;
  chairmanPhone: string;
  bank: {
    bank: string;
    rs: string;
    bik: string;
    ks: string;
  };
  email: string;
  phone: string;
  isActive: boolean;
  logo?: object | null | string;
  percents?: number;
  tradeunionOwner?: { guid: string };
  scan: object | null | string;
  participants?: object | null | string;
  children?: {
    guid: string;
    inn: string;
    title: string;
  }[];
  tuType: TtyTypes;
}

export interface ITradeUnionUploadUsersForm {
  tradeunion: number;
}

export type TtyTypes =
  | 'Первичная профсоюзная организация'
  | 'Первичная профсоюзная организация без ИНН'
  | 'Профсоюзная организация';
