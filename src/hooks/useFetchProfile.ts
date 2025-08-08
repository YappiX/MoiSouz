import axios from 'axios';
import { getBackendUrl } from '@/constants/url';
import { getHeaders } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { User } from 'next-auth';

export const useFetchProfile = () => {
  const {
    data: info,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () =>
      axios.get<User>(`${getBackendUrl}/api/private/profile`, {
        headers: {
          ...(await getHeaders()),
        },
      }),
    select: (data) => data.data,
    refetchOnMount: 'always',
  });
  return { info, refetch, isLoading };
};
