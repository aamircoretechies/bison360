'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoaderCircleIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { PermissionItem } from '@/lib/api/types';
import PermissionsService from '@/lib/api/permissions-service';
import {
  PermissionSchema,
  PermissionSchemaType,
} from '../forms/permission-schema';

export interface PermissionEditDialogProps {
  open: boolean;
  closeDialog: () => void;
  permission: PermissionItem | null;
}

const USER_ROLES = [
  { value: 1, label: 'Administrator' },
  { value: 2, label: 'Customer' },
  { value: 3, label: 'Guest' },
  { value: 4, label: 'Manager' },
  { value: 5, label: 'Member' },
  { value: 6, label: 'Owner' },
  { value: 7, label: 'Staff' },
  { value: 8, label: 'Support' },
  { value: 9, label: 'Vendor' },
] as const;

const PermissionEditDialog = ({
  open,
  closeDialog,
  permission,
}: PermissionEditDialogProps) => {
  const queryClient = useQueryClient();

  // Form initialization
  const form = useForm<PermissionSchemaType>({
    resolver: zodResolver(PermissionSchema),
    defaultValues: { 
      name: '', 
      slug: '', 
      description: '',
      permission_code: 0,
      user_role: 1,
    },
    mode: 'onSubmit',
  });

  // Reset form values when dialog is opened
  useEffect(() => {
    if (open) {
      form.reset({
        name: permission?.permission_name || '',
        slug: permission?.permission_slug || '',
        description: permission?.permission_description ?? '',
        permission_code: permission?.permission_code || 0,
        user_role: permission?.user_role || 1,
      });
    }
  }, [form, open, permission]);

  // Mutation for creating/updating permission
  const mutation = useMutation({
    mutationFn: async (values: PermissionSchemaType) => {
      const isEdit = !!permission?.permissions_id;
      
      if (isEdit) {
        const payload = {
          permissions_id: permission.permissions_id,
          permission_name: values.name,
          permission_code: values.permission_code,
          permission_slug: values.slug,
          permission_description: values.description || '',
          user_role: values.user_role,
        };
        const response = await PermissionsService.update(payload);
        if (response.status === 0) {
          throw new Error(response.message || 'Failed to update permission');
        }
        return response;
      } else {
        const payload = {
          permission_name: values.name,
          permission_code: values.permission_code,
          permission_slug: values.slug,
          permission_description: values.description || '',
          user_role: values.user_role,
        };
        const response = await PermissionsService.create(payload);
        if (response.status === 0) {
          throw new Error(response.message || 'Failed to create permission');
        }
        return response;
      }
    },
    onSuccess: (response) => {
      const isEdit = !!permission?.permissions_id;
      const message = isEdit
        ? (response.message || 'Permission updated successfully')
        : (response.message || 'Permission added successfully');

      toast.custom(
        () => (
          <Alert variant="mono" icon="success">
            <AlertIcon>
              <RiCheckboxCircleFill />
            </AlertIcon>
            <AlertTitle>{message}</AlertTitle>
          </Alert>
        ),
        {
          position: 'top-center',
        },
      );

      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      closeDialog();
    },
    onError: (error: Error) => {
      const message = error.message;
      toast.custom(
        () => (
          <Alert variant="mono" icon="destructive">
            <AlertIcon>
              <RiErrorWarningFill />
            </AlertIcon>
            <AlertTitle>{message}</AlertTitle>
          </Alert>
        ),
        {
          position: 'top-center',
        },
      );
    },
  });

  // Derive the loading state from the mutation status
  const isLoading = mutation.status === 'pending';

  // Handle form submission
  const handleSubmit = (values: PermissionSchemaType) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent close={false}>
        <DialogHeader>
          <DialogTitle>
            {permission ? 'Edit Permission' : 'Add Permission'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permission_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permission Code</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="Enter permission code" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g: com.permission.test"
                      {...field}
                      disabled={!!permission}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    A unique key for the permission, cannot be edited after
                    creation.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={String(field.value || 1)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role.value} value={String(role.value)}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                disabled={isLoading || !form.formState.isDirty}
              >
                {isLoading && <LoaderCircleIcon className="animate-spin" />}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionEditDialog;
