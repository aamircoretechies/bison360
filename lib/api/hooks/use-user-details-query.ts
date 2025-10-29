import { useQuery } from '@tanstack/react-query';
import { UserDetailsService } from '../user-details-service';
import { UserData } from '../types';
import { toast } from 'sonner';

export const useUserDetailsQuery = (userId: string) => {
  return useQuery<UserData, Error>({
    queryKey: ['user-details', userId],
    queryFn: async () => {
      try {
        return await UserDetailsService.getUserDetails(userId);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to fetch user details. Please try again.',
          {
            position: 'top-center',
          },
        );
        throw error; // Re-throw to let React Query handle error state
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    enabled: !!userId, // Only run query if userId is provided
  });
};
