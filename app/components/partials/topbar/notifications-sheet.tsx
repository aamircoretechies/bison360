'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Item1 from './notifications/item-1';
import Item2 from './notifications/item-2';
import Item3 from './notifications/item-3';
import Item4 from './notifications/item-4';
import Item5 from './notifications/item-5';
import Item6 from './notifications/item-6';

export function NotificationsSheet({ trigger }: { trigger: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent 
        className="p-0 gap-0 sm:w-[500px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 sm:max-w-none [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5"
        style={{ backgroundColor: '#f4f0eb' }}
      >
        <SheetHeader className="mb-0">
          <SheetTitle className="p-3">
            Notifications
          </SheetTitle>
        </SheetHeader>
        <SheetBody className="p-0">
          <ScrollArea className="h-[calc(100vh-10.5rem)]">
            <Tabs defaultValue="all" className="w-full relative">
              <TabsList variant="line" className="w-full px-5 mb-5">
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>

              {/* All Tab */}
              <TabsContent value="all" className="mt-0">
                <div className="flex flex-col gap-5">
                 
                  <Item3
                    userName="Guy Hawkins"
                    avatar="300-27.png"
                    badgeColor="offline"
                    description="requested access to"
                    link="AirSpace"
                    day="project"
                    date="14 hours ago"
                    info="Dev Team"
                  />
                  <div className="border-b border-b-border"></div>
                  <Item4 />
                  <div className="border-b border-b-border"></div>
                  <Item5
                    userName="Raymond Pawell"
                    avatar="300-11.png"
                    badgeColor="online"
                    description="posted a new article"
                    link="2024 Roadmap"
                    day=""
                    date="1 hour ago"
                    info="Roadmap"
                  />
                 
                </div>
              </TabsContent>

            </Tabs>
          </ScrollArea>
        </SheetBody>
        <SheetFooter className="border-t border-border p-5 grid grid-cols-2 gap-2.5">
          <Button variant="outline">Archive all</Button>
          <Button variant="outline">Mark all as read</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
