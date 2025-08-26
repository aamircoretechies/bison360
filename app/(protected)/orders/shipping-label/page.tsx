'use client';

import { Fragment, useState } from 'react';
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
import { ShippingLabelContent } from './content';
import { Download, Printer } from 'lucide-react';

export default function ShippingLabelPage() {
  const { settings } = useSettings();

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                Generate shipping labels for orders
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Label
              </Button>
              <Button variant="primary" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print Label
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <ShippingLabelContent />
      </Container>
    </Fragment>
  );
}
