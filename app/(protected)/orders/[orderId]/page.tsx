'use client';

import { Fragment, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { OrderDetailContent } from './content';
import { ArrowLeft, Package, Truck, CheckCircle, FileText, Printer } from 'lucide-react';

export default function OrderDetailPage() {
  const { settings } = useSettings();
  const params = useParams();
  const orderId = params.orderId as string;

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/orders/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Orders
                  </Link>
                </Button>
                <div>
                  <ToolbarPageTitle />
                  <ToolbarDescription>
                    Order ID: {orderId}
                  </ToolbarDescription>
                </div>
              </div>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Print Order
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print Label
              </Button>
              <Button variant="primary" size="sm">
                <Package className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <OrderDetailContent orderId={orderId} />
      </Container>
    </Fragment>
  );
}
