'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

interface DropdownAppsItem {
  logo: string;
  title: string;
  description: string;
  checkbox: boolean;
}

export function AppsDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const items: DropdownAppsItem[] = [
    {
      logo: 'grownby.svg',
      title: 'GrownBy ',
      description: 'eCommerce',
      checkbox: false,
    },
    {
      logo: 'stripe.svg',
      title: 'Stripe ',
      description: 'online payments',
      checkbox: true,
    },
    {
      logo: 'squarepos.svg',
      title: 'Square POS',
      description: 'in-person sales + EBT',
      checkbox: true,
    },
    {
      logo: 'salesforce.svg',
      title: 'Salesforce ',
      description: 'CRM',
      checkbox: false,
    },
    {
      logo: 'easypost.svg',
      title: 'EasyPost / Shippo',
      description: 'shipping & labels',
      checkbox: true,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[325px] p-0" side="bottom" align="end">
        <div className="flex items-center justify-between gap-2.5 text-xs text-secondary-foreground font-medium px-5 py-3 border-b border-b-border">
          <span>Apps</span>
          <span>Enabled</span>
        </div>
        <div className="flex flex-col scrollable-y-auto max-h-[400px] divide-y divide-border">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between flex-wrap gap-2 px-5 py-3.5"
            >
              <div className="flex items-center flex-wrap gap-2">
                <div className="flex items-center justify-center shrink-0 rounded-full bg-accent/60 border border-border size-10">
                  <img
                    src={toAbsoluteUrl(`/media/brand-logos/${item.logo}`)}
                    className="size-6"
                    alt={item.title}
                  />
                </div>

                <div className="flex flex-col">
                  <a
                    href="#"
                    className="text-sm font-semibold text-mono hover:text-primary-active"
                  >
                    {item.title}
                  </a>
                  <span className="text-xs font-medium text-secondary-foreground">
                    {item.description}
                  </span>
                </div>
              </div>
              <Switch defaultChecked={item.checkbox} size="sm"></Switch>
            </div>
          ))}
        </div>
        <div className="grid p-5 border-t border-t-border">
          <Button asChild variant="outline" size="sm">
            <Link href="#">Go to Apps</Link> 
           {/*  <Link href="/account/api-keys">Go to Apps</Link> */}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
