'use client';

import { Fragment } from 'react';
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
import { SalesDashboardContent } from './content';
import { Download, FileText, BarChart3 } from 'lucide-react';

export default function SalesDashboardPage() {
  const { settings } = useSettings();

  // Sample data for KPI display
  const salesStats = {
    totalSales: 34256.90,
    totalTransactions: 412,
    averageOrder: 83.15,
    growth: 15.7,
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
                  <span className="text-base text-secondary-foreground">Total Sales:</span>
                  <span className="text-base text-ray-800 font-semibold me-2">${salesStats.totalSales.toFixed(2)}</span>
                  <span className="text-base text-secondary-foreground">Transactions</span>
                  <span className="text-base text-foreground font-semibold">{salesStats.totalTransactions}</span>
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
                <BarChart3 className="h-4 w-4 mr-2" />
                Sales Report
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <SalesDashboardContent />
      </Container>
    </Fragment>
  );
}
