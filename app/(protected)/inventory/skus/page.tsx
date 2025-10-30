'use client';

import { Fragment, useMemo } from 'react';
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
import { NetworkStoreClientsContent } from '@/app/(protected)/inventory/skus/content';
import { useSkuBatchesQuery } from '@/lib/api/hooks/use-sku-batches-query';

export default function NetworkStoreClientsPage() {
  const { settings } = useSettings();
  const { data } = useSkuBatchesQuery({ page: 0, size: 10 });
  const { totalCount, activeCount } = useMemo(() => {
    const counts = data?.data?.status_counts || {};
    const total = Object.values(counts).reduce((a: number, b: any) => a + (Number(b) || 0), 0);
    return { totalCount: total, activeCount: Number(counts['1'] || 0) };
  }, [data]);

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
                  <span className="text-base text-ray-800 font-semibold me-2">{totalCount || 0}</span>
                  <span className="text-base text-secondary-foreground">
                    Active
                  </span>
                  <span className="text-base text-foreground font-semibold">{activeCount || 0}</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline">Import CSV</Button>
              <Button variant="primary" asChild>
                <a href="/inventory/skus/add">Add New</a>
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
