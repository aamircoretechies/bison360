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
import { TransactionsLogContent } from './content';
import { Download, FileText, Receipt, Filter } from 'lucide-react';

export default function TransactionsLogPage() {
  const { settings } = useSettings();

  // Sample data for KPI display
  const transactionStats = {
    totalTransactions: 8,
    completed: 7,
    pending: 1,
    failed: 0,
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
                  <span className="text-base text-secondary-foreground">Total Transactions:</span>
                  <span className="text-base text-ray-800 font-semibold me-2">{transactionStats.totalTransactions}</span>
                  <span className="text-base text-secondary-foreground">Completed</span>
                  <span className="text-base text-foreground font-semibold">{transactionStats.completed}</span>
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
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <TransactionsLogContent />
      </Container>
    </Fragment>
  );
}
