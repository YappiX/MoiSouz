import { useQuery } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import axios from 'axios';

import { getBackendUrl } from '@/constants/url';
import { IOption, IOptionsResponse } from '@/models/Option';

enum NAMES {
  hobbies = 'hobbies',
  cities = 'cities',
}

interface PropsGetOptions {
  name: NAMES;
  params?: { [key: string]: string | number };
}
const getOptions = async <T>({ name, params = {} }: PropsGetOptions) => {
  const session = await getSession();

  const result = new URLSearchParams();
  result.append('itemsPerPage', String(1000));
  Object.keys(params).forEach((el) => result.append(el, String(params[el])));
  const search = result.toString();

  return axios.get<T>(`${getBackendUrl}/api/${name}?${search}`, {
    headers: { Authorization: `Bearer ${session?.user?.token}` },
  });
};

interface PropsUseOptions {
  name: string;
  params?: { [key: string]: string | number };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convert?: (value: any) => IOption;
}
export const useOptions = ({ name, params, convert }: PropsUseOptions) => {
  const { data, isFetching } = useQuery({
    queryKey: [`options/${name}`, params],
    queryFn: () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getOptions<IOptionsResponse<any>>({
        name: name as NAMES,
        params,
      }),
    select: (data) => ({
      ...data.data,
      data: convert ? data.data.data.map((el) => convert(el)) : data.data.data,
    }),
  });

  return {
    data: data && {
      ...data,
      data: data?.data as IOption[],
    },
    loading: isFetching,
  };
};
