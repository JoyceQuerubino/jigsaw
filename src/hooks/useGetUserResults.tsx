import { useQuery } from '@tanstack/react-query';
import { reactQueryConsts } from './reactQueryConstantes';
import { getUserResults } from '../services/user-results-service';
import { userResult } from '../services/types';

export const useGetUserResults = () => {
  return useQuery<userResult[]>({
    queryKey: [reactQueryConsts.LIST_USER_RESULTS],
    queryFn: async () => {
      const results = await getUserResults();
      return Array.isArray(results) ? results : [];
    },
    retry: 3,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}; 