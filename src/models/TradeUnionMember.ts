export interface ITradeUnionMember {
  documentDate?: string;
  documentNumber?: string;
  data: {
    lastName: string;
    firstName: string;
    middleName?: string | null;
    inviteDate: string;
    position: string;
    isActive?: boolean;
    percents?: number;
  };
  tradeunion: number;
  id?: number | null;
}
