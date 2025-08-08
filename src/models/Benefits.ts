export interface IBenefitsCategory {
  id: number;
  order: number;
  name: string;
  iconName: string;
  subcategory: {
    id: number;
    order: number;
    name: string;
  }[];
}

export interface IBenefitsProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  image_url: string;
  main_category: {
    id: number;
    order: number;
    name: string;
  };
  categories: {
    id: number;
    order: number;
    name: string;
  }[];
  cities: {
    id: number;
    name: string;
  }[];
  isFavorite: boolean;
  favoriteId?: number;
  updated_at: string;
  end: string;
}
