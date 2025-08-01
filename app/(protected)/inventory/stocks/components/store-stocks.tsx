'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { RiCheckboxCircleFill } from '@remixicon/react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { EllipsisVertical, Filter, Search, Settings2, X, Printer, CheckCircle, BatteryWarning } from 'lucide-react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardToolbar,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataGrid, useDataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface IProductData {
  id: string;
  skuCode: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  location: string;
  expiry: string;
  status: 'Active' | 'Expiring Soon' | 'Out of Stock' | 'Low Stock';
}

const data: IProductData[] = [
  {
    id: '1',
    skuCode: 'MT-001-23',
    productName: 'Ground Bison',
    batchNumber: 'B-1001',
    quantity: 120,
    location: 'Freezer A1',
    expiry: '15 Aug 2025',
    status: 'Active',
  },
  {
    id: '2',
    skuCode: 'MT-002-23',
    productName: 'Ribeye Steak',
    batchNumber: 'B-1002',
    quantity: 20,
    location: 'Freezer A2',
    expiry: '10 Aug 2025',
    status: 'Expiring Soon',
  },
  {
    id: '3',
    skuCode: 'MT-003-23',
    productName: 'Bison Roast',
    batchNumber: 'B-1003',
    quantity: 0,
    location: 'Shelf B3',
    expiry: '01 Aug 2025',
    status: 'Out of Stock',
  },
];

