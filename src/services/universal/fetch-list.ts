'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getBackendUrl } from '@/constants/url';
import { getHeaders } from '@/utils/axios';

export type TypeUseFetchList = 'infinity' | 'page';

interface PropsUseFetchList {
  name: string;
  api: string;
  /** Default is infinity */
  type?: TypeUseFetchList;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasMore?: (meta: any) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTotal?: (meta: any) => number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: { [key: string]: any };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convertParams?: (params: { [key: string]: any }) => { [key: string]: any };
}
export const useFetchList = <T>({
  name,
  api,
  type = 'infinity',
  params = {},
  convertParams,
  hasMore,
  getTotal,
}: PropsUseFetchList) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getPageFromQuery = () => {
    const _params = new URLSearchParams(searchParams.toString());
    return parseInt(_params.get('page') || '1');
  };

  const [result, setResult] = useState<{
    page: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: { [key: string]: any };
    hasMore: boolean;
    total: number;
    data: T[];
  }>({ page: getPageFromQuery(), params, hasMore: false, total: 0, data: [] });

  const { data, isFetching, refetch } = useQuery({
    queryKey: [name, result.page, JSON.stringify(result.params)],
    queryFn: async () =>
      await getList({
        api,
        page: result.page,
        params: convertParams ? convertParams(params) : params,
      }),
    select: (data) => data.data,
  });

  // save params to query - change page
  useEffect(() => {
    const from = searchParams.toString();
    const _params = new URLSearchParams(searchParams.toString());

    _params.set('page', String(result.page));

    Object.keys(params)
      .filter((el) => params[el] != null)
      .forEach((el) => _params.set(el, String(params[el])));

    const to = _params.toString();
    if (from == to) return;
    router.push(`?${to}`, { scroll: false });
  }, [result.page]);

  useEffect(() => {
    if (data == null) return;

    if (JSON.stringify(result.params) != JSON.stringify(params)) {
      setResult({
        page: 1, //getPageFromQuery(),
        params,
        data: [],
        hasMore: false,
        total: 0,
      });
    } else {
      let dataNew = [];
      switch (type) {
        case 'infinity':
          dataNew = [
            ...result.data,
            ...data.data.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (el: T | any) => !result.data.some((el2: any) => el.id == el2.id),
            ),
          ];
          break;
        case 'page':
          dataNew = [...data.data];
          break;
      }
      if (JSON.stringify(result.data) != JSON.stringify(dataNew)) {
        setResult({
          ...result,
          data: [...dataNew],
          hasMore: data.meta
            ? hasMore
              ? hasMore(data.meta)
              : data.meta.currentPage * data.meta.itemsPerPage <
                data.meta.totalItems
            : false,
          total: data.meta
            ? getTotal
              ? getTotal(data?.meta || {})
              : data?.meta.totalItems
            : 0,
        });
      }
    }
  }, [result, data, params]);

  const loadPrev = () => {
    if (result == null) return;
    setResult({
      ...result,
      page: result.page ? Math.max(1, result.page - 1) : 1,
    });
  };

  const loadNext = () => {
    if (result == null) return;
    setResult({
      ...result,
      page: result.page ? result.page + 1 : 1,
    });
  };

  return {
    data: {
      data: result.data || [],
      isFetching,
      page: result.page,
      total: result.total,
      hasMore: result.hasMore,
      empty: result.total == 0,
    },
    actions: {
      loadPrev,
      loadNext,
      refetch,
    },
  };
};

interface PropsGetList {
  api?: string;
  page?: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: { [key: string]: any };
}
const getList = async ({ api, page, params }: PropsGetList = {}) => {
  const response = await axios.get(`${getBackendUrl}${api}`, {
    headers: { ...(await getHeaders()) },
    params: { page, ...params },
  });

  return response;
};
