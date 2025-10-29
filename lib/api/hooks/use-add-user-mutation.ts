import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddUserService } from '../add-user-service';
import { AddUserRequest, AddUserResponse } from '../types';
import { toast } from 'sonner';

export const useAddUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AddUserResponse, Error, AddUserRequest>({
    mutationFn: async (userData: AddUserRequest) => {
      try {
        return await AddUserService.addUser(userData);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to add user. Please try again.',
          {
            position: 'top-center',
          },
        );
        throw error; // Re-throw to let React Query handle error state
      }
    },
    onSuccess: (data) => {
      // Show success message
      toast.success(data.message || 'User added successfully', {
        position: 'top-center',
      });

      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      // Error handling is done in mutationFn, but we can add additional handling here if needed
      console.error('Add user mutation error:', error);
    },
  });
};
