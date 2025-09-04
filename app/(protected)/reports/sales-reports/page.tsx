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
import { Download, FileText, BarChart3, TrendingUp, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SalesReportsPage() {
  const { settings } = useSettings();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedChannel, setSelectedChannel] = useState('all');

  // Mock sales data
  const salesData = [
    {
      id: 'SALE-001',
      date: '2024-01-15',
      customer: 'John Smith',
      product: 'Ground Beef 80/20',
      quantity: 5,
      unitPrice: 8.99,
      total: 44.95,
      channel: 'Retail Store',
      paymentMethod: 'Credit Card',
      status: 'Completed'
    },
    {
      id: 'SALE-002',
      date: '2024-01-15',
      customer: 'Sarah Johnson',
      product: 'Pork Chops (6-pack)',
      quantity: 2,
      unitPrice: 12.99,
      total: 25.98,
      channel: 'Online Store',
      paymentMethod: 'PayPal',
      status: 'Completed'
    },
    {
      id: 'SALE-003',
      date: '2024-01-14',
      customer: 'Mike Wilson',
      product: 'Lamb Shoulder',
      quantity: 1,
      unitPrice: 24.99,
      total: 24.99,
      channel: 'Wholesale',
      paymentMethod: 'Bank Transfer',
      status: 'Pending'
    }
  ];

  const topProducts = [
    { name: 'Ground Beef 80/20', sales: 1250, revenue: 11237.50, growth: 12.5 },
    { name: 'Pork Chops (6-pack)', sales: 890, revenue: 11561.10, growth: 8.3 },
    { name: 'Lamb Shoulder', sales: 456, revenue: 11395.44, growth: 15.7 },
    { name: 'Beef Steaks', sales: 678, revenue: 16950.00, growth: 6.2 }
  ];

  const channelPerformance = [
    { channel: 'Retail Store', sales: 45, revenue: 12500, growth: 10.2 },
    { channel: 'Online Store', sales: 32, revenue: 8900, growth: 18.5 },
    { channel: 'Wholesale', sales: 28, revenue: 15600, growth: 5.8 },
    { channel: 'Farmers Market', sales: 15, revenue: 4200, growth: 22.1 }
  ];

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle>Sales Reports</ToolbarPageTitle>
              <ToolbarDescription>
                Comprehensive sales analytics and performance insights across all channels
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="primary" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
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
              <CardTitle>Report Filters</CardTitle>
              <CardDescription>Customize your sales report parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period">Time Period</Label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channel">Sales Channel</Label>
                  <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="retail">Retail Store</SelectItem>
                      <SelectItem value="online">Online Store</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                      <SelectItem value="farmers-market">Farmers Market</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product">Product Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="beef">Beef Products</SelectItem>
                      <SelectItem value="pork">Pork Products</SelectItem>
                      <SelectItem value="lamb">Lamb Products</SelectItem>
                      <SelectItem value="poultry">Poultry Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <Input placeholder="Search customers, products..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$42,207.04</div>
                <p className="text-xs text-muted-foreground">+15.3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">120</div>
                <p className="text-xs text-muted-foreground">+8.7% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$351.73</div>
                <p className="text-xs text-muted-foreground">+6.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Reports Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Top Products</TabsTrigger>
              <TabsTrigger value="channels">Channel Performance</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Monthly revenue performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['Jan', 'Feb', 'Mar', 'Apr'].map((month, index) => (
                        <div key={month} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{month}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(index + 1) * 20 + 20}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ${(index + 1) * 8000 + 8000}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sales Distribution</CardTitle>
                    <CardDescription>Sales by product category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { category: 'Beef Products', percentage: 45, color: 'bg-red-500' },
                        { category: 'Pork Products', percentage: 30, color: 'bg-pink-500' },
                        { category: 'Lamb Products', percentage: 15, color: 'bg-orange-500' },
                        { category: 'Poultry Products', percentage: 10, color: 'bg-yellow-500' }
                      ].map((item) => (
                        <div key={item.category} className="flex items-center justify-between">
                          <span className="text-sm">{item.category}</span>
                          <div className="flex items-center space-x-2">
                            <div className={`w-20 h-2 rounded-full ${item.color}`}></div>
                            <span className="text-sm font-medium">{item.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                  <CardDescription>Products with highest sales and revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Units Sold</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Growth</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProducts.map((product) => (
                        <TableRow key={product.name}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sales.toLocaleString()}</TableCell>
                          <TableCell>${product.revenue.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={product.growth > 10 ? 'success' : 'secondary'}>
                              +{product.growth}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="channels" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Channel Performance</CardTitle>
                  <CardDescription>Sales performance across different channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Channel</TableHead>
                        <TableHead>Sales Count</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Growth</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {channelPerformance.map((channel) => (
                        <TableRow key={channel.channel}>
                          <TableCell className="font-medium">{channel.channel}</TableCell>
                          <TableCell>{channel.sales}</TableCell>
                          <TableCell>${channel.revenue.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={channel.growth > 15 ? 'success' : 'secondary'}>
                              +{channel.growth}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Analyze</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Detailed view of sales transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sale ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{sale.id}</TableCell>
                          <TableCell>{sale.date}</TableCell>
                          <TableCell>{sale.customer}</TableCell>
                          <TableCell>{sale.product}</TableCell>
                          <TableCell>{sale.quantity}</TableCell>
                          <TableCell>${sale.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{sale.channel}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              sale.status === 'Completed' ? 'success' :
                              sale.status === 'Pending' ? 'secondary' :
                              'default'
                            }>
                              {sale.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Invoice</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </Fragment>
  );
}