function ActionsCell({ row }: { row: Row<IProductData> }) {
  const { copyToClipboard } = useCopyToClipboard();
  const handleCopySKU = () => {
    copyToClipboard(String(row.original.skuCode));
    const message = `SKU Code successfully copied: ${row.original.skuCode}`;
    toast.custom(
      (t) => (
        <Alert
          variant="mono"
          icon="success"
          close={false}
          onClose={() => toast.dismiss(t)}
        >
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
  };

  const handlePrintBarcode = () => {
    const message = `Barcode printed for: ${row.original.productName}`;
    toast.custom(
      (t) => (
        <Alert
          variant="mono"
          icon="success"
          close={false}
          onClose={() => toast.dismiss(t)}
        >
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
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem onClick={() => {}}>Edit Product</DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>Adjust Quantity</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopySKU}>Copy SKU</DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrintBarcode}>Print Barcode</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => {}}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const StoreProductsStocks = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'productName', desc: false },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('latest');

  const filteredData = useMemo(() => {
    let filtered = data;

    // Filter by status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item) =>
        selectedStatuses.includes(item.status),
      );
    }

    // Filter by search query (case-insensitive)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.skuCode.toLowerCase().includes(searchLower) ||
          item.productName.toLowerCase().includes(searchLower) ||
          item.batchNumber.toLowerCase().includes(searchLower) ||
          item.location.toLowerCase().includes(searchLower) ||
          item.status.toLowerCase().includes(searchLower),
      );
    }

    // Apply sorting based on sortOrder
    if (sortOrder === 'latest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.id).getTime() - new Date(a.id).getTime(),
      );
    } else if (sortOrder === 'older') {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.id).getTime() - new Date(b.id).getTime(),
      );
    } else if (sortOrder === 'oldest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.id).getTime() - new Date(b.id).getTime(),
      );
    }

    return filtered;
  }, [searchQuery, selectedStatuses, sortOrder]);

  const statusCounts = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        const status = item.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, []);

  const handleStatusChange = (checked: boolean, value: string) => {
    setSelectedStatuses((prev = []) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Expiring Soon':
        return 'warning';
      case 'Out of Stock':
        return 'destructive';
      case 'Low Stock':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className='text-success' />;
      case 'Expiring Soon':
        return <BatteryWarning />;
      case 'Out of Stock':
        return <X />;
      case 'Low Stock':
        return <BatteryWarning />;
      default:
        return '';
    }
  };

  const columns = useMemo<ColumnDef<IProductData>[]>(
    () => [
      {
        accessorKey: 'id',
        accessorFn: (row) => row.id,
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 51,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'skuCode',
        accessorFn: (row) => row.skuCode,
        header: ({ column }) => (
          <DataGridColumnHeader title="SKU Code" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-foreground font-medium">
            {row.original.skuCode}
          </span>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'productName',
        accessorFn: (row) => row.productName,
        header: ({ column }) => (
          <DataGridColumnHeader title="Product" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-foreground font-medium">
            {row.original.productName}
          </span>
        ),
        enableSorting: true,
        size: 200,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'batchNumber',
        accessorFn: (row) => row.batchNumber,
        header: ({ column }) => (
          <DataGridColumnHeader title="Batch #" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-foreground font-normal">
            {row.original.batchNumber}
          </span>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'quantity',
        accessorFn: (row) => row.quantity,
        header: ({ column }) => (
          <DataGridColumnHeader title="Quantity" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-foreground font-normal">
            {row.original.quantity}
          </span>
        ),
        enableSorting: true,
        size: 100,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'location',
        accessorFn: (row) => row.location,
        header: ({ column }) => (
          <DataGridColumnHeader title="Location" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-foreground font-normal">
            {row.original.location}
          </span>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'expiry',
        accessorFn: (row) => row.expiry,
        header: ({ column }) => (
          <DataGridColumnHeader title="Expiry Date" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-foreground font-normal">
            {row.original.expiry}
          </span>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'status',
        accessorFn: (row) => row.status,
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="text-lg">{getStatusIcon(row.original.status)}</span>
            <Badge variant={getStatusBadgeVariant(row.original.status)} size="sm">
              {row.original.status}
            </Badge>
          </div>
        ),
        enableSorting: true,
        size: 140,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'actions',
        header: ({ column }) => (
          <DataGridColumnHeader title="Actions" column={column} />
        ),
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <Button mode="link" underlined="dashed" size="sm">
                Edit
              </Button>
            </div>
          );
        },
        size: 140,
      },
      {
        id: 'menu',
        header: '',
        cell: ({ row }) => <ActionsCell row={row} />,
        enableSorting: false,
        size: 60,
        meta: {
          headerClassName: '',
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: IProductData) => String(row.id),
    state: {
      pagination,
      sorting,
      rowSelection,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const Toolbar = () => {
    const { table } = useDataGrid();

    return (
      <CardToolbar>
        <DataGridColumnVisibility
          table={table}
          trigger={
            <Button variant="outline">
              <Settings2 />
              Columns
            </Button>
          }
        />
      </CardToolbar>
    );
  };

  return (
    <DataGrid
      table={table}
      recordCount={filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        cellBorder: true,
      }}
    >
      <Card>
        <CardHeader>
          <CardHeading>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search Products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9 w-40"
                />
                {searchQuery.length > 0 && (
                  <Button
                    mode="icon"
                    variant="ghost"
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery('')}
                  >
                    <X />
                  </Button>
                )}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter />
                    Status
                    {selectedStatuses.length > 0 && (
                      <Badge size="sm" appearance="stroke">
                        {selectedStatuses.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-3" align="start">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Filters
                    </div>
                    <div className="space-y-3">
                      {Object.keys(statusCounts).map((status) => (
                        <div
                          key={status}
                          className="flex items-center gap-2.5"
                        >
                          <Checkbox
                            id={status}
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={(checked) =>
                              handleStatusChange(checked === true, status)
                            }
                          />
                          <Label
                            htmlFor={status}
                            className="grow flex items-center justify-between font-normal gap-1.5"
                          >
                            {status}
                            <span className="text-muted-foreground">
                              {statusCounts[status]}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter />
                    Sort Order
                    {sortOrder !== 'latest' && (
                      <Badge size="sm" appearance="stroke">
                        {sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-3" align="start">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Sort By
                    </div>
                    <div className="space-y-3">
                      {['latest', 'older', 'oldest'].map((order) => (
                        <div key={order} className="flex items-center gap-2.5">
                          <Checkbox
                            id={order}
                            checked={sortOrder === order}
                            onCheckedChange={(checked) =>
                              checked && setSortOrder(order)
                            }
                          />
                          <Label
                            htmlFor={order}
                            className="grow flex items-center justify-between font-normal gap-1.5"
                          >
                            {order.charAt(0).toUpperCase() + order.slice(1)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeading>
          <Toolbar />
        </CardHeader>
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
  );
};

export { StoreProductsStocks };