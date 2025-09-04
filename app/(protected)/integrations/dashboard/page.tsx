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
import { 
  Cloud, 
  RefreshCw, 
  Settings, 
  Database, 
  Users, 
  Package, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';

export default function IntegrationDashboardPage() {
  const { settings } = useSettings();
  const [selectedPeriod, setSelectedPeriod] = useState('24h');

  // Integration health data
  const integrationHealth = {
    overall: 98.5,
    activeIntegrations: 6,
    totalIntegrations: 7,
    lastHealthCheck: '2024-01-15 14:30:00',
    uptime: 99.9
  };

  // Integration status data
  const integrations = [
    {
      id: 'salesforce',
      name: 'Salesforce',
      status: 'Connected',
      health: 99.2,
      lastSync: '2024-01-15 14:30:00',
      nextSync: '2024-01-15 15:00:00',
      records: 15420,
      errors: 0,
      icon: Cloud,
      color: 'blue'
    },
    {
      id: 'grownby',
      name: 'GrownBy',
      status: 'Connected',
      health: 98.8,
      lastSync: '2024-01-15 14:25:00',
      nextSync: '2024-01-15 14:55:00',
      records: 1247,
      errors: 0,
      icon: Package,
      color: 'green'
    },
    {
      id: 'shipping',
      name: 'Shipping Services',
      status: 'Connected',
      health: 99.5,
      lastSync: '2024-01-15 14:20:00',
      nextSync: '2024-01-15 14:50:00',
      records: 892,
      errors: 0,
      icon: Package,
      color: 'purple'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      status: 'Connected',
      health: 99.8,
      lastSync: '2024-01-15 14:15:00',
      nextSync: 'Real-time',
      records: 2847,
      errors: 0,
      icon: Shield,
      color: 'indigo'
    },
    {
      id: 'square',
      name: 'Square',
      status: 'Connected',
      health: 98.5,
      lastSync: '2024-01-15 14:10:00',
      nextSync: 'Real-time',
      records: 1923,
      errors: 0,
      icon: Shield,
      color: 'gray'
    },
    {
      id: 'logos',
      name: 'Logo Management',
      status: 'Active',
      health: 100,
      lastSync: '2024-01-15 14:05:00',
      nextSync: 'On-demand',
      records: 12,
      errors: 0,
      icon: Database,
      color: 'orange'
    },
    {
      id: 'offline-sync',
      name: 'Offline Sync',
      status: 'Active',
      health: 97.2,
      lastSync: '2024-01-15 14:00:00',
      nextSync: 'Continuous',
      records: 156,
      errors: 3,
      icon: Zap,
      color: 'yellow'
    }
  ];

  // Recent activity data
  const recentActivity = [
    {
      id: 'act-001',
      timestamp: '2024-01-15 14:30:00',
      integration: 'Salesforce',
      action: 'Full Sync Completed',
      status: 'Success',
      details: '15,420 records synced',
      duration: '12m 45s'
    },
    {
      id: 'act-002',
      timestamp: '2024-01-15 14:25:00',
      integration: 'GrownBy',
      action: 'Order Webhook Received',
      status: 'Success',
      details: 'New order GB-2024-001',
      duration: '0.2s'
    },
    {
      id: 'act-003',
      timestamp: '2024-01-15 14:20:00',
      integration: 'Shipping Services',
      action: 'Label Generated',
      status: 'Success',
      details: 'UPS label for order #12345',
      duration: '3.1s'
    },
    {
      id: 'act-004',
      timestamp: '2024-01-15 14:15:00',
      integration: 'Stripe',
      action: 'Payment Processed',
      status: 'Success',
      details: '$89.99 payment completed',
      duration: '1.8s'
    },
    {
      id: 'act-005',
      timestamp: '2024-01-15 14:10:00',
      integration: 'Offline Sync',
      action: 'Sync Conflict Detected',
      status: 'Warning',
      details: '3 records require manual review',
      duration: '0.5s'
    }
  ];

  // Performance metrics
  const performanceMetrics = {
    totalSyncs: 1247,
    successfulSyncs: 1238,
    failedSyncs: 9,
    averageSyncTime: '2.3s',
    dataVolume: '2.4GB',
    apiCalls: 45678
  };

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text="Integration Dashboard" />
              <ToolbarDescription>
                Monitor all integrations, sync status, and system health
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="primary" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Health Check
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <div className="space-y-6">
          {/* Overall Health Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Integration Health Overview
              </CardTitle>
              <CardDescription>Real-time status of all integrated services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{integrationHealth.overall}%</div>
                  <p className="text-sm text-muted-foreground">Overall Health</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{integrationHealth.activeIntegrations}</div>
                  <p className="text-sm text-muted-foreground">Active Integrations</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{integrationHealth.uptime}%</div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{performanceMetrics.totalSyncs}</div>
                  <p className="text-sm text-muted-foreground">Total Syncs Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Successful Syncs</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{performanceMetrics.successfulSyncs}</div>
                <p className="text-xs text-muted-foreground">99.3% success rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Syncs</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{performanceMetrics.failedSyncs}</div>
                <p className="text-xs text-muted-foreground">0.7% failure rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Sync Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceMetrics.averageSyncTime}</div>
                <p className="text-xs text-muted-foreground">Per operation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Volume</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceMetrics.dataVolume}</div>
                <p className="text-xs text-muted-foreground">Processed today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceMetrics.apiCalls.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Health Check</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold">{integrationHealth.lastHealthCheck}</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="integrations" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="alerts">Alerts & Issues</TabsTrigger>
            </TabsList>

            <TabsContent value="integrations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Status</CardTitle>
                  <CardDescription>Detailed status of all connected services</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Integration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Health</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Next Sync</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>Errors</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {integrations.map((integration) => {
                        const IconComponent = integration.icon;
                        return (
                          <TableRow key={integration.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg bg-${integration.color}-100`}>
                                  <IconComponent className={`h-4 w-4 text-${integration.color}-600`} />
                                </div>
                                <div>
                                  <p className="font-medium">{integration.name}</p>
                                  <p className="text-sm text-muted-foreground">ID: {integration.id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  integration.status === 'Connected' ? 'bg-green-500' : 'bg-yellow-500'
                                }`}></div>
                                <Badge variant={integration.status === 'Connected' ? 'success' : 'secondary'}>
                                  {integration.status}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{integration.health}%</span>
                                <Progress value={integration.health} className="w-16 h-2" />
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{integration.lastSync}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{integration.nextSync}</TableCell>
                            <TableCell>{integration.records.toLocaleString()}</TableCell>
                            <TableCell>
                              {integration.errors > 0 ? (
                                <Badge variant="destructive">{integration.errors}</Badge>
                              ) : (
                                <span className="text-green-600">0</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">View</Button>
                                <Button variant="outline" size="sm">Configure</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest integration events and sync operations</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Integration</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentActivity.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="text-sm text-muted-foreground">{activity.timestamp}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{activity.integration}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{activity.action}</TableCell>
                          <TableCell>
                            <Badge variant={
                              activity.status === 'Success' ? 'success' :
                              activity.status === 'Warning' ? 'default' :
                              'destructive'
                            }>
                              {activity.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{activity.details}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{activity.duration}</TableCell>
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

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sync Performance Trends</CardTitle>
                    <CardDescription>Performance metrics over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Success Rate</span>
                        <span className="text-2xl font-bold text-green-600">99.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Average Response Time</span>
                        <span className="text-2xl font-bold text-blue-600">2.3s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Data Throughput</span>
                        <span className="text-2xl font-bold text-purple-600">2.4GB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Integration Load</CardTitle>
                    <CardDescription>Current system load by integration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Salesforce</span>
                          <span>45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>GrownBy</span>
                          <span>32%</span>
                        </div>
                        <Progress value={32} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Shipping Services</span>
                          <span>18%</span>
                        </div>
                        <Progress value={18} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Payment Processing</span>
                          <span>5%</span>
                        </div>
                        <Progress value={5} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Alerts & Issues</CardTitle>
                  <CardDescription>Current issues requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Offline Sync Conflicts</p>
                          <p className="text-sm text-muted-foreground">3 records require manual review</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Resolve</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">High API Usage</p>
                          <p className="text-sm text-muted-foreground">Approaching rate limit for Stripe</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">All Systems Operational</p>
                          <p className="text-sm text-muted-foreground">No critical issues detected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Status</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </Fragment>
  );
}
