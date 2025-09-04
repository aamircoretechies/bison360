'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  CreditCard, 
  Receipt,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { toast } from 'sonner';
import { OfflinePOSBanner } from '../components/offline-pos-banner';

interface Transaction {
  id: string;
  transactionId: string;
  paymentMethod: 'POS' | 'Online' | 'Cash' | 'EBT' | 'CC';
  amount: number;
  date: string;
  linkedOrderId?: string;
  status: 'completed' | 'pending' | 'failed';
}

interface SalesData {
  period: string;
  totalSales: number;
  transactionCount: number;
  averageOrderValue: number;
  growth: number;
}

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    transactionId: 'TXN-2024-001',
    paymentMethod: 'POS',
    amount: 89.99,
    date: '2024-01-15T10:30:00Z',
    linkedOrderId: 'ORD-2024-001',
    status: 'completed',
  },
  {
    id: '2',
    transactionId: 'TXN-2024-002',
    paymentMethod: 'Online',
    amount: 156.50,
    date: '2024-01-15T09:15:00Z',
    linkedOrderId: 'ORD-2024-002',
    status: 'completed',
  },
  {
    id: '3',
    transactionId: 'TXN-2024-003',
    paymentMethod: 'Cash',
    amount: 234.75,
    date: '2024-01-15T08:45:00Z',
    status: 'completed',
  },
  {
    id: '4',
    transactionId: 'TXN-2024-004',
    paymentMethod: 'CC',
    amount: 67.25,
    date: '2024-01-14T16:20:00Z',
    linkedOrderId: 'ORD-2024-004',
    status: 'completed',
  },
  {
    id: '5',
    transactionId: 'TXN-2024-005',
    paymentMethod: 'EBT',
    amount: 189.99,
    date: '2024-01-13T14:10:00Z',
    linkedOrderId: 'ORD-2024-005',
    status: 'completed',
  },
];

const sampleSalesData: SalesData[] = [
  {
    period: 'Today',
    totalSales: 1247.48,
    transactionCount: 15,
    averageOrderValue: 83.17,
    growth: 12.5,
  },
  {
    period: 'This Week',
    totalSales: 8923.75,
    transactionCount: 108,
    averageOrderValue: 82.63,
    growth: 8.3,
  },
  {
    period: 'This Month',
    totalSales: 34256.90,
    transactionCount: 412,
    averageOrderValue: 83.15,
    growth: 15.7,
  },
];

function getPaymentMethodLabel(method: string) {
  switch (method) {
    case 'POS':
      return 'POS Terminal';
    case 'Online':
      return 'Online Order';
    case 'Cash':
      return 'Cash Payment';
    case 'EBT':
      return 'EBT Card';
    case 'CC':
      return 'Credit Card';
    default:
      return method;
  }
}

function getPaymentMethodBadgeVariant(method: string) {
  switch (method) {
    case 'POS':
      return 'default';
    case 'Online':
      return 'secondary';
    case 'Cash':
      return 'success';
    case 'EBT':
      return 'info';
    case 'CC':
      return 'warning';
    default:
      return 'secondary';
  }
}

export function SalesDashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const currentSalesData = useMemo(() => {
    return sampleSalesData.find(data => 
      data.period.toLowerCase().includes(selectedPeriod.toLowerCase())
    ) || sampleSalesData[0];
  }, [selectedPeriod]);

  const filteredTransactions = useMemo(() => {
    if (selectedPeriod === 'today') {
      return sampleTransactions.filter(t => 
        new Date(t.date).toDateString() === new Date().toDateString()
      );
    } else if (selectedPeriod === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sampleTransactions.filter(t => new Date(t.date) >= weekAgo);
    } else if (selectedPeriod === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return sampleTransactions.filter(t => new Date(t.date) >= monthAgo);
    }
    return sampleTransactions;
  }, [selectedPeriod]);

  const paymentMethodStats = useMemo(() => {
    const stats = filteredTransactions.reduce((acc, transaction) => {
      const method = transaction.paymentMethod;
      if (!acc[method]) {
        acc[method] = { count: 0, total: 0 };
      }
      acc[method].count++;
      acc[method].total += transaction.amount;
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

    return Object.entries(stats).map(([method, data]) => ({
      method,
      count: data.count,
      total: data.total,
      percentage: (data.count / filteredTransactions.length) * 100,
    }));
  }, [filteredTransactions]);

  const handleExport = (format: 'csv' | 'pdf') => {
    toast.success(`${format.toUpperCase()} export started`);
    // In real implementation, this would trigger the export
  };

  return (
    <div className="space-y-6">
      {/* Offline POS Banner */}
      <OfflinePOSBanner 
        onSync={async () => {
          toast.success('Sync completed successfully!');
        }}
        onViewQueue={() => {
          toast.info('Viewing sync queue...');
        }}
      />

      {/* Period Selector */}
      <div className="flex items-center gap-2">
        <Button
          variant={selectedPeriod === 'today' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedPeriod('today')}
        >
          Today
        </Button>
        <Button
          variant={selectedPeriod === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedPeriod('week')}
        >
          This Week
        </Button>
        <Button
          variant={selectedPeriod === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedPeriod('month')}
        >
          This Month
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentSalesData.totalSales.toFixed(2)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {currentSalesData.growth > 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              {Math.abs(currentSalesData.growth)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSalesData.transactionCount}</div>
            <div className="text-xs text-muted-foreground">
              {paymentMethodStats.length} payment methods
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentSalesData.averageOrderValue.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">
              Per transaction
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSalesData.growth}%</div>
            <div className="text-xs text-muted-foreground">
              vs previous period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Sales Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Payment Method Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethodStats.map((stat) => (
                  <div key={stat.method} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={getPaymentMethodBadgeVariant(stat.method) as any}>
                        {getPaymentMethodLabel(stat.method)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {stat.count} transactions
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${stat.total.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {stat.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <p>Sales chart visualization</p>
                  <p className="text-sm">Chart component would be integrated here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">{transaction.transactionId}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant={getPaymentMethodBadgeVariant(transaction.paymentMethod) as any}>
                        {getPaymentMethodLabel(transaction.paymentMethod)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${transaction.amount.toFixed(2)}</div>
                      {transaction.linkedOrderId && (
                        <div className="text-sm text-muted-foreground">
                          Order: {transaction.linkedOrderId}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Peak Hours</h4>
                    <div className="text-sm text-muted-foreground">
                      <div>10:00 AM - 2:00 PM</div>
                      <div>5:00 PM - 8:00 PM</div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Top Products</h4>
                    <div className="text-sm text-muted-foreground">
                      <div>Ground Bison (1lb)</div>
                      <div>Bison Ribeye Steak</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

