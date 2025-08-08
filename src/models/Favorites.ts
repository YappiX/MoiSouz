export type FavoriteType = 'benefits';

export interface IFavoriteSend {
  title: string;
  data: {
    /** type of favorite */
    type: FavoriteType;
    id: number;
    name?: string;
    description?: string;
    image?: string;
  };
  /** Link */
  source: string;
}

export interface IFavorite extends IFavoriteSend {
  id: number;
}
