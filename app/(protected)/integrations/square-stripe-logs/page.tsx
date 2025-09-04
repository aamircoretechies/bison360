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
import { CreditCard, RefreshCw, Download, Filter, Eye, AlertTriangle, CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

export default function SquareStripeLogsPage() {
  const { settings } = useSettings();
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('24h');

  // Mock payment processing data
  const paymentStats = {
    totalTransactions: 2847,
    successfulTransactions: 2789,
    failedTransactions: 58,
    totalAmount: 156789.45,
    averageTransaction: 55.12,
    successRate: 98.0
  };

  const transactions = [
    {
      id: 'txn-001',
      transactionId: 'sq_123456789',
      provider: 'Square',
      amount: 89.99,
      status: 'Succeeded',
      customerEmail: 'john@example.com',
      timestamp: '2024-01-15 14:30:00',
      method: 'Credit Card',
      lastSync: '2024-01-15 14:31:00'
    },
    {
      id: 'txn-002',
      transactionId: 'pi_987654321',
      provider: 'Stripe',
      amount: 156.50,
      status: 'Succeeded',
      customerEmail: 'sarah@example.com',
      timestamp: '2024-01-15 14:25:00',
      method: 'Credit Card',
      lastSync: '2024-01-15 14:26:00'
    },
    {
      id: 'txn-003',
      transactionId: 'sq_456789123',
      provider: 'Square',
      amount: 234.75,
      status: 'Failed',
      customerEmail: 'mike@example.com',
      timestamp: '2024-01-15 14:20:00',
      method: 'Credit Card',
      lastSync: '2024-01-15 14:21:00'
    },
    {
      id: 'txn-004',
      transactionId: 'pi_321654987',
      provider: 'Stripe',
      amount: 67.25,
      status: 'Succeeded',
      customerEmail: 'lisa@example.com',
      timestamp: '2024-01-15 14:15:00',
      method: 'Credit Card',
      lastSync: '2024-01-15 14:16:00'
    }
  ];

  const syncLogs = [
    {
      id: 'sync-001',
      timestamp: '2024-01-15 14:30:00',
      provider: 'Square',
      transactions: 45,
      status: 'Completed',
      duration: '1m 30s',
      errors: 0
    },
    {
      id: 'sync-002',
      timestamp: '2024-01-15 14:00:00',
      provider: 'Stripe',
      transactions: 38,
      status: 'Completed',
      duration: '1m 15s',
      errors: 0
    },
    {
      id: 'sync-003',
      timestamp: '2024-01-15 13:30:00',
      provider: 'Square',
      transactions: 52,
      status: 'Completed',
      duration: '1m 45s',
      errors: 0
    }
  ];

  const errorLogs = [
    {
      id: 'error-001',
      timestamp: '2024-01-15 14:20:00',
      provider: 'Square',
      errorCode: 'CARD_DECLINED',
      errorMessage: 'Card was declined',
      transactionId: 'sq_456789123',
      severity: 'High'
    },
    {
      id: 'error-002',
      timestamp: '2024-01-15 14:15:00',
      provider: 'Stripe',
      errorCode: 'INSUFFICIENT_FUNDS',
      errorMessage: 'Insufficient funds',
      transactionId: 'pi_789123456',
      severity: 'Medium'
    }
  ];

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle>Square & Stripe Logs</ToolbarPageTitle>
              <ToolbarDescription>
                Monitor payment processing integrations and transaction logs
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <div className="space-y-6">
          {/* Payment Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paymentStats.totalTransactions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Successful</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{paymentStats.successfulTransactions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{paymentStats.failedTransactions}</div>
                <p className="text-xs text-muted-foreground">Errors</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${paymentStats.totalAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Processed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${paymentStats.averageTransaction}</div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{paymentStats.successRate}%</div>
                <p className="text-xs text-muted-foreground">Overall</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter transactions by provider, status, and time period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Payment Provider</Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Providers</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Transaction Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="succeeded">Succeeded</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Time Period</Label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last hour</SelectItem>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <Input id="search" placeholder="Transaction ID, customer email..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="sync-logs">Sync Logs</TabsTrigger>
              <TabsTrigger value="error-logs">Error Logs</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Transactions</CardTitle>
                  <CardDescription>Recent payment processing transactions</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.transactionId}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{transaction.provider}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">${transaction.amount}</TableCell>
                          <TableCell>
                            <Badge variant={
                              transaction.status === 'Succeeded' ? 'success' :
                              transaction.status === 'Failed' ? 'destructive' :
                              'secondary'
                            }>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.customerEmail}</TableCell>
                          <TableCell>{transaction.method}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{transaction.timestamp}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{transaction.lastSync}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sync-logs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sync Logs</CardTitle>
                  <CardDescription>Payment provider synchronization history</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Transactions</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Errors</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {syncLogs.map((sync) => (
                        <TableRow key={sync.id}>
                          <TableCell>{sync.timestamp}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{sync.provider}</Badge>
                          </TableCell>
                          <TableCell>{sync.transactions}</TableCell>
                          <TableCell>
                            <Badge variant="success">{sync.status}</Badge>
                          </TableCell>
                          <TableCell>{sync.duration}</TableCell>
                          <TableCell>
                            {sync.errors > 0 ? (
                              <Badge variant="destructive">{sync.errors}</Badge>
                            ) : (
                              <span className="text-green-600">0</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Retry</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="error-logs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Error Logs</CardTitle>
                  <CardDescription>Payment processing errors and issues</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Error Code</TableHead>
                        <TableHead>Error Message</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {errorLogs.map((error) => (
                        <TableRow key={error.id}>
                          <TableCell>{error.timestamp}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{error.provider}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{error.errorCode}</TableCell>
                          <TableCell className="max-w-xs truncate">{error.errorMessage}</TableCell>
                          <TableCell className="font-medium">{error.transactionId}</TableCell>
                          <TableCell>
                            <Badge variant={
                              error.severity === 'High' ? 'destructive' :
                              error.severity === 'Medium' ? 'default' :
                              'secondary'
                            }>
                              {error.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Resolve</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Provider Performance</CardTitle>
                    <CardDescription>Success rates by payment provider</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Square</span>
                          <span>98.5%</span>
                        </div>
                        <Progress value={98.5} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Stripe</span>
                          <span>97.2%</span>
                        </div>
                        <Progress value={97.2} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Trends</CardTitle>
                    <CardDescription>Payment volume over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Today</span>
                        <span className="text-2xl font-bold text-green-600">+15%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">This Week</span>
                        <span className="text-2xl font-bold text-blue-600">+8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">This Month</span>
                        <span className="text-2xl font-bold text-purple-600">+12%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </Fragment>
  );
}

