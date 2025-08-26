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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, DollarSign, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function POSOrdersPage() {
  const { settings } = useSettings();

  const posStats = {
    totalSales: 1250.75,
    totalOrders: 45,
    averageOrder: 27.79,
    customersServed: 38,
  };

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                In-store sales and POS transactions
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline">Export Sales</Button>
              <Button variant="primary" asChild>
                <Link href="/orders/pos/new-sale">New Sale</Link>
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <div className="space-y-6">
          {/* POS Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-bold">${posStats.totalSales.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{posStats.totalOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Order</p>
                    <p className="text-2xl font-bold">${posStats.averageOrder.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Customers</p>
                    <p className="text-2xl font-bold">{posStats.customersServed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* POS Interface Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>POS System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">POS Interface</h3>
                <p className="text-gray-500 mb-4">
                  This would integrate with your physical POS system for in-store sales tracking.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="primary" asChild>
                    <Link href="/orders/pos/new-sale">Start New Sale</Link>
                  </Button>
                  <Button variant="outline">View Recent Sales</Button>
                  <Button variant="outline">Cash Drawer Report</Button>
                  <Button variant="outline">Daily Summary</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent POS Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent POS Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'POS-001', customer: 'Walk-in Customer', amount: 45.99, method: 'Cash', time: '2:30 PM' },
                  { id: 'POS-002', customer: 'John Doe', amount: 67.50, method: 'Credit Card', time: '2:15 PM' },
                  { id: 'POS-003', customer: 'Walk-in Customer', amount: 23.75, method: 'EBT', time: '2:00 PM' },
                  { id: 'POS-004', customer: 'Jane Smith', amount: 89.25, method: 'Credit Card', time: '1:45 PM' },
                ].map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{transaction.id}</p>
                      <p className="text-sm text-muted-foreground">{transaction.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" size="sm">{transaction.method}</Badge>
                        <span className="text-sm text-muted-foreground">{transaction.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Fragment>
  );
}
