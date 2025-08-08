import { useRouter } from 'next/navigation';
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import {
  TypeUseFetchList,
  useFetchList,
} from '@/services/universal/fetch-list';

import { getBackendUrl } from '@/constants/url';
import { getHeaders } from '@/utils/axios';

import { IFormNews } from '@/models/News';
import { IOptionValue } from '@/models/Option';
import { ITradeUnion } from '@/models/TradeUnion';

interface PropsGetNewsOne {
  code?: string;
}
export const useFetchNewsOne = ({ code }: PropsGetNewsOne) => {
  const queryClient = useQueryClient();
  const queryKey = `news-one-${code}`;

  const { data: info, isLoading } = useQuery({
    queryKey: [`news-one-${code}`],
    queryFn: async () =>
      axios.get<IFormNews>(`${getBackendUrl}/api/private/news/${code}`, {
        headers: {
          ...(await getHeaders()),
        },
      }),
    select: (data) => data.data,
    refetchOnMount: 'always',
  });

  const clear = () => queryClient.removeQueries({ queryKey: [queryKey] });
  return { data: info, isLoading, clear };
};

interface PropsNewsList {
  /** Default is infinity */
  type?: TypeUseFetchList;
  prename?: string;
  perPage?: number;
  status?: IOptionValue | null;
}
export const useFetchNewsList = (
  { type, prename, perPage, status }: PropsNewsList = { perPage: 15 },
) => {
  return useFetchList<IFormNews>({
    type,
    name: `${prename ? `${prename}-` : ''}news-list`,
    api: '/api/private/news',
    params: {
      itemsPerPage: perPage,
      status,
    },
  });
};

export const useForm = () => {
  const router = useRouter();

  const onCancel = () => {
    router.push('/news/edit');
  };

  const mutationKey = 'news-one';
  const { mutate, isSuccess, error } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: async (data: IFormNews) => {
      try {
        if (data.code) await saveFormNews(data);
        else await addFormNews(data);
      } catch (err) {
        const error = err as AxiosError<{
          status: string;
          description: string;
        }>;
        if (error.response?.data.description.startsWith('Загрузка только')) {
          throw new Error('image');
        }
      }
    },
    onSuccess: () => {
      router.push('/news/edit');
    },
  });

  const isMutation = useIsMutating({ mutationKey: [mutationKey] });

  const onSubmit: (data: IFormNews) => Promise<void> = async (data) => {
    return mutate(data);
  };

  return { onCancel, onSubmit, isSuccess, isLoading: isMutation > 0, error };
};

export const addFormNews = async (data: IFormNews) => {
  return axios.post(
    `${getBackendUrl}/api/private/news`,
    generateFormData(data),
    {
      headers: {
        ...(await getHeaders()),
      },
    },
  );
};

export const saveFormNews = async (data: IFormNews) => {
  return axios.post(
    `${getBackendUrl}/api/private/news/${data.code}`,
    generateFormData(data),
    {
      headers: {
        ...(await getHeaders()),
      },
    },
  );
};

export const pathNewsOne = async (
  code: string,
  data: { [key: string]: string | number | boolean },
) => {
  return axios.patch(`${getBackendUrl}/api/private/news/${code}`, data, {
    headers: {
      ...(await getHeaders()),
    },
  });
};

export const deleteFormNews = async (data: IFormNews) => {
  return axios.delete(`${getBackendUrl}/api/private/news/${data.code}`, {
    headers: {
      ...(await getHeaders()),
    },
  });
};

const generateFormData = (data: IFormNews) => {
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('preview', data.preview);
  formData.append('text', data.text);
  formData.append('date', data.date);
  formData.append('status', data.status);
  formData.append('isActive', String(data.isActive == true));
  formData.append('isMain', String(data.isMain == true));
  data.tradeunions?.forEach((el) => formData.append('tradeunions[]', el));

  if (typeof data.image == 'object') {
    formData.append('image', data.image as Blob);
  }

  return formData;
};

export const canEditNews = (data: IFormNews, tuOwner: ITradeUnion) => {
  if (tuOwner == null) return false;
  if (data == null) return false;
  if (data.tradeunions == null) return false;
  if (data.tradeunions.length == 0) return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.tradeunions[0] as any).guid == tuOwner.guid;
};
