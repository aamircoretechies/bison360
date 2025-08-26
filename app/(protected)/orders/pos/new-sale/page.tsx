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
import { NewSaleContent } from './content';
import { ArrowLeft, ShoppingCart, CreditCard, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function NewSalePage() {
  const { settings } = useSettings();

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/orders/pos">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to POS
                  </Link>
                </Button>
                <div>
                  <ToolbarPageTitle />
                  <ToolbarDescription>
                    Process new sale transaction
                  </ToolbarDescription>
                </div>
              </div>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <DollarSign className="h-4 w-4 mr-2" />
                Manager Override
              </Button>
              <Button variant="outline" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Test Payment
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <NewSaleContent />
      </Container>
    </Fragment>
  );
}
