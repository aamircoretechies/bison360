'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoaderCircleIcon } from 'lucide-react';
import { UserData } from '@/lib/api/types';
import { ProfileEditService } from '@/lib/api/profile-edit-service';
import { useProfileEditMutation } from '@/lib/api/hooks/use-profile-edit-mutation';
import {
  UserProfileSchema,
  UserProfileSchemaType,
} from '../forms/user-profile-schema';

const UserProfileEditDialog = ({
  open,
  closeDialog,
  user,
}: {
  open: boolean;
  closeDialog: () => void;
  user: UserData;
}) => {
  // Get role and status options from service
  const roleOptions = ProfileEditService.getRoleOptions();
  const statusOptions = ProfileEditService.getStatusOptions();

  const form = useForm<UserProfileSchemaType>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      user_role: user?.user_role || 1,
      status: user?.user_active_inactive_blocked_status || 1,
    },
    mode: 'onSubmit',
  });

  // Profile edit mutation
  const editProfileMutation = useProfileEditMutation();

  useEffect(() => {
    if (open && user) {
      form.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        user_role: user.user_role || 1,
        status: user.user_active_inactive_blocked_status || 1,
      });
    }
  }, [open, user, form]);

  const isProcessing = editProfileMutation.isPending;

  const handleSubmit = (values: UserProfileSchemaType) => {
    editProfileMutation.mutate({
      user_id: user.user_id,
      first_name: values.first_name,
      last_name: values.last_name,
      user_role: values.user_role,
      status: values.status,
    }, {
      onSuccess: () => {
        closeDialog();
        // Redirect to users list after successful update
        window.location.href = '/user-management/users';
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent close={false}>
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {editProfileMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>{editProfileMutation.error?.message}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="user_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? String(field.value) : ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.value} value={String(role.value)}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? String(field.value) : ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={String(status.value)}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isDirty || isProcessing}
              >
                {isProcessing && <LoaderCircleIcon className="animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileEditDialog;
