import { useQuery } from '@tanstack/react-query';
import { reactQueryConsts } from './reactQueryConstantes';
import { getGamesReady } from '../services/storage-services';
import { GameType } from '../services/types';

export const useGetGames = () => {
  return useQuery<GameType[]>({
    queryKey: [reactQueryConsts.LIST_GAMES],
    queryFn: async () => {
      const games = await getGamesReady();
      return Array.isArray(games) ? games : [];
    },
    retry: 3,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};