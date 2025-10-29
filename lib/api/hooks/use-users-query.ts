/**
 * React Query hook for users API
 */

import { useQuery } from '@tanstack/react-query';
import { UsersService } from '../users-service';
import { UsersRequest } from '../types';

export const useUsersQuery = (params: UsersRequest = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => UsersService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
