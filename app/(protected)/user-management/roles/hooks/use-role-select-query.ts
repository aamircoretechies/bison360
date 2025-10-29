import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

// Custom hook to use roles for selection
export const useRoleSelectQuery = () => {
  // Fetch roles for selection
  const fetchRoleList = async () => {
    try {
      const response = await apiFetch('/api/user-management/roles/select');

      if (!response.ok) {
        toast.error(
          'Something went wrong while loading the records. Please try again.',
          {
            position: 'top-center',
          },
        );
        // Return empty array on error instead of throwing
        return [];
      }

      const data = await response.json();
      // Ensure we always return an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error(
        'Something went wrong while loading the records. Please try again.',
        {
          position: 'top-center',
        },
      );
      // Return empty array on error
      return [];
    }
  };

  return useQuery({
    queryKey: ['user-role-select'],
    queryFn: fetchRoleList,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};
