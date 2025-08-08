import axios from 'axios';
import { getBackendUrl } from '@/constants/url';
import { getHeaders } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { ITradeUnion } from '@/models/TradeUnion';
import { IResponseList } from '@/models/Response';
import { IFormColleagueProfile } from '@/models/Colleague';

export const useFetchTUOwner = () => {
  const { data: info } = useQuery({
    queryKey: ['tradeunion-owner'],
    queryFn: async () =>
      axios.get<ITradeUnion>(`${getBackendUrl}/api/private/tradeunion-owner`, {
        headers: {
          ...(await getHeaders()),
        },
      }),
    select: (data) => data.data,
    refetchOnMount: 'always',
  });
  return info;
};

interface Props {
  page?: number;
  perPage?: number;
}
export const useFetchTUs = (
  { page, perPage }: Props = { page: 1, perPage: 30 },
) => {
  const { data: info } = useQuery({
    queryKey: ['tradeunions'],
    queryFn: async () =>
      axios.get<IResponseList<ITradeUnion[]> | undefined>(
        `${getBackendUrl}/api/private/tradeunions?page=${page}&itemsPerPage=${perPage}`,
        {
          headers: {
            ...(await getHeaders()),
          },
        },
      ),
    select: (data) => data.data,
    refetchOnMount: 'always',
  });
  return info;
};

export const useFetchUserTUs = () => {
  const { data: info } = useQuery({
    queryKey: ['user-tradeunions'],
    queryFn: async () =>
      axios.get<ITradeUnion[]>(
        `${getBackendUrl}/api/private/user-tradeunions`,
        {
          headers: {
            ...(await getHeaders()),
          },
        },
      ),
    select: (data) => data.data,
    refetchOnMount: 'always',
  });
  return info;
};

interface PropsFetchTUUsers {
  guid: string;
}
export const useFetchTUUsers = ({ guid }: PropsFetchTUUsers) => {
  const {
    data: info,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [`tradeunion-users-${guid}`],
    queryFn: async () =>
      axios.get<IFormColleagueProfile[]>(
        `${getBackendUrl}/api/private/tradeunion-users?guid=${guid}`,
        {
          headers: {
            ...(await getHeaders()),
          },
        },
      ),
    select: (data) => data.data,
    refetchOnMount: 'always',
    enabled: !!guid,
  });
  return { data: info, loading: isFetching, refetch };
};

export const saveFormTUUsers = async (
  file: string | object | null | undefined,
) => {
  if (typeof file != 'object') return null;

  const formData = new FormData();
  formData.append('upload', file as Blob);

  return axios.post(
    `${getBackendUrl}/api/private/tradeunion-import`,
    formData,
    {
      headers: {
        ...(await getHeaders()),
      },
    },
  );
};
