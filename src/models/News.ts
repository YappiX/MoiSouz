export interface IFormNews {
  id?: number;
  code?: string;
  title: string;
  preview: string;
  text: string;
  date: string;
  image: object | string;
  status: string;
  isActive?: boolean | null;
  isMain?: boolean | null;
  tradeunions?: string[] | null;
}
