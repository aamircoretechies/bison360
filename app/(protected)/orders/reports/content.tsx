'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Package, Truck, Calendar, Download, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReportFilters {
  dateRange: string;
  carrier: string;
  status: string;
  staff: string;
}

interface ReportData {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  ordersByCarrier: Record<string, number>;
  ordersByStaff: Record<string, number>;
  dailyOrders: Array<{ date: string; count: number; revenue: number }>;
}

const sampleReportData: ReportData = {
  totalOrders: 156,
  totalRevenue: 23450.75,
  averageOrderValue: 150.32,
  ordersByStatus: {
    'Pending': 23,
    'Picked': 12,
    'Packed': 8,
    'Shipped': 45,
    'Delivered': 68,
  },
  ordersByCarrier: {
    'USPS': 45,
    'FedEx': 67,
    'UPS': 44,
  },
  ordersByStaff: {
    'Sarah Johnson': 52,
    'Mike Wilson': 38,
    'Lisa Davis': 41,
    'Tom Anderson': 25,
  },
  dailyOrders: [
    { date: '2024-01-10', count: 12, revenue: 1800.50 },
    { date: '2024-01-11', count: 15, revenue: 2250.75 },
    { date: '2024-01-12', count: 18, revenue: 2700.25 },
    { date: '2024-01-13', count: 14, revenue: 2100.00 },
    { date: '2024-01-14', count: 20, revenue: 3000.50 },
    { date: '2024-01-15', count: 16, revenue: 2400.75 },
  ],
};

export function OrderReportsContent() {
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: 'last7days',
    carrier: 'all',
    status: 'all',
    staff: 'all',
  });
  const [activeTab, setActiveTab] = useState('summary');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.custom(
        (t) => (
          <Alert
            variant="mono"
            icon="success"
            close={false}
            onClose={() => toast.dismiss(t)}
          >
            <RiCheckboxCircleFill />
            <AlertDescription>
              Report generated successfully!
            </AlertDescription>
          </Alert>
        ),
        {
          position: 'top-center',
        }
      );
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportReport = (format: 'csv' | 'pdf') => {
    toast.success(`${format.toUpperCase()} report exported successfully!`);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Picked':
        return 'info';
      case 'Packed':
        return 'secondary';
      case 'Shipped':
        return 'success';
      case 'Delivered':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="carrier">Carrier</Label>
              <Select value={filters.carrier} onValueChange={(value) => handleFilterChange('carrier', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Carriers</SelectItem>
                  <SelectItem value="USPS">USPS</SelectItem>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="UPS">UPS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Picked">Picked</SelectItem>
                  <SelectItem value="Packed">Packed</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="staff">Staff</Label>
              <Select value={filters.staff} onValueChange={(value) => handleFilterChange('staff', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                  <SelectItem value="Lisa Davis">Lisa Davis</SelectItem>
                  <SelectItem value="Tom Anderson">Tom Anderson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={generateReport} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
            <Button variant="outline" onClick={() => exportReport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportReport('pdf')}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="carrier">Carrier Report</TabsTrigger>
          <TabsTrigger value="staff">Staff Report</TabsTrigger>
          <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Package className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{sampleReportData.totalOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">${sampleReportData.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Order Value</p>
                    <p className="text-2xl font-bold">${sampleReportData.averageOrderValue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Truck className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Shipped Today</p>
                    <p className="text-2xl font-bold">16</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Orders by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(sampleReportData.ordersByStatus).map(([status, count]) => (
                  <div key={status} className="text-center">
                    <Badge variant={getStatusBadgeVariant(status)} className="mb-2">
                      {status}
                    </Badge>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground">
                      {((count / sampleReportData.totalOrders) * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Order Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleReportData.dailyOrders.map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">{day.count} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${day.revenue.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carrier" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Carrier Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(sampleReportData.ordersByCarrier).map(([carrier, count]) => (
                  <div key={carrier} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{carrier}</p>
                        <p className="text-sm text-muted-foreground">{count} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{((count / sampleReportData.totalOrders) * 100).toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(sampleReportData.ordersByStaff).map(([staff, count]) => (
                  <div key={staff} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{staff}</p>
                        <p className="text-sm text-muted-foreground">{count} orders processed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{((count / sampleReportData.totalOrders) * 100).toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exceptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Exceptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <p className="font-medium text-red-800">Failed Delivery Attempt</p>
                    <p className="text-sm text-red-600">ORD-2024-015 - Customer not available</p>
                  </div>
                  <Badge variant="destructive">High Priority</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <div>
                    <p className="font-medium text-yellow-800">Package Damaged</p>
                    <p className="text-sm text-yellow-600">ORD-2024-012 - Box crushed during transit</p>
                  </div>
                  <Badge variant="warning">Medium Priority</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div>
                    <p className="font-medium text-blue-800">Address Correction</p>
                    <p className="text-sm text-blue-600">ORD-2024-008 - Updated shipping address</p>
                  </div>
                  <Badge variant="info">Low Priority</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
