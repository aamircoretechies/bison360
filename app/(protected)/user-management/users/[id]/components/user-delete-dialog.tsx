'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { apiFetch } from '@/lib/api';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoaderCircleIcon } from 'lucide-react';
import { UserData } from '@/lib/api/types';
import { useProfileDeleteMutation } from '@/lib/api/hooks/use-profile-delete-mutation';

// Validation schema for email confirmation
const EmailConfirmationSchema = (userEmail: string) =>
  z.object({
    confirmEmail: z
      .string()
      .nonempty({ message: 'Email is required.' })
      .email({ message: 'Please enter a valid email address.' })
      .refine((value) => value === userEmail, {
        message: 'Email confirmation does not match.',
      }),
  });

type EmailConfirmationSchemaType = z.infer<
  ReturnType<typeof EmailConfirmationSchema>
>;

interface UserDeleteDialogProps {
  open: boolean;
  closeDialog: () => void;
  user: UserData;
}

const UserDeleteDialog = ({
  open,
  closeDialog,
  user,
}: UserDeleteDialogProps) => {
  const queryClient = useQueryClient();

  // Set up the form using react-hook-form and zod validation
  const form = useForm<EmailConfirmationSchemaType>({
    resolver: zodResolver(EmailConfirmationSchema(user.email)),
    defaultValues: {
      confirmEmail: '',
    },
    mode: 'onChange',
  });

  // Profile delete mutation
  const deleteProfileMutation = useProfileDeleteMutation();

  const handleSubmit = () => {
    deleteProfileMutation.mutate({
      user_id: user.user_id,
    }, {
      onSuccess: () => {
        closeDialog();
        // Redirect to users list after successful deletion
        window.location.href = '/user-management/users';
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent close={false}>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-sm text-accent-foreground mb-2.5">
            Deleting user{' '}
            <strong className="text-foreground">{user.email}</strong> will
            permanently remove the account and all related data. This action
            cannot be undone.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-2.5 pt-2.5"
            >
              <FormField
                control={form.control}
                name="confirmEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">
                      Confirm the user&apos;s email address to proceed
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  type="submit"
                  disabled={
                    !form.formState.isDirty ||
                    !form.formState.isValid ||
                    deleteProfileMutation.isPending
                  }
                >
                  {deleteProfileMutation.isPending && (
                    <LoaderCircleIcon className="animate-spin" />
                  )}
                  Delete user account
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDeleteDialog;
