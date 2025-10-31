import { useQuery } from '@tanstack/react-query';
import { PermissionsRequest, PermissionsResponse } from '../types';
import PermissionsService from '../permissions-service';

export const usePermissionsQuery = (params: PermissionsRequest) => {
  return useQuery<PermissionsResponse, Error>({
    queryKey: ['permissions', params],
    queryFn: () => PermissionsService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};

