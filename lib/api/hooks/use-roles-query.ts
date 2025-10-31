import { useQuery } from '@tanstack/react-query';
import { RolesRequest, RolesResponse } from '../types';
import RolesService from '../roles-service';

export const useRolesQuery = (params: RolesRequest) => {
  return useQuery<RolesResponse, Error>({
    queryKey: ['roles', params],
    queryFn: () => RolesService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};

