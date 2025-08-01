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

interface IHighlightsRow {
  icon: LucideIcon | RemixiconComponentType;
  text: string;
  total: number;
  stats: number;
  increase: boolean;
}
type IHighlightsRows = Array<IHighlightsRow>;

interface IHighlightsItem {
  badgeColor: string;
  label: string;
}
type IHighlightsItems = Array<IHighlightsItem>;

interface IHighlightsProps {
  limit?: number;
}

const Highlights = ({ limit }: IHighlightsProps) => {
  const rows: IHighlightsRows = [
    {
      icon: RiStore2Line,
      text: 'Available',
      total: 172,
      stats: 3.9,
      increase: true,
    },
    {
      icon: RiStore2Line,
      text: 'Sick',
      total: 4,
      stats: 3.9,
      increase: true,
    },
    {
      icon: RiStore2Line,
      text: 'Harvested',
      total: 8,
      stats: 3.9,
      increase: true,
    },
   
  ];

  const items: IHighlightsItems = [
    { badgeColor: 'bg-green-500', label: 'Available' },
    { badgeColor: 'bg-destructive', label: 'Sick' },
    { badgeColor: 'bg-violet-500', label: 'Harvested Today' },
  ];

  const renderRow = (row: IHighlightsRow, index: number) => {
    return (
      <div
        key={index}
        className="flex items-center justify-between flex-wrap gap-2"
      >
        <div className="flex items-center gap-1.5">
          <row.icon className="size-4.5 text-muted-foreground" />
          <span className="text-sm font-normal text-mono">{row.text}</span>
        </div>
        <div className="flex items-center text-sm font-medium text-foreground gap-6">
          <span className="lg:text-right">{row.total}</span>
         
        </div>
      </div>
    );
  };

  const renderItem = (item: IHighlightsItem, index: number) => {
    return (
      <div key={index} className="flex items-center gap-1.5">
        <BadgeDot className={item.badgeColor} />
        <span className="text-sm font-normal text-foreground">
          {item.label}
        </span>
      </div>
    );
  };

  return (
    <Card className="h-full border-0 ">
      <CardHeader>
        <CardTitle>Livestock Status  </CardTitle>
        <DropdownMenu4
          trigger={
            <Button variant="ghost" mode="icon">
              <EllipsisVertical />
            </Button>
          }
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
       <h3></h3>
        <div className="flex items-center gap-1 mb-1.5">
          <div className="bg-green-500 h-2 w-full max-w-[60%] rounded-xs"></div>
          <div className="bg-destructive h-2 w-full max-w-[25%] rounded-xs"></div>
          <div className="bg-violet-500 h-2 w-full max-w-[15%] rounded-xs"></div>
        </div>
        <div className="flex items-center flex-wrap gap-4 mb-1">
          {items.map((item, index) => {
            return renderItem(item, index);
          })}
        </div>
        <div className="border-b border-input"></div>
        <div className="grid gap-3">{rows.slice(0, limit).map(renderRow)}</div>
      </CardContent>
    </Card>
  );
};

export {
  Highlights,
  type IHighlightsRow,
  type IHighlightsRows,
  type IHighlightsItem,
  type IHighlightsItems,
  type IHighlightsProps,
};
