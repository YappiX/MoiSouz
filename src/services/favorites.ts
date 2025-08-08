'use client';

import axios from 'axios';

import { getBackendUrl } from '@/constants/url';
import { getHeaders } from '@/utils/axios';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FavoriteType, IFavorite, IFavoriteSend } from '@/models/Favorites';

export const useFetchFavorites = ({ type }: { type?: FavoriteType } = {}) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: [`favorite-${type}`],
    queryFn: () => getFavorites(),
    select: (data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = data?.data.map((el: any) => ({
        ...el,
        data: JSON.parse(el.data),
      })) as IFavorite[];
      return result.filter((el) => type == null || el.data.type == type);
    },
  });
  return { data: { data, isLoading: isFetching }, actions: { refetch } };
};

export const getFavorites = async () => {
  try {
    const response = await axios.get(`${getBackendUrl}/api/private/favorite`, {
      headers: { ...(await getHeaders()) },
    });
    return response;
  } catch {}
  return null;
};

export const useFavorite = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const add = async (data: IFavoriteSend) => {
    setIsLoading(true);
    await addFavorite(data);
    setIsLoading(false);
  };

  const remove = async (id: number) => {
    setIsLoading(true);
    await deleteFavorite(id);
    setIsLoading(false);
  };

  return { data: { isLoading }, actions: { add, remove } };
};

export const addFavorite = async (data: IFavoriteSend) => {
  try {
    const response = await axios.post(
      `${getBackendUrl}/api/private/favorite`,
      {
        ...data,
        data: JSON.stringify(data.data),
      },
      {
        headers: { ...(await getHeaders()) },
      },
    );
    return response;
  } catch {}
  return null;
};

export const deleteFavorite = async (favoriteId: number) => {
  try {
    const response = await axios.delete(
      `${getBackendUrl}/api/private/favorite/${favoriteId}`,
      {
        headers: { ...(await getHeaders()) },
      },
    );
    return response;
  } catch {}
  return null;
};
