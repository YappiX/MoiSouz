import axios, { AxiosError } from 'axios';

import { getHeaders } from '@/utils/axios';

import { useRouter } from 'next/navigation';
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { getBackendUrl } from '@/constants/url';

import { IFormColleagueProfile } from '@/models/Colleague';
import { IDoc } from '@/models/Doc';

export const useForm = () => {
  const router = useRouter();

  const onCancel = () => {
    router.push('/colleagues');
  };

  const mutationKey = 'colleague-profile';
  const { mutate, isSuccess, error } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: async (data: IFormColleagueProfile) => {
      try {
        let guid = data.guid || '';
        if (guid) await saveFormColleagueProfile(data);
        else guid = (await addFormColleagueProfile(data)).data.guid || '';
        await uploadColleagueProfileReasonFile(guid, data.reasonFile);
      } catch (err) {
        const error = err as AxiosError<{
          status: string;
          description: string;
        }>;
        if (
          error.response?.data?.description?.startsWith(
            'Пользователь с эл. почтой',
          )
        ) {
          throw new Error('email');
        }
      }
    },
    onSuccess: () => {
      router.push('/colleagues');
    },
  });

  const isMutation = useIsMutating({ mutationKey: [mutationKey] });

  const onSubmit: (data: IFormColleagueProfile) => Promise<void> = async (
    data,
  ) => mutate(data);

  return { onCancel, onSubmit, isSuccess, isLoading: isMutation > 0, error };
};

export const useFetchColleagueProfile = (guid: string) => {
  const queryClient = useQueryClient();
  const queryKey = `colleague-profile-${guid}`;

  const {
    data: info,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: async () =>
      axios.get<IFormColleagueProfile>(
        `${getBackendUrl}/api/private/tradeunion-user/${guid}`,
        {
          headers: {
            ...(await getHeaders()),
          },
        },
      ),
    select: (data) => data.data,
    refetchOnMount: 'always',
  });
  const clear = () => queryClient.removeQueries({ queryKey: [queryKey] });
  return { data: info, isLoading, refetch, clear };
};

export const uploadColleagueProfileReasonFile = async (
  guid: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any,
) => {
  if (typeof file != 'object') {
    return null;
  }

  const formData = new FormData();
  formData.append('reasonfile', file);

  return axios.post<IFormColleagueProfile>(
    `${getBackendUrl}/api/private/tradeunion-user-reasonfile/${guid}`,
    formData,
    {
      headers: {
        ...(await getHeaders()),
      },
    },
  );
};

export const addFormColleagueProfile = async (data: IFormColleagueProfile) => {
  return axios.post<IFormColleagueProfile>(
    `${getBackendUrl}/api/private/tradeunion-user`,
    data,
    {
      headers: {
        ...(await getHeaders()),
      },
    },
  );
};

export const saveFormColleagueProfile = async (data: IFormColleagueProfile) => {
  return axios.put<IFormColleagueProfile>(
    `${getBackendUrl}/api/private/tradeunion-user/${data.guid}`,
    data,
    {
      headers: {
        ...(await getHeaders()),
      },
    },
  );
};

export const deleteColleagueProfile = async (data: IFormColleagueProfile) => {
  return axios.delete<IFormColleagueProfile>(
    `${getBackendUrl}/api/private/tradeunion-user/${data.guid}`,
    {
      headers: {
        ...(await getHeaders()),
      },
    },
  );
};

const getProtocols = async () => {
  return axios.get<IDoc[]>(
    `${getBackendUrl}/api/private/documents?documentType[]=PR`,
    {
      headers: {
        ...(await getHeaders()),
      },
    },
  );
};

export const useProtocols = () => {
  const { data } = useQuery({
    queryKey: [`colleagues-protocols`],
    queryFn: () => getProtocols(),
    select: (data) => data.data,
  });

  return { data };
};
