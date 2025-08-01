'use client';

import Link from 'next/link';
import { DropdownMenu4 } from '@/partials/dropdown-menu/dropdown-menu-4';
import { DropdownMenu7 } from '@/partials/dropdown-menu/dropdown-menu-7';
import { EllipsisVertical } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface IRecentUploadsItem {
  image: string;
  desc: string;
  date: string;
}
type IRecentUploadsItems = Array<IRecentUploadsItem>;

interface IRecentUploadsProps {
  title: string;
}

const Compliance = ({ title }: IRecentUploadsProps) => {
  const items: IRecentUploadsItems = [
    {
      image: 'pdf.svg',
      desc: 'Generate USDA Report',
      date: '4.7 MB 26 Sep 2024 3:20 PM',
    },
    {
      image: 'doc.svg',
      desc: 'Download Z-Report',
      date: '2.3 MB 1 Oct 2024 12:00 PM',
    },
    {
      image: 'ai.svg',
      desc: 'Audit Logs',
      date: '0.8 MB 17 Oct 2024 6:46 PM',
    },
    {
      image: 'js.svg',
      desc: 'Inventory Shrinkage Report',
      date: '0.2 MB 4 Nov 2024 11:30 AM',
    },
  ];

  const renderItem = (item: IRecentUploadsItem, index: number) => {
    return (
      <div key={index} className="flex items-center gap-3">
        <div className="flex items-center grow gap-2.5">
          <img
            src={toAbsoluteUrl(`/media/file-types/${item.image}`)}
            alt="image"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-mono cursor-pointer hover:text-primary mb-px">
              {item.desc}
            </span>
            <span className="text-xs text-secondary-foreground">
              {item.date}
            </span>
          </div>
        </div>
        <DropdownMenu7
          trigger={
            <Button variant="ghost" mode="icon">
              <EllipsisVertical />
            </Button>
          }
        />
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <DropdownMenu4
          trigger={
            <Button variant="ghost" mode="icon">
              <EllipsisVertical />
            </Button>
          }
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-2.5 lg:gap-5">
          {items.map((item, index) => {
            return renderItem(item, index);
          })}
        </div>
      </CardContent>
      
    </Card>
  );
};

export {
  Compliance,
  type IRecentUploadsItem,
  type IRecentUploadsItems,
  type IRecentUploadsProps,
};
