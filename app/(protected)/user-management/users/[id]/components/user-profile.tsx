'use client';

import { useState } from 'react';
import { formatDateTime } from '@/lib/helpers';
import { Badge, BadgeDot, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UserData } from '@/lib/api/types';
import { UserDetailsService } from '@/lib/api/user-details-service';
import UserProfileEditDialog from './user-profile-edit-dialog';

const UserProfile = ({
  user,
  isLoading,
}: {
  user: UserData;
  isLoading: boolean;
}) => {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const Loading = () => (
    <Card>
      <CardContent>
        <dl className="grid grid-cols-[auto_1fr] text-muted-foreground gap-3 text-sm mb-5">
          <div className="grid grid-cols-subgrid col-span-2 items-baseline">
            <dt className="flex md:w-64">
              <Skeleton className="h-6 w-24" />
            </dt>
            <dd>
              <Skeleton className="h-5 w-36" />
            </dd>
          </div>
          <div className="grid grid-cols-subgrid col-span-2 items-baseline">
            <dt>
              <Skeleton className="h-5 w-36" />
            </dt>
            <dd>
              <Skeleton className="h-5 w-48" />
            </dd>
          </div>
          <div className="grid grid-cols-subgrid col-span-2 items-baseline">
            <dt>
              <Skeleton className="h-5 w-20" />
            </dt>
            <dd>
              <Skeleton className="h-5 w-24" />
            </dd>
          </div>
          <div className="grid grid-cols-subgrid col-span-2 items-baseline">
            <dt>
              <Skeleton className="h-5 w-24" />
            </dt>
            <dd>
              <Skeleton className="h-5 w-20" />
            </dd>
          </div>
          <div className="grid grid-cols-subgrid col-span-2 items-baseline">
            <dt>
              <Skeleton className="h-5 w-36" />
            </dt>
            <dd>
              <Skeleton className="h-5 w-24" />
            </dd>
          </div>
          <div className="grid grid-cols-subgrid col-span-2 items-baseline">
            <dt>
              <Skeleton className="h-5 w-24" />
            </dt>
            <dd>
              <Skeleton className="h-5 w-36" />
            </dd>
          </div>
        </dl>
        <Skeleton className="h-9 w-32" />
      </CardContent>
    </Card>
  );

  const Content = () => {
    const fullName = `${user.first_name} ${user.last_name}`;
    const statusVariant = UserDetailsService.getStatusVariant(user.user_active_inactive_blocked_status);
    const statusDescription = UserDetailsService.getStatusDescription(user.user_active_inactive_blocked_status);

    return (
      <Card>
        <CardContent>
          <dl className="grid grid-cols-[auto_1fr] gap-3 text-sm mb-5 [&_dt]:text-muted-foreground">
            <div className="grid grid-cols-subgrid col-span-2 items-baseline">
              <dt className="flex md:w-64">Full name:</dt>
              <dd>{fullName}</dd>
            </div>
            <div className="grid grid-cols-subgrid col-span-2 items-baseline">
              <dt>Email address:</dt>
              <dd className="flex items-center gap-2.5">
                <span>{user.email}</span>
                {user.email_verified_status === 1 ? (
                  <Badge variant="secondary" appearance="outline">
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="warning" appearance="outline">
                    Not verified
                  </Badge>
                )}
              </dd>
            </div>
            <div className="grid grid-cols-subgrid col-span-2 items-baseline">
              <dt>Role:</dt>
              <dd>
                <span className="inline-flex items-center gap-1">
                  {user.user_role_description}
                </span>
              </dd>
            </div>
            <div className="grid grid-cols-subgrid col-span-2 items-baseline">
              <dt>Status:</dt>
              <dd>
                <div className="inline-flex gap-2.5">
                  <Badge variant={statusVariant} appearance="ghost">
                    <BadgeDot />
                    {statusDescription}
                  </Badge>
                </div>
              </dd>
            </div>
            <div className="grid grid-cols-subgrid col-span-2 items-baseline">
              <dt>Last Sign In:</dt>
              <dd>
                {UserDetailsService.formatLastLogin(user.last_login_updated)}
              </dd>
            </div>
          </dl>
          <Button
            variant="outline"
            onClick={() => setEditDialogOpen(true)}
          >
            Edit user details
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {isLoading || !user ? <Loading /> : <Content />}

      <UserProfileEditDialog
        open={isEditDialogOpen}
        closeDialog={() => setEditDialogOpen(false)}
        user={user}
      />
    </>
  );
};

export default UserProfile;
