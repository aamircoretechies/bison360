'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
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
import { EllipsisVertical, Filter, Search, Settings2, X, Eye, Package, Truck, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { RiCheckboxCircleFill } from '@remixicon/react';
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
  DropdownMenu,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IOrderData {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: 'CC' | 'EBT' | 'Cash';
  orderStatus: 'Pending' | 'Picked' | 'Packed' | 'Shipped' | 'Delivered';
  trackingNumber?: string;
  orderDate: string;
  assignedStaff: string;
  totalAmount: number;
}

const sampleOrders: IOrderData[] = [
  {
    id: '1',
    orderId: 'ORD-2024-001',
    customerName: 'John Smith',
    customerPhone: '(555) 123-4567',
    shippingAddress: '123 Main St, Anytown, ST 12345',
    paymentMethod: 'CC',
    orderStatus: 'Pending',
    orderDate: '2024-01-15T10:30:00Z',
    assignedStaff: 'Sarah Johnson',
    totalAmount: 89.99,
  },
  {
    id: '2',
    orderId: 'ORD-2024-002',
    customerName: 'Mary Johnson',
    customerPhone: '(555) 234-5678',
    shippingAddress: '456 Oak Ave, Somewhere, ST 67890',
    paymentMethod: 'EBT',
    orderStatus: 'Picked',
    orderDate: '2024-01-15T09:15:00Z',
    assignedStaff: 'Mike Wilson',
    totalAmount: 156.50,
  },
  {
    id: '3',
    orderId: 'ORD-2024-003',
    customerName: 'David Brown',
    customerPhone: '(555) 345-6789',
    shippingAddress: '789 Pine Rd, Elsewhere, ST 11111',
    paymentMethod: 'Cash',
    orderStatus: 'Packed',
    orderDate: '2024-01-15T08:45:00Z',
    assignedStaff: 'Lisa Davis',
    totalAmount: 234.75,
  },
  {
    id: '4',
    orderId: 'ORD-2024-004',
    customerName: 'Jennifer Wilson',
    customerPhone: '(555) 456-7890',
    shippingAddress: '321 Elm St, Nowhere, ST 22222',
    paymentMethod: 'CC',
    orderStatus: 'Shipped',
    trackingNumber: '1Z999AA1234567890',
    orderDate: '2024-01-14T16:20:00Z',
    assignedStaff: 'Tom Anderson',
    totalAmount: 67.25,
  },
  {
    id: '5',
    orderId: 'ORD-2024-005',
    customerName: 'Robert Taylor',
    customerPhone: '(555) 567-8901',
    shippingAddress: '654 Maple Dr, Anywhere, ST 33333',
    paymentMethod: 'EBT',
    orderStatus: 'Delivered',
    trackingNumber: '1Z999AA1234567891',
    orderDate: '2024-01-13T14:10:00Z',
    assignedStaff: 'Sarah Johnson',
    totalAmount: 189.99,
  },
];

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'Pending':
      return 'warning';
    case 'Picked':
      return 'info';
    case 'Packed':
      return 'secondary';
    case 'Shipped':
      return 'success';
    case 'Delivered':
      return 'success';
    default:
      return 'secondary';
  }
}

function getPaymentMethodLabel(method: string) {
  switch (method) {
    case 'CC':
      return 'Credit Card';
    case 'EBT':
      return 'EBT';
    case 'Cash':
      return 'Cash';
    default:
      return method;
  }
}

