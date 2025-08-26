'use client';

import { Fragment, useMemo, useState } from 'react';
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
import { OrdersDashboardContent } from './content';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Printer } from 'lucide-react';

export default function OrdersDashboardPage() {
  const { settings } = useSettings();

  // Sample data for KPI display
  const orderStats = {
    total: 156,
    pending: 23,
    picked: 12,
    packed: 8,
    shipped: 45,
    delivered: 68,
  };

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-base text-secondary-foreground">Total Orders:</span>
                  <span className="text-base text-ray-800 font-semibold me-2">{orderStats.total}</span>
                  <span className="text-base text-secondary-foreground">Pending</span>
                  <span className="text-base text-foreground font-semibold">{orderStats.pending}</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print Orders
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <OrdersDashboardContent />
      </Container>
    </Fragment>
  );
}
