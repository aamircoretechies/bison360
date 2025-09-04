'use client';

import { Fragment, useState, useMemo } from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  User, 
  Clock, 
  DollarSign, 
  Package, 
  CreditCard, 
  Receipt, 
  AlertTriangle,
  CheckCircle,
  X,
  RotateCcw,
  Edit,
  Trash2,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'transaction' | 'inventory' | 'refund' | 'system' | 'user';
  details: string;
  amount?: number;
  status: 'success' | 'failed' | 'pending';
  ipAddress: string;
  device: string;
  location?: string;
}

export default function AuditLogsPage() {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showLogDialog, setShowLogDialog] = useState(false);

  // Mock audit logs data
  const auditLogs: AuditLog[] = [
    {
      id: 'AUD-001',
      timestamp: '2024-01-15 14:30:00',
      user: 'John Doe',
      action: 'Sale Completed',
      category: 'transaction',
      details: 'Completed sale for $89.99 with 3 items',
      amount: 89.99,
      status: 'success',
      ipAddress: '192.168.1.100',
      device: 'iPad Pro (POS Terminal)',
      location: 'Store Floor'
    },
    {
      id: 'AUD-002',
      timestamp: '2024-01-15 14:25:00',
      user: 'Jane Smith',
      action: 'Inventory Updated',
      category: 'inventory',
      details: 'Updated stock for Ground Bison (1lb) from 25 to 24 units',
      status: 'success',
      ipAddress: '192.168.1.101',
      device: 'Desktop Computer',
      location: 'Back Office'
    },
    {
      id: 'AUD-003',
      timestamp: '2024-01-15 14:20:00',
      user: 'Mike Wilson',
      action: 'Refund Processed',
      category: 'refund',
      details: 'Processed refund for transaction TXN-2024-001, amount $45.00',
      amount: 45.00,
      status: 'success',
      ipAddress: '192.168.1.102',
      device: 'iPhone 14',
      location: 'Customer Service'
    },
    {
      id: 'AUD-004',
      timestamp: '2024-01-15 14:15:00',
      user: 'Sarah Johnson',
      action: 'Payment Failed',
      category: 'transaction',
      details: 'Credit card payment failed for transaction TXN-2024-002',
      amount: 156.50,
      status: 'failed',
      ipAddress: '192.168.1.103',
      device: 'iPad Air (POS Terminal)',
      location: 'Checkout Counter 2'
    },
    {
      id: 'AUD-005',
      timestamp: '2024-01-15 14:10:00',
      user: 'Admin User',
      action: 'System Configuration',
      category: 'system',
      details: 'Updated POS settings: tax rate changed from 7.5% to 8%',
      status: 'success',
      ipAddress: '192.168.1.104',
      device: 'Desktop Computer',
      location: 'Admin Office'
    },
    {
      id: 'AUD-006',
      timestamp: '2024-01-15 14:05:00',
      user: 'John Doe',
      action: 'User Login',
      category: 'user',
      details: 'User logged into POS system',
      status: 'success',
      ipAddress: '192.168.1.100',
      device: 'iPad Pro (POS Terminal)',
      location: 'Store Floor'
    },
    {
      id: 'AUD-007',
      timestamp: '2024-01-15 14:00:00',
      user: 'Jane Smith',
      action: 'Stock Adjustment',
      category: 'inventory',
      details: 'Manual stock adjustment for Bison Jerky: +10 units (physical count)',
      status: 'success',
      ipAddress: '192.168.1.101',
      device: 'Desktop Computer',
      location: 'Back Office'
    },
    {
      id: 'AUD-008',
      timestamp: '2024-01-15 13:55:00',
      user: 'Mike Wilson',
      action: 'Transaction Cancelled',
      category: 'transaction',
      details: 'Cancelled pending transaction TXN-2024-003 due to customer request',
      amount: 234.75,
      status: 'success',
      ipAddress: '192.168.1.102',
      device: 'iPhone 14',
      location: 'Customer Service'
    }
  ];

  const users = ['all', 'John Doe', 'Jane Smith', 'Mike Wilson', 'Sarah Johnson', 'Admin User'];
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'transaction', name: 'Transactions' },
    { id: 'inventory', name: 'Inventory' },
    { id: 'refund', name: 'Refunds' },
    { id: 'system', name: 'System' },
    { id: 'user', name: 'User Actions' }
  ];

  // Filter logs based on search and filters
  const filteredLogs = useMemo(() => {
    let filtered = auditLogs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(log => log.status === selectedStatus);
    }

    // Filter by user
    if (selectedUser !== 'all') {
      filtered = filtered.filter(log => log.user === selectedUser);
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(log => new Date(log.timestamp) >= filterDate);
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [searchQuery, selectedCategory, selectedStatus, selectedUser, dateRange]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transaction':
        return <Receipt className="h-4 w-4" />;
      case 'inventory':
        return <Package className="h-4 w-4" />;
      case 'refund':
        return <RotateCcw className="h-4 w-4" />;
      case 'system':
        return <BarChart3 className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.toLowerCase().includes('sale') || action.toLowerCase().includes('transaction')) {
      return <DollarSign className="h-4 w-4 text-green-600" />;
    } else if (action.toLowerCase().includes('refund')) {
      return <RotateCcw className="h-4 w-4 text-yellow-600" />;
    } else if (action.toLowerCase().includes('inventory') || action.toLowerCase().includes('stock')) {
      return <Package className="h-4 w-4 text-blue-600" />;
    } else if (action.toLowerCase().includes('failed') || action.toLowerCase().includes('error')) {
      return <X className="h-4 w-4 text-red-600" />;
    } else if (action.toLowerCase().includes('login') || action.toLowerCase().includes('user')) {
      return <User className="h-4 w-4 text-purple-600" />;
    } else {
      return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const exportLogs = (format: 'csv' | 'pdf') => {
    toast.success(`Audit logs exported as ${format.toUpperCase()}`);
  };

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle>Audit Logs</ToolbarPageTitle>
              <ToolbarDescription>
                Track all POS system activities and user actions
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm" onClick={() => exportLogs('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportLogs('pdf')}>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Audit Logs</CardTitle>
              <CardDescription>Search and filter system activity logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search actions, users, or details..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user} value={user}>
                        {user === 'all' ? 'All Users' : user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant={dateRange === 'today' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('today')}
                >
                  Today
                </Button>
                <Button
                  variant={dateRange === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('week')}
                >
                  This Week
                </Button>
                <Button
                  variant={dateRange === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('month')}
                >
                  This Month
                </Button>
                <Button
                  variant={dateRange === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('all')}
                >
                  All Time
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs ({filteredLogs.length})</CardTitle>
              <CardDescription>System activity and user action history</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{log.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getActionIcon(log.action)}
                          <span className="font-medium">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(log.category)}
                          <Badge variant="secondary" className="capitalize">
                            {log.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-muted-foreground truncate">
                          {log.details}
                        </p>
                      </TableCell>
                      <TableCell>
                        {log.amount && (
                          <span className="font-medium">${log.amount.toFixed(2)}</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{log.device}</div>
                          <div className="text-muted-foreground">{log.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedLog(log);
                            setShowLogDialog(true);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Log Details Dialog */}
          <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Audit Log Details: {selectedLog?.id}</DialogTitle>
                <DialogDescription>
                  Detailed information about this system action
                </DialogDescription>
              </DialogHeader>
              {selectedLog && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Timestamp</Label>
                      <p className="font-medium">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>User</Label>
                      <p className="font-medium">{selectedLog.user}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Action</Label>
                      <p className="font-medium">{selectedLog.action}</p>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(selectedLog.category)}
                        <Badge variant="secondary" className="capitalize">
                          {selectedLog.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Details</Label>
                    <p className="text-sm text-muted-foreground">{selectedLog.details}</p>
                  </div>

                  {selectedLog.amount && (
                    <div>
                      <Label>Amount</Label>
                      <p className="font-medium text-lg">${selectedLog.amount.toFixed(2)}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Status</Label>
                      {getStatusBadge(selectedLog.status)}
                    </div>
                    <div>
                      <Label>IP Address</Label>
                      <p className="font-mono text-sm">{selectedLog.ipAddress}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Device</Label>
                      <p className="font-medium">{selectedLog.device}</p>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <p className="font-medium">{selectedLog.location || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowLogDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    </Fragment>
  );
}