function ActionsCell({ row }: { row: Row<IOrderData> }) {
  const { copyToClipboard } = useCopyToClipboard();
  
  const handleCopyOrderId = () => {
    copyToClipboard(String(row.original.orderId));
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
          <AlertTitle>Order ID copied to clipboard!</AlertTitle>
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
        <DropdownMenuItem asChild>
          <Link href={`/orders/${row.original.orderId}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyOrderId}>
          Copy Order ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Package className="h-4 w-4 mr-2" />
          Update Status
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function OrdersDashboardContent() {
  const [activeTab, setActiveTab] = useState('all');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'orderDate', desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    let filtered = sampleOrders;

    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter((order) => order.orderStatus === activeTab);
    }

    // Filter by payment method
    if (selectedPaymentMethods.length > 0) {
      filtered = filtered.filter((order) =>
        selectedPaymentMethods.includes(order.paymentMethod),
      );
    }

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower) ||
          order.customerPhone.includes(searchQuery) ||
          order.shippingAddress.toLowerCase().includes(searchLower) ||
          order.trackingNumber?.toLowerCase().includes(searchLower),
      );
    }

    return filtered;
  }, [activeTab, selectedPaymentMethods, searchQuery]);

  const statusCounts = useMemo(() => {
    return sampleOrders.reduce(
      (acc, order) => {
        const status = order.orderStatus;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, []);

  const paymentMethodCounts = useMemo(() => {
    return sampleOrders.reduce(
      (acc, order) => {
        const method = order.paymentMethod;
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, []);

  const handlePaymentMethodChange = (checked: boolean, value: string) => {
    setSelectedPaymentMethods((prev = []) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  const columns = useMemo<ColumnDef<IOrderData>[]>(
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
        id: 'orderId',
        accessorFn: (row) => row.orderId,
        header: ({ column }) => (
          <DataGridColumnHeader title="Order ID" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">
              {row.original.orderId}
            </span>
            <Button
              mode="icon"
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(row.original.orderId);
                toast.success('Order ID copied!');
              }}
              className="h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ),
        enableSorting: true,
        size: 140,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'customerName',
        accessorFn: (row) => row.customerName,
        header: ({ column }) => (
          <DataGridColumnHeader title="Customer" column={column} />
        ),
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="text-foreground font-medium">
              {row.original.customerName}
            </div>
            <div className="text-sm text-muted-foreground">
              {row.original.customerPhone}
            </div>
          </div>
        ),
        enableSorting: true,
        size: 180,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'shippingAddress',
        accessorFn: (row) => row.shippingAddress,
        header: ({ column }) => (
          <DataGridColumnHeader title="Shipping Address" column={column} />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground max-w-[200px] truncate">
            {row.original.shippingAddress}
          </div>
        ),
        enableSorting: true,
        size: 200,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'paymentMethod',
        accessorFn: (row) => row.paymentMethod,
        header: ({ column }) => (
          <DataGridColumnHeader title="Payment" column={column} />
        ),
                 cell: ({ row }) => (
           <Badge variant="secondary" size="sm">
             {getPaymentMethodLabel(row.original.paymentMethod)}
           </Badge>
         ),
        enableSorting: true,
        size: 120,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'orderStatus',
        accessorFn: (row) => row.orderStatus,
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: ({ row }) => (
          <Badge variant={getStatusBadgeVariant(row.original.orderStatus)} size="sm">
            {row.original.orderStatus}
          </Badge>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'trackingNumber',
        accessorFn: (row) => row.trackingNumber,
        header: ({ column }) => (
          <DataGridColumnHeader title="Tracking" column={column} />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.original.trackingNumber || '-'}
          </div>
        ),
        enableSorting: true,
        size: 160,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'orderDate',
        accessorFn: (row) => row.orderDate,
        header: ({ column }) => (
          <DataGridColumnHeader title="Order Date" column={column} />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {new Date(row.original.orderDate).toLocaleDateString()}
            <br />
            {new Date(row.original.orderDate).toLocaleTimeString()}
          </div>
        ),
        enableSorting: true,
        size: 140,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'assignedStaff',
        accessorFn: (row) => row.assignedStaff,
        header: ({ column }) => (
          <DataGridColumnHeader title="Assigned Staff" column={column} />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.original.assignedStaff}
          </div>
        ),
        enableSorting: true,
        size: 140,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'totalAmount',
        accessorFn: (row) => row.totalAmount,
        header: ({ column }) => (
          <DataGridColumnHeader title="Total" column={column} />
        ),
        cell: ({ row }) => (
          <div className="text-foreground font-medium">
            ${row.original.totalAmount.toFixed(2)}
          </div>
        ),
        enableSorting: true,
        size: 100,
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
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button mode="link" underlined="dashed" size="sm" asChild>
              <Link href={`/orders/${row.original.orderId}`}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
            </Button>
            <Button mode="link" underlined="dashed" size="sm">
              <Package className="h-4 w-4 mr-1" />
              Update
            </Button>
          </div>
        ),
        size: 160,
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
    getRowId: (row: IOrderData) => String(row.id),
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
    <div className="grid gap-5 lg:gap-7.5">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All Orders
            <Badge variant="secondary" size="sm">
              {sampleOrders.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="Pending" className="flex items-center gap-2">
            Pending
            <Badge variant="warning" size="sm">
              {statusCounts.Pending || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="Picked" className="flex items-center gap-2">
            Picked
            <Badge variant="info" size="sm">
              {statusCounts.Picked || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="Packed" className="flex items-center gap-2">
            Packed
            <Badge variant="secondary" size="sm">
              {statusCounts.Packed || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="Shipped" className="flex items-center gap-2">
            Shipped
            <Badge variant="success" size="sm">
              {statusCounts.Shipped || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="Delivered" className="flex items-center gap-2">
            Delivered
            <Badge variant="success" size="sm">
              {statusCounts.Delivered || 0}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
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
            <Card className="w-full max-w-full overflow-hidden">
              <CardHeader>
                <CardHeading>
                  <div className="flex flex-wrap items-center gap-2.5 py-2">
                    <div className="relative">
                      <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                      <Input
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="ps-9 w-60"
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
                          Payment Method
                          {selectedPaymentMethods.length > 0 && (
                            <Badge size="sm" appearance="stroke">
                              {selectedPaymentMethods.length}
                            </Badge>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-3" align="start">
                        <div className="space-y-3">
                          <div className="text-xs font-medium text-muted-foreground">
                            Payment Methods
                          </div>
                          <div className="space-y-3">
                            {Object.keys(paymentMethodCounts).map((method) => (
                              <div
                                key={method}
                                className="flex items-center gap-2.5"
                              >
                                <Checkbox
                                  id={method}
                                  checked={selectedPaymentMethods.includes(method)}
                                  onCheckedChange={(checked) =>
                                    handlePaymentMethodChange(checked === true, method)
                                  }
                                />
                                <Label
                                  htmlFor={method}
                                  className="grow flex items-center justify-between font-normal gap-1.5"
                                >
                                  {getPaymentMethodLabel(method)}
                                  <span className="text-muted-foreground">
                                    {paymentMethodCounts[method]}
                                  </span>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
