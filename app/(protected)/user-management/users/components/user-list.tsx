'use client';

import { useMemo, useState } from 'react';
import { redirect } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronRight, Plus, Search, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { formatDate, formatDateTime, getInitials } from '@/lib/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge, BadgeDot, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTable } from '@/components/ui/card';
import {
  DataGrid,
  DataGridApiFetchParams,
  DataGridApiResponse,
} from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { User, UserStatus } from '@/app/models/user';
import { getUserStatusProps, UserStatusProps } from '../constants/status';
import UserInviteDialog from './user-add-dialog';
import { useUsersQuery } from '@/lib/api/hooks/use-users-query';
import { UsersService } from '@/lib/api/users-service';
import { UserData } from '@/lib/api/types';

// Interface for transformed user data
interface TransformedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: number;
  statusDescription: string;
  createdAt: string;
  lastSignIn: string;
  profileImage: string | null;
  firstName: string;
  lastName: string;
}

const UserList = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>('all');

  // Get role options from service
  const roleOptions = [
    { value: 'all', label: 'All roles' },
    { value: '1', label: 'Administrator' },
    { value: '2', label: 'Customer' },
    { value: '3', label: 'Guest' },
    { value: '4', label: 'Manager' },
    { value: '5', label: 'Member' },
    { value: '6', label: 'Owner' },
    { value: '7', label: 'Staff' },
    { value: '8', label: 'Support' },
    { value: '9', label: 'Vendor' },
  ];

  // Fetch users from the server API
  const fetchUsers = async ({
    pageIndex,
    pageSize,
    sorting,
    searchQuery,
    selectedRole,
    selectedStatus,
  }: DataGridApiFetchParams & {
    selectedRole: string | null;
    selectedStatus: string | null;
  }): Promise<DataGridApiResponse<User>> => {
    const sortField = sorting?.[0]?.id || '';
    const sortDirection = sorting?.[0]?.desc ? 'desc' : 'asc';

    const params = new URLSearchParams({
      page: String(pageIndex + 1),
      limit: String(pageSize),
      ...(sortField ? { sort: sortField, dir: sortDirection } : {}),
      ...(searchQuery ? { query: searchQuery } : {}),
      ...(selectedRole && selectedRole !== 'all'
        ? { roleId: selectedRole }
        : {}),
      ...(selectedStatus && selectedStatus !== 'all'
        ? { status: selectedStatus }
        : {}),
    });

    const response = await apiFetch(
      `/api/user-management/users?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error(
        'Oops! Something didn’t go as planned. Please try again in a moment.',
      );
    }

    return response.json();
  };

  // Users query using new API
  const { data: usersResponse, isLoading, error } = useUsersQuery({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    search: searchQuery || undefined,
    user_role: selectedRole && selectedRole !== 'all' ? parseInt(selectedRole) : undefined,
    user_status: selectedStatus && selectedStatus !== 'all' ? parseInt(selectedStatus) : undefined,
  });

  // Transform API response to match DataGrid format
  const data = usersResponse ? {
    data: usersResponse.data.content.map((user: UserData): TransformedUser => ({
      id: user.user_id.toString(),
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.user_role_description,
      status: user.user_active_inactive_blocked_status,
      statusDescription: user.user_active_inactive_blocked_status_description,
      createdAt: user.created,
      lastSignIn: user.last_login_updated,
      profileImage: user.profile_image,
      firstName: user.first_name,
      lastName: user.last_name,
    })),
    totalCount: usersResponse.data.totalElements,
    pageCount: usersResponse.data.totalPages,
  } : undefined;

  const handleRoleSelection = (roleId: string) => {
    setSelectedRole(roleId);
    setPagination({ ...pagination, pageIndex: 0 });
  };

  const handleStatusSelection = (status: string) => {
    setSelectedStatus(status);
    setPagination({ ...pagination, pageIndex: 0 });
  };

  const handleRowClick = (row: TransformedUser) => {
    const userId = row.id;
    redirect(`/user-management/users/${userId}`);
  };

  const columns = useMemo<ColumnDef<TransformedUser>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="User"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const user = row.original as unknown as TransformedUser;
          const avatarUrl = user.profileImage || null;
          const initials = user.profileImage 
            ? null 
            : UsersService.getUserInitials(user.firstName || '', user.lastName || '');

          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                {avatarUrl && (
                  <AvatarImage src={avatarUrl} alt={user.name || ''} />
                )}
                <AvatarFallback>{initials || getInitials(user.name || user.email)}</AvatarFallback>
              </Avatar>
              <div className="space-y-px">
                <div className="font-medium text-sm">{user.name}</div>
                <div className="text-muted-foreground text-xs">
                  {user.email}
                </div>
              </div>
            </div>
          );
        },
        size: 300,
        meta: {
          headerTitle: 'Name',
          skeleton: (
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ),
        },
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'role',
        id: 'role_nameme',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Role"
            visibility={true}
            column={column}
          />
        ),
        size: 150,
        cell: ({ row }) => {
          const user = row.original as unknown as TransformedUser;
          const role = user.role;
          if (!role) return '-';

          return (
            <Badge variant="secondary" appearance="outline">
              {role}
            </Badge>
          );
        },
        meta: {
          headerTitle: 'Role',
          skeleton: <Skeleton className="w-28 h-7" />,
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Status"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const user = row.original as unknown as TransformedUser;
          const status = user.status;
          const statusDescription = user.statusDescription;
          
          // Map status to variant
          let variant: 'secondary' | 'success' | 'warning' | 'destructive' = 'secondary';
          if (status === 1) variant = 'success';
          else if (status === 2) variant = 'warning';
          else if (status === 3) variant = 'destructive';

          return (
            <div className="inline-flex gap-2.5">
              <Badge variant={variant} appearance="ghost">
                <BadgeDot />
                {statusDescription}
              </Badge>
            </div>
          );
        },
        size: 125,
        meta: {
          headerTitle: 'Status',
          skeleton: <Skeleton className="w-14 h-7" />,
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'createdAt',
        id: 'createdAt',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Joined"
            visibility={true}
            column={column}
          />
        ),
        cell: (info) => UsersService.formatDate(info.getValue() as string),
        size: 150,
        meta: {
          headerTitle: 'Joined',
          skeleton: <Skeleton className="w-20 h-7" />,
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'lastSignIn',
        id: 'lastSignInAt',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Last Sign In"
            visibility={true}
            column={column}
          />
        ),
        cell: (info) =>
          info.getValue()
            ? UsersService.formatLastLogin(info.getValue() as string)
            : '-',
        size: 175,
        meta: {
          headerTitle: 'Last Sign In',
          skeleton: <Skeleton className="w-20 h-7" />,
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'actions',
        header: '',
        cell: () => (
          <ChevronRight className="text-muted-foreground/70 size-3.5" />
        ),
        meta: {
          skeleton: <Skeleton className="size-4" />,
        },
        size: 40,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
    ],
    [],
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string),
  );

  const table = useReactTable({
    columns,
    data: data?.data || [],
    pageCount: Math.ceil((data?.totalCount || 0) / pagination.pageSize),
    getRowId: (row: TransformedUser) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    columnResizeMode: 'onChange',
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const DataGridToolbar = () => {
    const [inputValue, setInputValue] = useState(searchQuery);

    const handleSearch = () => {
      setSearchQuery(inputValue);
      setPagination({ ...pagination, pageIndex: 0 });
    };

    return (
      <CardHeader className="flex-col flex-wrap sm:flex-row items-stretch sm:items-center py-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative">
            <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search users"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isLoading}
              className="ps-9 w-full sm:40 md:w-64"
            />
            {searchQuery.length > 0 && (
              <Button
                mode="icon"
                variant="dim"
                className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchQuery('')}
              >
                <X />
              </Button>
            )}
          </div>
          <Select
            onValueChange={handleRoleSelection}
            value={selectedRole || 'all'}
            defaultValue="all"
            disabled={isLoading}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleStatusSelection}
            value={selectedStatus || 'all'}
            defaultValue="all"
            disabled={isLoading}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              {Object.entries(UserStatusProps).map(([status, { label }]) => (
                <SelectItem key={status} value={status}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-end">
          <Button
            disabled={isLoading && true}
            onClick={() => {
              setInviteDialogOpen(true);
            }}
          >
            <Plus />
            Add user
          </Button>
        </div>
      </CardHeader>
    );
  };

  // Show error state if API fails
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Failed to load users
          </h3>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DataGrid
        table={table}
        recordCount={data?.totalCount || 0}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        tableLayout={{
          columnsResizable: true,
          columnsPinnable: true,
          columnsMovable: true,
          columnsVisibility: true,
        }}
        tableClassNames={{
          edgeCell: 'px-5',
        }}
      >
        <Card>
          <DataGridToolbar />
          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination />
          </CardFooter>
        </Card>
      </DataGrid>

      <UserInviteDialog
        open={inviteDialogOpen}
        closeDialog={() => setInviteDialogOpen(false)}
      />
    </>
  );
};

export default UserList;
