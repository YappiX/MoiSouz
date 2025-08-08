'use client';

import axios from 'axios';

import { getBackendUrl } from '@/constants/url';
import { getHeaders } from '@/utils/axios';
import { useFetchList } from './universal/fetch-list';

import { IBenefitsProduct } from '@/models/Benefits';
import { IOption } from '@/models/Option';

interface PropsUseFetchBenefitsProducts {
  perPage?: number;
  category?: number | null;
  q?: string | null;
  city?: string | null;
}
export const useFetchBenefitsProducts = ({
  //perPage,
  category,
  q,
  city,
}: PropsUseFetchBenefitsProducts) => {
  return useFetchList<IBenefitsProduct>({
    name: 'benefits-products',
    api: '/api/private/discounts',
    params: {
      //perPage: perPage,
      category: category || null,
      q: q || null,
      city: city || null,
    },
    convertParams: (params) => ({
      ...params,
      city: params.city ? (JSON.parse(params.city) as IOption).title : null,
    }),
    type: 'page',
    hasMore: (meta) => meta.current_page < meta.last_page,
    getTotal: (meta) => meta.total,
  });
};

export const getBenefitsProduct = async (id: string) => {
  const response = await axios.get(
    `${getBackendUrl}/api/private/discount/${id}`,
    {
      headers: { ...(await getHeaders()) },
    },
  );

  return response;
};

export const getBenefitsCategories = async () => {
  const response = await axios.get(
    `${getBackendUrl}/api/private/discount_categories`,
    {
      headers: { ...(await getHeaders()) },
    },
  );

  return response;
};

export const getBenefitsProductPromo = async (id: string) => {
  const response = await axios.get(
    `${getBackendUrl}/api/private/discount/${id}/promo`,
    {
      headers: { ...(await getHeaders()) },
    },
  );

  return response;
};

export const getBenefitsProductPromos = async () => {
  const response = await axios.get(`${getBackendUrl}/api/private/promos`, {
    headers: { ...(await getHeaders()) },
  });

  return response;
};
