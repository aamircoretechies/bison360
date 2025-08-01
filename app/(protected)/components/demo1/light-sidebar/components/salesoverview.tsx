import { DropdownMenu4 } from '@/partials/dropdown-menu/dropdown-menu-4';
import {
  RemixiconComponentType,
  RiBankLine,
  RiFacebookCircleLine,
  RiGoogleLine,
  RiInstagramLine,
  RiStore2Line,
} from '@remixicon/react';
import {
  ArrowDown,
  ArrowUp,
  EllipsisVertical,
  type LucideIcon,
} from 'lucide-react';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ISalesOverviewsRow {
  icon: LucideIcon | RemixiconComponentType;
  text: string;
  total: number;
  stats?: number;
  increase?: boolean;
}
type ISalesOverviewsRows = Array<ISalesOverviewsRow>;

interface ISalesOverviewsItem {
  badgeColor: string;
  label: string;
}
type ISalesOverviewsItems = Array<ISalesOverviewsItem>;

interface ISalesOverviewsProps {
  limit?: number;
}

const SalesOverview = ({ limit }: ISalesOverviewsProps) => {
  const rows: ISalesOverviewsRows = [
    {
      icon: RiStore2Line,
      text: 'POS',
      total: 1000,
      stats: 65,
      increase: true,
    },
    {
      icon: RiStore2Line,
      text: 'Online',
      total: 520,
      stats: 35,
      increase: true,
    },
  ];
   const rows2: ISalesOverviewsRows = [
    {
      icon: RiStore2Line,
      text: 'EBT',
      total: 200,
    },
    {
      icon: RiStore2Line,
      text: 'CC',
      total: 650,
    },
     {
      icon: RiStore2Line,
      text: 'Cash',
      total: 670,
    },
    {
      icon: RiStore2Line,
      text: 'Refunds',
      total: 2,
    },
    {
      icon: RiStore2Line,
      text: 'Coupon Used',
      total: 3,
    },
  ];


  const renderRow = (row: ISalesOverviewsRow, index: number) => {
    return (
      <div
        key={index}
        className="flex items-center justify-between flex-wrap gap-2"
      >
        <div className="flex items-center gap-1.5">
         <row.icon className="size-4.5 text-muted-foreground" />
          <span className="text-sm font-normal text-mono">{row.text}</span>
        </div>
        <div className="flex items-center text-sm font-bold text-foreground gap-6">
          <span className="lg:text-right">${row.total}</span>
          <span className="flex items-center justify-end gap-1">
            {row.increase ? (
              <ArrowUp className="text-green-500 size-4" />
            ) : (
              <ArrowDown className="text-destructive size-4" />
            )}
            {row.stats}%
          </span>
        </div>
      </div>
    );
  };

  const renderRow2 = (row: ISalesOverviewsRow, index: number) => {
    return (
      <div
        key={index}
        className="flex items-center justify-between flex-wrap gap-2"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-normal text-gray-500">{row.text}</span>
        </div>
        <div className="flex items-center text-sm font-bold text-foreground gap-6 ">
          <span className="lg:text-right">${row.total}</span>
        </div>
      </div>
    );
  };



  return (
    <Card className="h-full border-0 ">
      <CardHeader>
        <CardTitle>Sales Overview  </CardTitle>
        <DropdownMenu4
          trigger={
            <Button variant="ghost" mode="icon">
              <EllipsisVertical />
            </Button>
          }
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
        <div className="grid gap-3">{rows.slice(0, limit).map(renderRow)}</div>
        <div className="grid grid-cols-1 gap-2 border-t pt-2">{rows2.map(renderRow2)}</div>
      </CardContent>
    </Card>
  );
};

export {
  SalesOverview,
  type ISalesOverviewsRow,
  type ISalesOverviewsRows,
  type ISalesOverviewsItem,
  type ISalesOverviewsItems,
  type ISalesOverviewsProps,
};
