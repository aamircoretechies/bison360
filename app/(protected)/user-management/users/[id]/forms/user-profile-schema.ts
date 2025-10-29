import { z } from 'zod';

export const UserProfileSchema = z.object({
  first_name: z
    .string()
    .nonempty({ message: 'First name is required.' })
    .min(2, { message: 'First name must be at least 2 characters long.' })
    .max(50, { message: 'First name must not exceed 50 characters.' }),
  last_name: z
    .string()
    .nonempty({ message: 'Last name is required.' })
    .min(2, { message: 'Last name must be at least 2 characters long.' })
    .max(50, { message: 'Last name must not exceed 50 characters.' }),
  user_role: z.number().min(1, {
    message: 'Please select a valid role.',
  }),
  status: z.number().min(1, {
    message: 'Please select a valid status.',
  }),
});

export type UserProfileSchemaType = z.infer<typeof UserProfileSchema>;
