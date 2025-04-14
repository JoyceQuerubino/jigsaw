import { useQuery } from '@tanstack/react-query';
import { reactQueryConsts } from './reactQueryConstantes';
import { getGamesReady } from '../services/storage-services';

export const useGetGames = () => {

  return useQuery({
    queryKey: [reactQueryConsts.LIST_GAMES],
    queryFn: async () => {
        const games = getGamesReady();

      return games || [];
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });
};å