'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { EllipsisVertical, Filter, Search, Settings2, X } from 'lucide-react';
import { toast } from 'sonner';
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
import { useBarcodeQuery } from '@/lib/api/hooks/use-barcode-query';
import BarcodeService from '@/lib/api/barcode-service';
import { BarcodeItem } from '@/lib/api/types';
import { AdjustBarcodeQuantityDialog, PrintBarcodeDialog } from './index';

interface IProductData {
  id: string;
  skuCode: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  location: string;
  expiry: string;
  status: 'Active' | 'Expiring Soon' | 'Out of Stock' | 'Low Stock';
  barcodeStatus: 'Print Active' | 'Print Pending' | 'Printed' | 'Print Error';
  originalData?: BarcodeItem;
}

function ActionsCell({ row, onEdit, onAdjustQty, onPrint, onDelete }: {
  row: Row<IProductData>;
  onEdit: (data: IProductData) => void;
  onAdjustQty: (data: IProductData) => void;
  onPrint: (data: IProductData) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem onClick={() => onEdit(row.original)}>Edit Product</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdjustQty(row.original)}>Adjust Quantity</DropdownMenuItem>
        {/* <DropdownMenuItem onClick={handleCopySKU}>Copy SKU</DropdownMenuItem> */}
        <DropdownMenuItem onClick={() => onPrint(row.original)}>Print Barcode</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(parseInt(row.original.id))}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const StoreProductsBarcodes = () => {
  const router = useRouter();
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
  const [adjustDialog, setAdjustDialog] = useState<{ open: boolean; id: number | null; currentQty?: number }>({ open: false, id: null });
  const [printDialog, setPrintDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const selectedStatusNumber = useMemo(() => {
    const map: Record<string, number> = {
      'Active': 1,
      'Expiring Soon': 2,
      'Out of Stock': 3,
      'Low Stock': 4,
    };
    return selectedStatuses[0] ? map[selectedStatuses[0]] : undefined;
  }, [selectedStatuses]);

  const { data: apiData } = useBarcodeQuery({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    search: searchQuery || undefined,
    status: selectedStatusNumber,
    sort_by: sortOrder === 'oldest' ? 'oldest' : 'latest',
  });

  const rows = useMemo<IProductData[]>(() => {
    const content = apiData?.data?.barcodes?.content ?? [];
    const mapStatus = (s: number): IProductData['status'] => {
      switch (s) {
        case 1: return 'Active';
        case 2: return 'Expiring Soon';
        case 3: return 'Out of Stock';
        case 4: return 'Low Stock';
        default: return 'Active';
      }
    };
    const mapBarcodeStatus = (s: number): IProductData['barcodeStatus'] => {
      switch (s) {
        case 1: return 'Print Active';
        case 2: return 'Print Pending';
        case 3: return 'Printed';
        case 4: return 'Print Error';
        default: return 'Print Active';
      }
    };
    return content.map((item) => ({
      id: String(item.bar_code_id),
      skuCode: item.sku_code,
      productName: item.product_name,
      batchNumber: item.batch_number,
      quantity: item.quantity,
      location: item.location,
      expiry: item.expiry_date,
      status: mapStatus(item.status),
      barcodeStatus: mapBarcodeStatus(item.bar_code_status),
      originalData: item,
    }));
  }, [apiData]);

  const statusCounts = useMemo(() => {
    const counts = apiData?.data?.status_counts || {};
    return {
      Active: counts['1'] || 0,
      'Expiring Soon': counts['2'] || 0,
      'Out of Stock': counts['3'] || 0,
      'Low Stock': counts['4'] || 0,
    } as Record<string, number>;
  }, [apiData]);

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

  const getBarcodeStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Print Active':
        return 'success';
      case 'Print Pending':
        return 'warning';
      case 'Printed':
        return 'secondary';
      case 'Print Error':
        return 'destructive';
      default:
        return 'secondary';
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
          <DataGridColumnHeader title="Qty" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-foreground font-normal">
            {row.original.quantity}
          </span>
        ),
        enableSorting: true,
        size: 80,
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
          <DataGridColumnHeader title="Expiry" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-foreground font-normal">
            {row.original.expiry}
          </span>
        ),
        enableSorting: true,
        size: 100,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'barcodeStatus',
        accessorFn: (row) => row.barcodeStatus,
        header: ({ column }) => (
          <DataGridColumnHeader title="Barcode Status" column={column} />
        ),
        cell: ({ row }) => (
          <Badge variant={getBarcodeStatusBadgeVariant(row.original.barcodeStatus)} size="sm">
            {row.original.barcodeStatus}
          </Badge>
        ),
        enableSorting: true,
        size: 160,
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
              <Button
                mode="link"
                underlined="dashed"
                size="sm"
                onClick={() => {
                  const r = row.original;
                  const statusToNumber: Record<IProductData['status'], number> = {
                    'Active': 1,
                    'Expiring Soon': 2,
                    'Out of Stock': 3,
                    'Low Stock': 4,
                  };
                  const barcodeStatusToNumber: Record<IProductData['barcodeStatus'], number> = {
                    'Print Active': 1,
                    'Print Pending': 2,
                    'Printed': 3,
                    'Print Error': 4,
                  };
                  const payload = {
                    bar_code_id: parseInt(r.id),
                    sku_code: r.skuCode,
                    product_name: r.productName,
                    batch_number: r.batchNumber,
                    quantity: r.quantity,
                    location: r.location,
                    expiry_date: r.expiry,
                    status: statusToNumber[r.status],
                    bar_code_status: barcodeStatusToNumber[r.barcodeStatus],
                  };
                  const q = encodeURIComponent(JSON.stringify(payload));
                  router.push(`/inventory/barcodes/add?mode=edit&data=${q}`);
                }}
              >
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
        cell: ({ row }) => (
          <ActionsCell
            row={row}
            onEdit={(r) => {
              const statusToNumber: Record<IProductData['status'], number> = {
                'Active': 1,
                'Expiring Soon': 2,
                'Out of Stock': 3,
                'Low Stock': 4,
              };
              const barcodeStatusToNumber: Record<IProductData['barcodeStatus'], number> = {
                'Print Active': 1,
                'Print Pending': 2,
                'Printed': 3,
                'Print Error': 4,
              };
              const payload = {
                bar_code_id: parseInt(r.id),
                sku_code: r.skuCode,
                product_name: r.productName,
                batch_number: r.batchNumber,
                quantity: r.quantity,
                location: r.location,
                expiry_date: r.expiry,
                status: statusToNumber[r.status],
                bar_code_status: barcodeStatusToNumber[r.barcodeStatus],
              };
              const q = encodeURIComponent(JSON.stringify(payload));
              router.push(`/inventory/barcodes/add?mode=edit&data=${q}`);
            }}
            onAdjustQty={(r) => setAdjustDialog({ open: true, id: parseInt(r.id), currentQty: r.quantity })}
            onPrint={(r) => setPrintDialog({ open: true, id: parseInt(r.id) })}
            onDelete={async (id) => {
              if (!confirm('Are you sure you want to delete this barcode?')) return;
              try {
                const res = await BarcodeService.delete({ bar_code_ids: String(id) });
                toast.success(res.message || 'Deleted');
                window.location.reload();
              } catch (e: any) {
                toast.error(e?.message || 'Delete failed');
              }
            }}
          />
        ),
        enableSorting: false,
        size: 60,
        meta: {
          headerClassName: '',
        },
      },
    ],
    [router],
  );

  const table = useReactTable({
    columns,
    data: rows,
    pageCount: apiData?.data?.barcodes?.totalPages || 1,
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
    <>
      <AdjustBarcodeQuantityDialog
        open={adjustDialog.open}
        onOpenChange={(open) => setAdjustDialog({ open, id: null })}
        barCodeId={adjustDialog.id || 0}
        currentQuantity={adjustDialog.currentQty || 0}
      />
      <PrintBarcodeDialog
        open={printDialog.open}
        onOpenChange={(open) => setPrintDialog({ open, id: null })}
        barCodeId={printDialog.id || 0}
      />
      <DataGrid
        table={table}
        recordCount={rows?.length || 0}
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
            <div className="flex   flex-wrap items-center gap-2.5 py-2">
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
             <div className="w-full overflow-x-auto">
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
            </div>
          </ScrollArea>
          
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
    </>
  );
};

export { StoreProductsBarcodes };