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
import { Truck, RefreshCw, Download, Filter, Eye, Package, MapPin, Clock, CheckCircle, AlertTriangle, TrendingUp, Printer, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';

export default function ShippingServicesPage() {
  const { settings } = useSettings();
  const [selectedCarrier, setSelectedCarrier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Mock shipping data
  const shippingStats = {
    totalShipments: 1247,
    inTransit: 156,
    delivered: 892,
    delayed: 23,
    returned: 12,
    totalCost: 45678.90
  };

  const shipments = [
    {
      id: 'ship-001',
      trackingNumber: '1Z999AA1234567890',
      carrier: 'UPS',
      status: 'In Transit',
      origin: 'New York, NY',
      destination: 'Los Angeles, CA',
      shippedDate: '2024-01-15',
      estimatedDelivery: '2024-01-18',
      actualDelivery: null,
      cost: 45.99,
      weight: '15.5 lbs',
      lastSync: '2024-01-15 14:30:00',
      labelGenerated: true,
      labelUrl: 'https://labels.example.com/label-001.pdf',
      labelGeneratedAt: '2024-01-15 14:25:00'
    },
    {
      id: 'ship-002',
      trackingNumber: '9400100000000000000000',
      carrier: 'USPS',
      status: 'Delivered',
      origin: 'Chicago, IL',
      destination: 'Miami, FL',
      shippedDate: '2024-01-12',
      estimatedDelivery: '2024-01-16',
      actualDelivery: '2024-01-15',
      cost: 23.50,
      weight: '8.2 lbs',
      lastSync: '2024-01-15 14:25:00',
      labelGenerated: true,
      labelUrl: 'https://labels.example.com/label-002.pdf',
      labelGeneratedAt: '2024-01-12 10:15:00'
    },
    {
      id: 'ship-003',
      trackingNumber: '794698123456',
      carrier: 'FedEx',
      status: 'Delayed',
      origin: 'Seattle, WA',
      destination: 'Austin, TX',
      shippedDate: '2024-01-14',
      estimatedDelivery: '2024-01-17',
      actualDelivery: null,
      cost: 67.25,
      weight: '22.1 lbs',
      lastSync: '2024-01-15 14:20:00',
      labelGenerated: false,
      labelUrl: null,
      labelGeneratedAt: null
    },
    {
      id: 'ship-004',
      trackingNumber: '1Z999AA1234567891',
      carrier: 'UPS',
      status: 'Delivered',
      origin: 'Denver, CO',
      destination: 'Phoenix, AZ',
      shippedDate: '2024-01-11',
      estimatedDelivery: '2024-01-14',
      actualDelivery: '2024-01-13',
      cost: 34.75,
      weight: '12.8 lbs',
      lastSync: '2024-01-15 14:15:00',
      labelGenerated: true,
      labelUrl: 'https://labels.example.com/label-004.pdf',
      labelGeneratedAt: '2024-01-11 09:30:00'
    }
  ];

  const syncLogs = [
    {
      id: 'sync-001',
      timestamp: '2024-01-15 14:30:00',
      carrier: 'UPS',
      shipments: 45,
      status: 'Completed',
      duration: '2m 15s',
      errors: 0
    },
    {
      id: 'sync-002',
      timestamp: '2024-01-15 14:00:00',
      carrier: 'USPS',
      shipments: 38,
      status: 'Completed',
      duration: '1m 45s',
      errors: 0
    },
    {
      id: 'sync-003',
      timestamp: '2024-01-15 13:30:00',
      carrier: 'FedEx',
      shipments: 52,
      status: 'Completed',
      duration: '2m 30s',
      errors: 0
    }
  ];

  const carriers = [
    {
      name: 'UPS',
      status: 'Connected',
      lastSync: '2024-01-15 14:30:00',
      apiKey: 'Active',
      rateLimit: '1000/hour',
      successRate: 99.2
    },
    {
      name: 'USPS',
      status: 'Connected',
      lastSync: '2024-01-15 14:00:00',
      apiKey: 'Active',
      rateLimit: '500/hour',
      successRate: 98.8
    },
    {
      name: 'FedEx',
      status: 'Connected',
      lastSync: '2024-01-15 13:30:00',
      apiKey: 'Active',
      rateLimit: '750/hour',
      successRate: 99.5
    }
  ];

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text="Shipping Services" />
              <ToolbarDescription>
                Manage shipping integrations and track shipments across carriers
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
          {/* Shipping Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shippingStats.totalShipments.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{shippingStats.inTransit}</div>
                <p className="text-xs text-muted-foreground">Currently shipping</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{shippingStats.delivered}</div>
                <p className="text-xs text-muted-foreground">Successfully delivered</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delayed</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{shippingStats.delayed}</div>
                <p className="text-xs text-muted-foreground">Behind schedule</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Returned</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{shippingStats.returned}</div>
                <p className="text-xs text-muted-foreground">Returned to sender</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${shippingStats.totalCost.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Shipping expenses</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter shipments by carrier, status, and time period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carrier">Shipping Carrier</Label>
                  <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Carriers</SelectItem>
                      <SelectItem value="ups">UPS</SelectItem>
                      <SelectItem value="usps">USPS</SelectItem>
                      <SelectItem value="fedex">FedEx</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Shipment Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
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
                  <Label htmlFor="search">Search</Label>
                  <Input id="search" placeholder="Tracking number, destination..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Label Generation Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Printer className="h-4 w-4 mr-2" />
                Shipping Label Generation
              </CardTitle>
              <CardDescription>Monitor automatic label generation and manual overrides</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Auto-Generated Today</p>
                    <p className="text-2xl font-bold text-green-600">47</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Pending Generation</p>
                    <p className="text-2xl font-bold text-yellow-600">3</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Generation Errors</p>
                    <p className="text-2xl font-bold text-red-600">1</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="shipments" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="shipments">Shipments</TabsTrigger>
              <TabsTrigger value="labels">Label Generation</TabsTrigger>
              <TabsTrigger value="carriers">Carriers</TabsTrigger>
              <TabsTrigger value="sync-logs">Sync Logs</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="shipments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Shipments</CardTitle>
                  <CardDescription>Track all shipments across carriers</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking Number</TableHead>
                        <TableHead>Carrier</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Origin</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Shipped Date</TableHead>
                        <TableHead>Est. Delivery</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Label Status</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{shipment.carrier}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              shipment.status === 'Delivered' ? 'success' :
                              shipment.status === 'In Transit' ? 'info' :
                              shipment.status === 'Delayed' ? 'destructive' :
                              'secondary'
                            }>
                              {shipment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{shipment.origin}</TableCell>
                          <TableCell className="text-sm">{shipment.destination}</TableCell>
                          <TableCell>{shipment.shippedDate}</TableCell>
                          <TableCell>{shipment.estimatedDelivery}</TableCell>
                          <TableCell className="font-medium">${shipment.cost}</TableCell>
                          <TableCell>
                            {shipment.labelGenerated ? (
                              <div className="flex items-center space-x-2">
                                <Badge variant="success">Generated</Badge>
                                <p className="text-xs text-muted-foreground">{shipment.labelGeneratedAt}</p>
                              </div>
                            ) : (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{shipment.lastSync}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Truck className="h-4 w-4" />
                              </Button>
                              {shipment.labelGenerated ? (
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm">
                                  <Printer className="h-4 w-4" />
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

            <TabsContent value="labels" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Label Generation Settings</CardTitle>
                    <CardDescription>Configure automatic label generation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-Generate Labels</Label>
                        <p className="text-sm text-muted-foreground">Automatically generate labels when orders are ready to ship</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultCarrier">Default Carrier</Label>
                      <Select defaultValue="ups">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ups">UPS</SelectItem>
                          <SelectItem value="usps">USPS</SelectItem>
                          <SelectItem value="fedex">FedEx</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="labelFormat">Label Format</Label>
                      <Select defaultValue="pdf">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="zpl">ZPL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">
                      <Printer className="h-4 w-4 mr-2" />
                      Generate Test Label
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Label Activity</CardTitle>
                    <CardDescription>Latest label generation events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-sm">Label Generated</p>
                            <p className="text-xs text-muted-foreground">Order #12345 - UPS</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">2 min ago</p>
                          <Button variant="outline" size="sm">Download</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-sm">Generation Pending</p>
                            <p className="text-xs text-muted-foreground">Order #12346 - USPS</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">5 min ago</p>
                          <Button variant="outline" size="sm">Retry</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-sm">Generation Failed</p>
                            <p className="text-xs text-muted-foreground">Order #12347 - Invalid Address</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">10 min ago</p>
                          <Button variant="outline" size="sm">Fix</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="carriers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Carrier Status</CardTitle>
                  <CardDescription>Monitor shipping carrier connections and performance</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Carrier</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>API Key</TableHead>
                        <TableHead>Rate Limit</TableHead>
                        <TableHead>Success Rate</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {carriers.map((carrier) => (
                        <TableRow key={carrier.name}>
                          <TableCell className="font-medium">{carrier.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <Badge variant="success">{carrier.status}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>{carrier.lastSync}</TableCell>
                          <TableCell>
                            <Badge variant="success">{carrier.apiKey}</Badge>
                          </TableCell>
                          <TableCell>{carrier.rateLimit}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{carrier.successRate}%</span>
                              <Progress value={carrier.successRate} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Test</Button>
                              <Button variant="outline" size="sm">Configure</Button>
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
                  <CardDescription>Carrier synchronization history</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Carrier</TableHead>
                        <TableHead>Shipments</TableHead>
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
                            <Badge variant="secondary">{sync.carrier}</Badge>
                          </TableCell>
                          <TableCell>{sync.shipments}</TableCell>
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

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Carrier Performance</CardTitle>
                    <CardDescription>Success rates by shipping carrier</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>UPS</span>
                          <span>99.2%</span>
                        </div>
                        <Progress value={99.2} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>USPS</span>
                          <span>98.8%</span>
                        </div>
                        <Progress value={98.8} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>FedEx</span>
                          <span>99.5%</span>
                        </div>
                        <Progress value={99.5} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Trends</CardTitle>
                    <CardDescription>Shipment volume over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">This Week</span>
                        <span className="text-2xl font-bold text-green-600">+18%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">This Month</span>
                        <span className="text-2xl font-bold text-blue-600">+12%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">This Quarter</span>
                        <span className="text-2xl font-bold text-purple-600">+25%</span>
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

