import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileDeleteService } from '../profile-delete-service';
import { ProfileDeleteRequest, ProfileDeleteResponse } from '../types';
import { toast } from 'sonner';

export const useProfileDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileDeleteResponse, Error, ProfileDeleteRequest>({
    mutationFn: async (deleteData: ProfileDeleteRequest) => {
      try {
        return await ProfileDeleteService.deleteProfile(deleteData);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to delete profile. Please try again.',
          {
            position: 'top-center',
          },
        );
        throw error; // Re-throw to let React Query handle error state
      }
    },
    onSuccess: (data) => {
      // Show success message
      toast.success(data.message || 'Profile deleted successfully', {
        position: 'top-center',
      });

      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      // Error handling is done in mutationFn, but we can add additional handling here if needed
      console.error('Profile delete mutation error:', error);
    },
  });
};
