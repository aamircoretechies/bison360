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
import { ShoppingCart, RefreshCw, Download, Filter, Eye, Package, Truck, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

export default function GrownByOrdersPage() {
  const { settings } = useSettings();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Mock GrownBy orders data
  const orderStats = {
    totalOrders: 1247,
    pendingOrders: 89,
    processingOrders: 156,
    shippedOrders: 892,
    deliveredOrders: 110,
    totalRevenue: 45678.90
  };

  const orders = [
    {
      id: 'GB-001',
      orderNumber: 'GB-2024-001',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      orderDate: '2024-01-15',
      status: 'Pending',
      total: 89.99,
      items: 3,
      platform: 'GrownBy',
      lastSync: '2024-01-15 14:30:00',
      paymentStatus: 'Pending',
      paymentMethod: 'Credit Card',
      inventoryStatus: 'Reserved',
      shippingLabel: null,
      trackingNumber: null
    },
    {
      id: 'GB-002',
      orderNumber: 'GB-2024-002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      orderDate: '2024-01-15',
      status: 'Processing',
      total: 156.50,
      items: 5,
      platform: 'GrownBy',
      lastSync: '2024-01-15 14:25:00',
      paymentStatus: 'Completed',
      paymentMethod: 'Stripe',
      inventoryStatus: 'Reserved',
      shippingLabel: null,
      trackingNumber: null
    },
    {
      id: 'GB-003',
      orderNumber: 'GB-2024-003',
      customerName: 'Mike Wilson',
      customerEmail: 'mike@example.com',
      orderDate: '2024-01-14',
      status: 'Shipped',
      total: 234.75,
      items: 7,
      platform: 'GrownBy',
      lastSync: '2024-01-15 14:20:00',
      paymentStatus: 'Completed',
      paymentMethod: 'Stripe',
      inventoryStatus: 'Shipped',
      shippingLabel: 'https://labels.example.com/label-123.pdf',
      trackingNumber: '1Z999AA1234567890'
    },
    {
      id: 'GB-004',
      orderNumber: 'GB-2024-004',
      customerName: 'Lisa Brown',
      customerEmail: 'lisa@example.com',
      orderDate: '2024-01-14',
      status: 'Delivered',
      total: 67.25,
      items: 2,
      platform: 'GrownBy',
      lastSync: '2024-01-15 14:15:00',
      paymentStatus: 'Completed',
      paymentMethod: 'Credit Card',
      inventoryStatus: 'Delivered',
      shippingLabel: 'https://labels.example.com/label-124.pdf',
      trackingNumber: '9400100000000000000000'
    }
  ];

  const syncHistory = [
    {
      id: 'sync-001',
      timestamp: '2024-01-15 14:30:00',
      orders: 15,
      status: 'Completed',
      duration: '2m 30s',
      errors: 0
    },
    {
      id: 'sync-002',
      timestamp: '2024-01-15 13:00:00',
      orders: 8,
      status: 'Completed',
      duration: '1m 45s',
      errors: 0
    },
    {
      id: 'sync-003',
      timestamp: '2024-01-15 11:30:00',
      orders: 12,
      status: 'Completed',
      duration: '2m 15s',
      errors: 0
    }
  ];

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text="GrownBy Orders" />
              <ToolbarDescription>
                Manage and monitor orders from GrownBy platform integration
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
          {/* Order Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orderStats.totalOrders.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{orderStats.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{orderStats.processingOrders}</div>
                <p className="text-xs text-muted-foreground">In production</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shipped</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{orderStats.shippedOrders}</div>
                <p className="text-xs text-muted-foreground">In transit</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{orderStats.deliveredOrders}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${orderStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total sales</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter orders by status and time period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Order Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
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
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search">Search Orders</Label>
                  <Input id="search" placeholder="Order number, customer name..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                Inventory Alerts
              </CardTitle>
              <CardDescription>Monitor inventory issues and stock mismatches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Low Stock Alert</p>
                      <p className="text-sm text-muted-foreground">Product SKU: GB-001 - Only 5 units remaining</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Out of Stock</p>
                      <p className="text-sm text-muted-foreground">Product SKU: GB-003 - 0 units available</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Restock</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="sync">Sync Status</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>GrownBy Orders</CardTitle>
                  <CardDescription>Recent orders from GrownBy platform</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Number</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Inventory Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>{order.orderDate}</TableCell>
                          <TableCell>
                            <Badge variant={
                              order.status === 'Pending' ? 'secondary' :
                              order.status === 'Processing' ? 'warning' :
                              order.status === 'Shipped' ? 'info' :
                              'success'
                            }>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              order.paymentStatus === 'Completed' ? 'success' :
                              order.paymentStatus === 'Pending' ? 'secondary' :
                              'destructive'
                            }>
                              {order.paymentStatus}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{order.paymentMethod}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              order.inventoryStatus === 'Reserved' ? 'warning' :
                              order.inventoryStatus === 'Shipped' ? 'info' :
                              order.inventoryStatus === 'Delivered' ? 'success' :
                              'destructive'
                            }>
                              {order.inventoryStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">${order.total}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{order.lastSync}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Package className="h-4 w-4" />
                              </Button>
                              {order.shippingLabel && (
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Sync Status</CardTitle>
                    <CardDescription>Monitor inventory synchronization with GrownBy</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Auto-sync Active</span>
                      </div>
                      <Badge variant="success">Connected</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Last Sync</span>
                        <span>2024-01-15 14:30:00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Synced Products</span>
                        <span>1,247</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pending Updates</span>
                        <span>12</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Stock Mismatches</CardTitle>
                    <CardDescription>Products with quantity discrepancies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">GB-001</p>
                          <p className="text-xs text-muted-foreground">Organic Tomatoes</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">BISON: 5 | GB: 3</p>
                          <Badge variant="destructive" className="text-xs">Mismatch</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">GB-002</p>
                          <p className="text-xs text-muted-foreground">Fresh Lettuce</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">BISON: 12 | GB: 12</p>
                          <Badge variant="success" className="text-xs">Synced</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">GB-003</p>
                          <p className="text-xs text-muted-foreground">Carrots</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">BISON: 0 | GB: 8</p>
                          <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sync" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sync Status</CardTitle>
                    <CardDescription>GrownBy integration synchronization</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Connected</span>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Last Sync</span>
                        <span>2024-01-15 14:30:00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Next Sync</span>
                        <span>2024-01-15 15:00:00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Sync Interval</span>
                        <span>30 minutes</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sync History</CardTitle>
                    <CardDescription>Recent synchronization operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {syncHistory.map((sync) => (
                        <div key={sync.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{sync.orders} orders</p>
                            <p className="text-sm text-muted-foreground">{sync.timestamp}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="success">{sync.status}</Badge>
                            <p className="text-xs text-muted-foreground">{sync.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Trends</CardTitle>
                    <CardDescription>Order volume over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">This Week</span>
                        <span className="text-2xl font-bold text-green-600">+12%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">This Month</span>
                        <span className="text-2xl font-bold text-blue-600">+8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">This Quarter</span>
                        <span className="text-2xl font-bold text-purple-600">+15%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Performance</CardTitle>
                    <CardDescription>GrownBy vs other platforms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>GrownBy</span>
                          <span>45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Direct Sales</span>
                          <span>35%</span>
                        </div>
                        <Progress value={35} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Other Platforms</span>
                          <span>20%</span>
                        </div>
                        <Progress value={20} className="h-2" />
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

