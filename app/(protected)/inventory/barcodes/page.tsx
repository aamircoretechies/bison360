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
import { NetworkStoreClientsContent } from '@/app/(protected)/inventory/barcodes/content';
import { useBarcodeQuery } from '@/lib/api/hooks/use-barcode-query';

export default function NetworkStoreClientsPage() {
  const { settings } = useSettings();
  const { data: barcodeData } = useBarcodeQuery({}); // Fetch all data for counts

  const statusCounts = barcodeData?.data?.status_counts || {};
  const allBarcodes = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
  const activeBarcodes = statusCounts['1'] || 0; // Assuming '1' is Active status

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-base text-secondary-foreground">
                    All SKUs:
                  </span>
                  <span className="text-base text-ray-800 font-semibold me-2">
                    {allBarcodes}
                  </span>
                  <span className="text-base text-secondary-foreground">
                    Active
                  </span>
                  <span className="text-base text-foreground font-semibold">
                    {activeBarcodes}
                  </span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline">Import CSV</Button>
              <Button variant="primary" asChild>
                <a href="/inventory/barcodes/add">Add New</a>
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <NetworkStoreClientsContent />
      </Container>
    </Fragment>
  );
}
