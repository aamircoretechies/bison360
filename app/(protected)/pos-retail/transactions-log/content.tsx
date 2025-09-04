'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Eye, 
  Receipt,
  Calendar,
  DollarSign,
  CreditCard,
  ShoppingCart,
  Download,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  transactionId: string;
  paymentMethod: 'POS' | 'Online' | 'Cash' | 'EBT' | 'CC';
  amount: number;
  date: string;
  linkedOrderId?: string;
  status: 'completed' | 'pending' | 'failed';
  cashier: string;
  location: string;
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
    cashier: 'Sarah Johnson',
    location: 'Main Store',
  },
  {
    id: '2',
    transactionId: 'TXN-2024-002',
    paymentMethod: 'Online',
    amount: 156.50,
    date: '2024-01-15T09:15:00Z',
    linkedOrderId: 'ORD-2024-002',
    status: 'completed',
    cashier: 'System',
    location: 'Online Store',
  },
  {
    id: '3',
    transactionId: 'TXN-2024-003',
    paymentMethod: 'Cash',
    amount: 234.75,
    date: '2024-01-15T08:45:00Z',
    status: 'completed',
    cashier: 'Mike Wilson',
    location: 'Main Store',
  },
  {
    id: '4',
    transactionId: 'TXN-2024-004',
    paymentMethod: 'CC',
    amount: 67.25,
    date: '2024-01-14T16:20:00Z',
    linkedOrderId: 'ORD-2024-004',
    status: 'completed',
    cashier: 'Lisa Davis',
    location: 'Main Store',
  },
  {
    id: '5',
    transactionId: 'TXN-2024-005',
    paymentMethod: 'EBT',
    amount: 189.99,
    date: '2024-01-13T14:10:00Z',
    linkedOrderId: 'ORD-2024-005',
    status: 'completed',
    cashier: 'Tom Anderson',
    location: 'Main Store',
  },
  {
    id: '6',
    transactionId: 'TXN-2024-006',
    paymentMethod: 'POS',
    amount: 45.67,
    date: '2024-01-13T11:30:00Z',
    status: 'pending',
    cashier: 'Sarah Johnson',
    location: 'Main Store',
  },
  {
    id: '7',
    transactionId: 'TXN-2024-007',
    paymentMethod: 'Online',
    amount: 298.50,
    date: '2024-01-12T15:45:00Z',
    linkedOrderId: 'ORD-2024-006',
    status: 'completed',
    cashier: 'System',
    location: 'Online Store',
  },
  {
    id: '8',
    transactionId: 'TXN-2024-008',
    paymentMethod: 'Cash',
    amount: 78.90,
    date: '2024-01-12T13:20:00Z',
    status: 'completed',
    cashier: 'Mike Wilson',
    location: 'Main Store',
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

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'destructive';
    default:
      return 'secondary';
  }
}

export function TransactionsLogContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('all');

  const filteredTransactions = useMemo(() => {
    let filtered = sampleTransactions;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.transactionId.toLowerCase().includes(query) ||
          transaction.linkedOrderId?.toLowerCase().includes(query) ||
          transaction.cashier.toLowerCase().includes(query) ||
          transaction.location.toLowerCase().includes(query)
      );
    }

    // Filter by payment method
    if (selectedPaymentMethods.length > 0) {
      filtered = filtered.filter((transaction) =>
        selectedPaymentMethods.includes(transaction.paymentMethod)
      );
    }

    // Filter by status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((transaction) =>
        selectedStatuses.includes(transaction.status)
      );
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      if (dateRange === 'today') {
        cutoffDate.setHours(0, 0, 0, 0);
      } else if (dateRange === 'week') {
        cutoffDate.setDate(now.getDate() - 7);
      } else if (dateRange === 'month') {
        cutoffDate.setMonth(now.getMonth() - 1);
      }
      
      filtered = filtered.filter(
        (transaction) => new Date(transaction.date) >= cutoffDate
      );
    }

    return filtered;
  }, [searchQuery, selectedPaymentMethods, selectedStatuses, dateRange]);

  const totalAmount = useMemo(() => 
    filteredTransactions.reduce((sum, t) => sum + t.amount, 0), 
    [filteredTransactions]
  );

  const handlePaymentMethodChange = (method: string, checked: boolean) => {
    if (checked) {
      setSelectedPaymentMethods(prev => [...prev, method]);
    } else {
      setSelectedPaymentMethods(prev => prev.filter(m => m !== method));
    }
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatuses(prev => [...prev, status]);
    } else {
      setSelectedStatuses(prev => prev.filter(s => s !== status));
    }
  };

  const handleViewTransaction = (transaction: Transaction) => {
    toast.info(`Viewing transaction ${transaction.transactionId}`);
    // In real implementation, this would navigate to transaction detail
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    toast.success(`${format.toUpperCase()} export started for ${filteredTransactions.length} transactions`);
    // In real implementation, this would trigger the export
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by Transaction ID, Order ID, Cashier, or Location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear
            </Button>
          </div>

          {/* Filter Options */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Date Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            {/* Payment Methods */}
            <div>
              <label className="text-sm font-medium mb-2 block">Payment Methods</label>
              <div className="space-y-2">
                {['POS', 'Online', 'Cash', 'EBT', 'CC'].map((method) => (
                  <label key={method} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedPaymentMethods.includes(method)}
                      onChange={(e) => handlePaymentMethodChange(method, e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">{getPaymentMethodLabel(method)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <div className="space-y-2">
                {['completed', 'pending', 'failed'].map((status) => (
                  <label key={status} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={(e) => handleStatusChange(status, e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{filteredTransactions.length}</div>
                <div className="text-sm text-muted-foreground">Transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Total Amount</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">
                  ${filteredTransactions.length > 0 ? (totalAmount / filteredTransactions.length).toFixed(2) : '0.00'}
                </div>
                <div className="text-sm text-muted-foreground">Average Transaction</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
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
                  <Badge variant={getStatusBadgeVariant(transaction.status) as any}>
                    {transaction.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">${transaction.amount.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.cashier} • {transaction.location}
                    </div>
                    {transaction.linkedOrderId && (
                      <div className="text-sm text-muted-foreground">
                        Order: {transaction.linkedOrderId}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewTransaction(transaction)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-4" />
                <p>No transactions found matching your filters</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

