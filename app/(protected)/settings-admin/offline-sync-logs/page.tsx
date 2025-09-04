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
import { RefreshCw, AlertTriangle, CheckCircle, Clock, Download, Upload, Wifi, WifiOff, Filter, Settings, Database, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function OfflineSyncLogsPage() {
  const { settings } = useSettings();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('24h');

  // Offline Cache Configuration State
  const [offlineCacheConfig, setOfflineCacheConfig] = useState({
    enableOfflineMode: true,
    cacheSize: '500MB',
    encryptionEnabled: true,
    autoCleanup: true,
    cleanupThreshold: '100MB'
  });

  // Sync Triggers State
  const [syncTriggers, setSyncTriggers] = useState({
    onLogin: true,
    onManualRefresh: true,
    onNewEntry: true,
    onOrderSubmission: true,
    automaticRetry: true,
    retryAttempts: 3,
    retryDelay: 5000
  });

  // Sync Logs Data
  const syncLogs = [
    {
      id: 'sync-001',
      timestamp: '2024-01-15 14:30:25',
      device: 'POS Terminal 01',
      user: 'john.smith@company.com',
      operation: 'Upload',
      entity: 'Sales Transactions',
      records: 45,
      status: 'Completed',
      duration: '2.3s',
      conflicts: 0,
      errors: 0
    },
    {
      id: 'sync-002',
      timestamp: '2024-01-15 14:25:18',
      device: 'Mobile App - Sarah',
      user: 'sarah.johnson@company.com',
      operation: 'Download',
      entity: 'Inventory Updates',
      records: 128,
      status: 'Completed',
      duration: '5.1s',
      conflicts: 0,
      errors: 0
    },
    {
      id: 'sync-003',
      timestamp: '2024-01-15 14:20:42',
      device: 'Warehouse Tablet 03',
      user: 'mike.wilson@company.com',
      operation: 'Upload',
      entity: 'Stock Movements',
      records: 23,
      status: 'Failed',
      duration: '0.0s',
      conflicts: 2,
      errors: 1
    },
    {
      id: 'sync-004',
      timestamp: '2024-01-15 14:15:33',
      device: 'Office Desktop',
      user: 'admin@company.com',
      operation: 'Download',
      entity: 'User Permissions',
      records: 12,
      status: 'In Progress',
      duration: '1.2s',
      conflicts: 0,
      errors: 0
    }
  ];

  const conflictLogs = [
    {
      id: 'conflict-001',
      timestamp: '2024-01-15 14:20:42',
      entity: 'Stock Movements',
      field: 'quantity',
      localValue: '150',
      serverValue: '145',
      resolution: 'Pending',
      device: 'Warehouse Tablet 03',
      user: 'mike.wilson@company.com'
    },
    {
      id: 'conflict-002',
      timestamp: '2024-01-15 14:20:42',
      entity: 'Stock Movements',
      field: 'location',
      localValue: 'Shelf A-12',
      serverValue: 'Shelf A-15',
      resolution: 'Pending',
      device: 'Warehouse Tablet 03',
      user: 'mike.wilson@company.com'
    }
  ];

  const deviceStatus = [
    {
      device: 'POS Terminal 01',
      status: 'Online',
      lastSync: '2 minutes ago',
      syncStatus: 'Up to date',
      pendingChanges: 0,
      conflicts: 0
    },
    {
      device: 'Mobile App - Sarah',
      status: 'Online',
      lastSync: '15 minutes ago',
      syncStatus: 'Up to date',
      pendingChanges: 0,
      conflicts: 0
    },
    {
      device: 'Warehouse Tablet 03',
      status: 'Offline',
      lastSync: '1 hour ago',
      syncStatus: 'Sync failed',
      pendingChanges: 5,
      conflicts: 2
    },
    {
      device: 'Office Desktop',
      status: 'Online',
      lastSync: '1 minute ago',
      syncStatus: 'Syncing...',
      pendingChanges: 0,
      conflicts: 0
    }
  ];

  const syncStats = {
    totalDevices: 4,
    onlineDevices: 3,
    offlineDevices: 1,
    totalRecords: 208,
    pendingSync: 5,
    conflicts: 2,
    successRate: 87.5
  };

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text="Offline Sync Settings (Admin)" />
              <CardDescription>
                Configure offline caching, sync triggers, and monitor synchronization status
              </CardDescription>
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
              <Button variant="primary" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Force Sync All
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <div className="space-y-6">
          <Tabs defaultValue="cache-config" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="cache-config">
                <Database className="h-4 w-4 mr-2" />
                What to Cache
              </TabsTrigger>
              <TabsTrigger value="sync-triggers">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Triggers
              </TabsTrigger>
              <TabsTrigger value="status-logs">
                <Smartphone className="h-4 w-4 mr-2" />
                Status & Logs
              </TabsTrigger>
              <TabsTrigger value="monitoring">
                <Wifi className="h-4 w-4 mr-2" />
                Monitoring
              </TabsTrigger>
            </TabsList>

            {/* What to Cache Offline Tab */}
            <TabsContent value="cache-config" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Offline Cache Configuration</h3>
                  <p className="text-sm text-muted-foreground">Configure what data is cached offline and storage settings</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Offline Cache Settings</CardTitle>
                  <CardDescription>Manage offline data caching and storage configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Cache Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Offline Mode</Label>
                          <p className="text-sm text-muted-foreground">Allow data to be cached offline</p>
                        </div>
                        <Switch
                          checked={offlineCacheConfig.enableOfflineMode}
                          onCheckedChange={(checked) => setOfflineCacheConfig({...offlineCacheConfig, enableOfflineMode: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Encryption</Label>
                          <p className="text-sm text-muted-foreground">Encrypt offline data for security</p>
                        </div>
                        <Switch
                          checked={offlineCacheConfig.encryptionEnabled}
                          onCheckedChange={(checked) => setOfflineCacheConfig({...offlineCacheConfig, encryptionEnabled: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto Cleanup</Label>
                          <p className="text-sm text-muted-foreground">Automatically clean old cached data</p>
                        </div>
                        <Switch
                          checked={offlineCacheConfig.autoCleanup}
                          onCheckedChange={(checked) => setOfflineCacheConfig({...offlineCacheConfig, autoCleanup: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Storage Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cacheSize">Maximum Cache Size</Label>
                        <Select value={offlineCacheConfig.cacheSize} onValueChange={(value) => setOfflineCacheConfig({...offlineCacheConfig, cacheSize: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cache size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="100MB">100 MB</SelectItem>
                            <SelectItem value="250MB">250 MB</SelectItem>
                            <SelectItem value="500MB">500 MB</SelectItem>
                            <SelectItem value="1GB">1 GB</SelectItem>
                            <SelectItem value="2GB">2 GB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cleanupThreshold">Cleanup Threshold</Label>
                        <Select value={offlineCacheConfig.cleanupThreshold} onValueChange={(value) => setOfflineCacheConfig({...offlineCacheConfig, cleanupThreshold: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cleanup threshold" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50MB">50 MB</SelectItem>
                            <SelectItem value="100MB">100 MB</SelectItem>
                            <SelectItem value="200MB">200 MB</SelectItem>
                            <SelectItem value="500MB">500 MB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Data Types to Cache</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">Inventory Data</h5>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="products" defaultChecked />
                            <Label htmlFor="products">Products & SKUs</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="stock_levels" defaultChecked />
                            <Label htmlFor="stock_levels">Stock Levels</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="locations" defaultChecked />
                            <Label htmlFor="locations">Inventory Locations</Label>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">Sales Data</h5>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="orders" defaultChecked />
                            <Label htmlFor="orders">Orders & Transactions</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="customers" defaultChecked />
                            <Label htmlFor="customers">Customer Information</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="pricing" defaultChecked />
                            <Label htmlFor="pricing">Pricing & Discounts</Label>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">User Data</h5>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="user_profiles" defaultChecked />
                            <Label htmlFor="user_profiles">User Profiles</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="permissions" defaultChecked />
                            <Label htmlFor="permissions">Permissions & Roles</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="preferences" />
                            <Label htmlFor="preferences">User Preferences</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sync Triggers Tab */}
            <TabsContent value="sync-triggers" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Sync Trigger Configuration</h3>
                  <p className="text-sm text-muted-foreground">Configure when and how synchronization is triggered</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Automatic Sync Triggers</CardTitle>
                  <CardDescription>Configure automatic synchronization triggers and retry behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Trigger Events</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Sync on Login</Label>
                          <p className="text-sm text-muted-foreground">Trigger sync when user logs in</p>
                        </div>
                        <Switch
                          checked={syncTriggers.onLogin}
                          onCheckedChange={(checked) => setSyncTriggers({...syncTriggers, onLogin: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Sync on Manual Refresh</Label>
                          <p className="text-sm text-muted-foreground">Allow manual sync trigger</p>
                        </div>
                        <Switch
                          checked={syncTriggers.onManualRefresh}
                          onCheckedChange={(checked) => setSyncTriggers({...syncTriggers, onManualRefresh: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Sync on New Entry</Label>
                          <p className="text-sm text-muted-foreground">Sync when new data is entered</p>
                        </div>
                        <Switch
                          checked={syncTriggers.onNewEntry}
                          onCheckedChange={(checked) => setSyncTriggers({...syncTriggers, onNewEntry: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Sync on Order Submission</Label>
                          <p className="text-sm text-muted-foreground">Sync when orders are submitted</p>
                        </div>
                        <Switch
                          checked={syncTriggers.onOrderSubmission}
                          onCheckedChange={(checked) => setSyncTriggers({...syncTriggers, onOrderSubmission: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Retry Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Automatic Retry on Failure</Label>
                          <p className="text-sm text-muted-foreground">Retry failed sync operations</p>
                        </div>
                        <Switch
                          checked={syncTriggers.automaticRetry}
                          onCheckedChange={(checked) => setSyncTriggers({...syncTriggers, automaticRetry: checked})}
                        />
                      </div>
                      {syncTriggers.automaticRetry && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="retryAttempts">Maximum Retry Attempts</Label>
                            <Input
                              id="retryAttempts"
                              type="number"
                              value={syncTriggers.retryAttempts}
                              onChange={(e) => setSyncTriggers({...syncTriggers, retryAttempts: parseInt(e.target.value)})}
                              min="1"
                              max="10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="retryDelay">Retry Delay (ms)</Label>
                            <Input
                              id="retryDelay"
                              type="number"
                              value={syncTriggers.retryDelay}
                              onChange={(e) => setSyncTriggers({...syncTriggers, retryDelay: parseInt(e.target.value)})}
                              min="1000"
                              max="30000"
                              step="1000"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Sync Priority</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="priority_realtime" name="sync_priority" defaultChecked />
                        <Label htmlFor="priority_realtime">Real-time (Immediate sync)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="priority_batched" name="sync_priority" />
                        <Label htmlFor="priority_batched">Batched (Sync in groups)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="priority_scheduled" name="sync_priority" />
                        <Label htmlFor="priority_scheduled">Scheduled (Sync at intervals)</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Status & Logs Tab */}
            <TabsContent value="status-logs" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Sync Status & Logs</h3>
                  <p className="text-sm text-muted-foreground">Monitor synchronization status and view detailed logs</p>
                </div>
              </div>

              {/* Sync Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{syncStats.totalDevices}</div>
                    <p className="text-xs text-muted-foreground">
                      {syncStats.onlineDevices} online, {syncStats.offlineDevices} offline
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{syncStats.successRate}%</div>
                    <p className="text-xs text-muted-foreground">+2.1% from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Sync</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{syncStats.pendingSync}</div>
                    <p className="text-xs text-muted-foreground">Records waiting to sync</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conflicts</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{syncStats.conflicts}</div>
                    <p className="text-xs text-muted-foreground">Require resolution</p>
                  </CardContent>
                </Card>
              </div>

              {/* Device Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Sync Status</CardTitle>
                  <CardDescription>Real-time status of all connected devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deviceStatus.map((device) => (
                      <div key={device.device} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            device.status === 'Online' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <h4 className="font-medium">{device.device}</h4>
                            <p className="text-sm text-muted-foreground">
                              Last sync: {device.lastSync}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{device.syncStatus}</p>
                            <p className="text-xs text-muted-foreground">
                              {device.pendingChanges} pending, {device.conflicts} conflicts
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Logs */}
              <Card>
                <CardHeader>
                  <CardTitle>Sync Activity Logs</CardTitle>
                  <CardDescription>Detailed logs of all synchronization activities</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Operation</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Conflicts</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {syncLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.timestamp}</TableCell>
                          <TableCell className="font-medium">{log.device}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" appearance="outline" className={
                              log.operation === 'Upload' ? 'text-blue-600' : 'text-green-600'
                            }>
                              {log.operation === 'Upload' ? <Upload className="h-3 w-3 mr-1" /> : <Download className="h-3 w-3 mr-1" />}
                              {log.operation}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.entity}</TableCell>
                          <TableCell>{log.records}</TableCell>
                          <TableCell>
                            <Badge variant={
                              log.status === 'Completed' ? 'success' :
                              log.status === 'Failed' ? 'destructive' :
                              log.status === 'In Progress' ? 'secondary' :
                              'secondary'
                            }>
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.duration}</TableCell>
                          <TableCell>
                            {log.conflicts > 0 ? (
                              <Badge variant="destructive">{log.conflicts}</Badge>
                            ) : (
                              <span className="text-green-600">0</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              {log.status === 'Failed' && (
                                <Button variant="outline" size="sm">Retry</Button>
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

            {/* Monitoring Tab */}
            <TabsContent value="monitoring" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Sync Monitoring & Analytics</h3>
                  <p className="text-sm text-muted-foreground">Monitor sync performance and analyze patterns</p>
                </div>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Sync Filters</CardTitle>
                  <CardDescription>Filter sync logs by status, time period, and device</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Sync Status</Label>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="period">Time Period</Label>
                      <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">Last Hour</SelectItem>
                          <SelectItem value="24h">Last 24 Hours</SelectItem>
                          <SelectItem value="7d">Last 7 Days</SelectItem>
                          <SelectItem value="30d">Last 30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="device">Device</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select device" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Devices</SelectItem>
                          <SelectItem value="pos">POS Terminals</SelectItem>
                          <SelectItem value="mobile">Mobile Apps</SelectItem>
                          <SelectItem value="tablet">Tablets</SelectItem>
                          <SelectItem value="desktop">Desktop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="search">Search</Label>
                      <Input placeholder="Search by entity, user..." />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sync Performance</CardTitle>
                    <CardDescription>Average sync times by operation type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Upload Operations</span>
                          <span>2.8s avg</span>
                        </div>
                        <Progress value={70} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Download Operations</span>
                          <span>4.2s avg</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Conflict Resolution</span>
                          <span>1.5s avg</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sync Volume</CardTitle>
                    <CardDescription>Records synced by entity type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Sales Transactions</span>
                          <span>45 records</span>
                        </div>
                        <Progress value={22} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Inventory Updates</span>
                          <span>128 records</span>
                        </div>
                        <Progress value={62} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Stock Movements</span>
                          <span>23 records</span>
                        </div>
                        <Progress value={11} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>User Permissions</span>
                          <span>12 records</span>
                        </div>
                        <Progress value={6} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Conflicts Resolution */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Conflicts</CardTitle>
                  <CardDescription>Resolve conflicts between local and server data</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Field</TableHead>
                        <TableHead>Local Value</TableHead>
                        <TableHead>Server Value</TableHead>
                        <TableHead>Resolution</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conflictLogs.map((conflict) => (
                        <TableRow key={conflict.id}>
                          <TableCell>{conflict.timestamp}</TableCell>
                          <TableCell className="font-medium">{conflict.entity}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {conflict.field}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="bg-blue-50 p-2 rounded">
                              <span className="text-blue-800 font-medium">{conflict.localValue}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="bg-green-50 p-2 rounded">
                              <span className="text-green-800 font-medium">{conflict.serverValue}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{conflict.resolution}</Badge>
                          </TableCell>
                          <TableCell>{conflict.device}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Use Local</Button>
                              <Button variant="outline" size="sm">Use Server</Button>
                              <Button variant="outline" size="sm">Merge</Button>
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

