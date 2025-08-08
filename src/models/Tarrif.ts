export interface ITarrif {
  title: string;
  price: string;
  priceDesc: string;
  price1: string;
  priceDesc1: string;
  list: string[];
  desc?: string | null;
  main?: boolean;
  isActive?: boolean;
  id?: number;
  handleSubmit?: (id: number | undefined) => void;
  isSuccess?: boolean;
}
