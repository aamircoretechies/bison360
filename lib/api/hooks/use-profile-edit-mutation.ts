import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileEditService } from '../profile-edit-service';
import { ProfileEditRequest, ProfileEditResponse } from '../types';
import { toast } from 'sonner';

export const useProfileEditMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileEditResponse, Error, ProfileEditRequest>({
    mutationFn: async (profileData: ProfileEditRequest) => {
      try {
        return await ProfileEditService.updateProfile(profileData);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to update profile. Please try again.',
          {
            position: 'top-center',
          },
        );
        throw error; // Re-throw to let React Query handle error state
      }
    },
    onSuccess: (data) => {
      // Show success message
      toast.success(data.message || 'Profile updated successfully', {
        position: 'top-center',
      });

      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      // Error handling is done in mutationFn, but we can add additional handling here if needed
      console.error('Profile edit mutation error:', error);
    },
  });
};
