import { DropdownMenu4 } from '@/partials/dropdown-menu/dropdown-menu-4';
import { useState } from 'react';
import {
  EllipsisVertical,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Card2 } from '@/app/(protected)/store-client/components/common/card2';
import { Card3 } from '@/app/(protected)/store-client/components/common/card3';

interface ISearchResultsGridContentItem {
  logo: string;
  title: string;
  total: string;
  label?: string;
  badge?: boolean;
  star: string;
  sku: string;
  category1: string;
  category2: string;
}
type ISearchResultsGridContentItems = Array<ISearchResultsGridContentItem>;

const RecentOrders = () => {
  

  const items: ISearchResultsGridContentItems = [
    {
      logo: '2.png',
      title: 'Cloud Shift Lightweight Runner Pro Edition',
      total: '99.00',
      star: '5.0',
      sku: 'SH-001-BLK-42',
      category1: 'Nike',
      category2: 'Picked Up',
    },
    {
      logo: '3.png',
      title: 'Titan Edge High Impact Stability Lightweight Trainers',
      total: '65.99',
      star: '3.5',
      sku: 'SNK-XY-WHT-10',
      category1: 'Adidas',
      category2: 'Shipped',
    },
    {
      logo: '4.png',
      title: 'Wave Strike Dynamic Boost Sneaker',
      total: '120.00',
      star: '4.7',
      sku: 'BT-A1-YLW-8',
      category1: 'Timberland',
      category2: 'Pending',
    },
    {
      logo: '15.png',
      title: 'Wave Strike Dynamic Boost Sneaker',
      total: '140.00',
      label: '$179.00',
      badge: true,
      star: '3.2',
      sku: 'SD-Z9-BRN-39',
      category1: 'Birkenstock',
      category2: 'Sandals',
    },
    {
      logo: '5.png',
      title: 'Cloud Shift Lightweight Runner Pro Edition',
      total: '99.00',
      label: '$140.00',
      badge: true,
      star: '4.1',
      sku: 'WRK-77-BLK-9',
      category1: 'Dr. Martens',
      category2: 'Work Shoes',
    },
    {
      logo: '3.png',
      title: 'Titan Edge High Impact Stability Lightweight Trainers',
      total: '65.99',
      star: '3.5',
      sku: 'SNK-555-GRY-11',
      category1: 'New Balance',
      category2: 'Sneakers',
    },
    {
      logo: '2.png',
      title: 'Velocity Boost Xtreme High  Shock Absorbers',
      total: '280.00',
      label: '$315.00',
      badge: true,
      star: '4.9',
      sku: 'SH-222-BLU-40',
      category1: 'Puma',
      category2: 'Sneakers',
    },
    {
      logo: '14.png',
      title: 'Velocity Boost Xtreme High  Shock Absorbers',
      total: '110.00',
      star: '4.9',
      sku: 'BT-777-BLK-9',
      category1: 'UGG',
      category2: 'Boots',
    },
    {
      logo: '8.png',
      title: 'Cloud Shift Lightweight Runner Pro Edition',
      total: '99.00',
      star: '5.0',
      sku: 'SD-999-TAN-38',
      category1: 'Crocs',
      category2: 'Sandals',
    },
    {
      logo: '4.png',
      title: 'Titan Edge High Impact Stability Lightweight Trainers',
      total: '46.00',
      label: '$110.00',
      badge: true,
      star: '3.5',
      sku: 'WRK-333-GRN-10',
      category1: 'Caterpillar',
      category2: 'Work Shoes',
    },
    {
      logo: '9.png',
      title: 'Wave Strike Dynamic Boost Sneaker',
      total: '120.00',
      star: '4.7',
      sku: 'SNK-888-RED-42',
      category1: 'Reebok',
      category2: 'Sneakers',
    },
    {
      logo: '10.png',
      title: 'Velocity Boost Xtreme High  Shock Absorbers',
      total: '110.00',
      star: '4.9',
      sku: 'BT-444-BRN-7',
      category1: 'Columbia',
      category2: 'Hiking Boots',
    },
  ];

  type SearchResultsType = 'list' | 'card';

 const renderItem = (item: ISearchResultsGridContentItem, index: number) => {
  const [activeTab, setActiveTab] = useState<SearchResultsType>('list');
    const props = {
      logo: item.logo,
      star: item.star,
      sku: item.sku,
      title: item.title,
      total: item.total,
      label: item.label,
      badge: item.badge,
      category1: item.category1,
      category2: item.category2,
    };
    return activeTab === 'card' ? (
      <Card2 key={index} {...props} />
    ) : (
      <Card3 key={index} {...props} />
    );
  };

  return (
    <Card className="h-full border-0 ">
      <CardHeader>
        <CardTitle>Recent Orders  </CardTitle>
        <DropdownMenu4
          trigger={
            <Button variant="ghost" mode="icon">
              <EllipsisVertical />
            </Button>
          }
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
         {items.slice(0, 3).map((item, index) => {
          return renderItem(item, index);
        })}
      </CardContent>
    </Card>
  );
};

export {
  RecentOrders,

};
