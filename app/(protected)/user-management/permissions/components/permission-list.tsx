'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Ellipsis, Plus, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTable,
  CardToolbar,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { PermissionItem } from '@/lib/api/types';
import { usePermissionsQuery } from '@/lib/api/hooks/use-permissions-query';
import PermissionDeleteDialog from './permission-delete-dialog';
import PermissionEditDialog from './permission-edit-dialog';
import PermissionGroupDeleteDialog from './permission-group-delete-dialog';

const PermissionList = () => {
  // List state management
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Form state management
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupDeleteDialogOpen, setGroupDeleteDialogOpen] = useState(false);
  const [editPermission, setEditPermission] = useState<PermissionItem | null>(
    null,
  );
  const [deletePermission, setDeletePermission] =
    useState<PermissionItem | null>(null);
  const [deletePermissionIds, setDeletePermissionIds] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

  // Query state management
  const [searchQuery, setSearchQuery] = useState('');

  // Permissions query
  const { data: apiData, isLoading } = usePermissionsQuery({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    search: searchQuery || undefined,
    user_role: selectedRole,
    sort_by: sortOrder,
  });

  // Transform API data to table format
  const rows = useMemo<PermissionItem[]>(() => {
    return apiData?.data?.content ?? [];
  }, [apiData]);

  // Handle row selection
  const handleRoleSelection = (roleId: string) => {
    if (roleId === 'all') {
      setSelectedRole(undefined);
    } else {
      setSelectedRole(parseInt(roleId));
    }
    setPagination({ ...pagination, pageIndex: 0 }); // Reset to first page when filtering
  };

  useEffect(() => {
    const selectedRowIds = Object.keys(rowSelection);
    if (selectedRowIds.length > 0) {
      setDeletePermissionIds(selectedRowIds);
    } else {
      setDeletePermissionIds([]);
    }
  }, [rowSelection]);

  // Column definitions
  const columns = useMemo<ColumnDef<PermissionItem>[]>(
    () => [
      {
        id: 'permissions_id',
        accessorKey: 'permissions_id',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        size: 27,
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="size-5" />,
        },
        enableResizing: false,
      },
      {
        id: 'permission_name',
        accessorKey: 'permission_name',
        header: ({ column }) => (
          <DataGridColumnHeader title="Permission" column={column} />
        ),
        cell: (info) => info.getValue(),
        size: 150,
        enableSorting: true,
        enableHiding: false,
        meta: {
          headerTitle: 'Permission',
          skeleton: <Skeleton className="w-28 h-8" />,
        },
      },
      {
        id: 'permission_slug',
        accessorKey: 'permission_slug',
        header: ({ column }) => (
          <DataGridColumnHeader title="Slug" column={column} />
        ),
        cell: (info) => {
          const value = info.getValue() as string;

          return (
            <Badge variant="secondary" appearance="outline">
              {value}
            </Badge>
          );
        },
        size: 150,
        enableSorting: true,
        enableHiding: false,
        meta: {
          headerTitle: 'min-w-[200px]',
          skeleton: <Skeleton className="w-14 h-8" />,
        },
      },
      {
        id: 'permission_description',
        accessorKey: 'permission_description',
        header: ({ column }) => (
          <DataGridColumnHeader title="Description" column={column} />
        ),
        cell: (info) => {
          const value = info.getValue() as string;

          return <div className="truncate">{value || '-'}</div>;
        },
        size: 300,
        enableSorting: false,
        enableHiding: false,
        meta: {
          headerTitle: 'Description',
          skeleton: <Skeleton className="w-28 h-8" />,
        },
      },
      {
        id: 'created',
        accessorKey: 'created',
        header: ({ column }) => (
          <DataGridColumnHeader title="Created At" column={column} />
        ),
        cell: (info) => {
          const value = info.getValue() as string;
          return new Date(value).toLocaleString();
        },
        enableSorting: true,
        enableHiding: false,
        meta: {
          headerTitle: 'Created At',
          skeleton: <Skeleton className="w-20 h-8" />,
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button mode="icon" variant="ghost">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start">
              <DropdownMenuItem
                onClick={() => {
                  setEditPermission(row.original);
                  setEditDialogOpen(true);
                }}
              >
                Edit permission
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setDeletePermission(row.original);
                  setDeleteDialogOpen(true);
                }}
              >
                Delete permission
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 90,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        meta: {
          skeleton: <Skeleton className="size-5" />,
        },
      },
    ],
    [],
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string),
  );

  const table = useReactTable({
    columns,
    data: rows,
    pageCount: apiData?.data?.totalPages || 1,
    getRowId: (row: PermissionItem) => String(row.permissions_id),
    state: {
      pagination,
      sorting,
      columnOrder,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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
      <CardHeader className="flex-col flex-wrap sm:flex-row items-end items-stretch sm:items-center py-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative">
            <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search permissions"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isLoading && true}
              className="ps-9 w-full sm:w-64"
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
            disabled={isLoading && true}
            onValueChange={handleRoleSelection}
            value={selectedRole ? String(selectedRole) : 'all'}
            defaultValue="all"
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="1">Administrator</SelectItem>
              <SelectItem value="2">Customer</SelectItem>
              <SelectItem value="3">Guest</SelectItem>
              <SelectItem value="4">Manager</SelectItem>
              <SelectItem value="5">Member</SelectItem>
              <SelectItem value="6">Owner</SelectItem>
              <SelectItem value="7">Staff</SelectItem>
              <SelectItem value="8">Support</SelectItem>
              <SelectItem value="9">Vendor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardToolbar>
          {deletePermissionIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => {
                setGroupDeleteDialogOpen(true);
              }}
            >
              Delete {deletePermissionIds.length} permissions
            </Button>
          )}
          <Button
            disabled={isLoading && true}
            onClick={() => {
              setEditPermission(null);
              setEditDialogOpen(true);
            }}
          >
            <Plus />
            Add Permission
          </Button>
        </CardToolbar>
      </CardHeader>
    );
  };

  return (
    <>
      <DataGrid
        table={table}
        recordCount={apiData?.data?.totalElements || 0}
        isLoading={isLoading}
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

      <PermissionEditDialog
        open={editDialogOpen}
        closeDialog={() => setEditDialogOpen(false)}
        permission={editPermission}
      />

      {deletePermission && (
        <PermissionDeleteDialog
          open={deleteDialogOpen}
          closeDialog={() => setDeleteDialogOpen(false)}
          permission={deletePermission}
        />
      )}

      {deletePermissionIds && (
        <PermissionGroupDeleteDialog
          open={groupDeleteDialogOpen}
          closeDialog={() => {
            setGroupDeleteDialogOpen(false);
            setRowSelection({});
          }}
          permissionIds={deletePermissionIds}
        />
      )}
    </>
  );
};

export default PermissionList;
