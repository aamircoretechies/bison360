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
import { Cloud, RefreshCw, Settings, Database, Users, Package, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';

export default function SalesforceSyncPage() {
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  // Mock Salesforce sync data
  const syncStatus = {
    lastSync: '2024-01-15 14:30:00',
    nextSync: '2024-01-15 15:00:00',
    totalRecords: 15420,
    syncedRecords: 15380,
    failedRecords: 40,
    syncProgress: 99.7
  };

  const syncHistory = [
    {
      id: 'sync-001',
      timestamp: '2024-01-15 14:30:00',
      type: 'Full Sync',
      records: 15420,
      status: 'Completed',
      duration: '12m 45s',
      errors: 0
    },
    {
      id: 'sync-002',
      timestamp: '2024-01-15 13:00:00',
      type: 'Incremental',
      records: 1250,
      status: 'Completed',
      duration: '1m 20s',
      errors: 0
    },
    {
      id: 'sync-003',
      timestamp: '2024-01-15 11:30:00',
      type: 'Full Sync',
      records: 15420,
      status: 'Failed',
      duration: '0m 0s',
      errors: 15
    }
  ];

  const dataMapping = [
    {
      bisonField: 'customer_name',
      salesforceField: 'Name',
      type: 'Text',
      isMapped: true,
      lastSync: '2024-01-15 14:30:00'
    },
    {
      bisonField: 'customer_email',
      salesforceField: 'Email',
      type: 'Email',
      isMapped: true,
      lastSync: '2024-01-15 14:30:00'
    },
    {
      bisonField: 'order_total',
      salesforceField: 'Amount',
      type: 'Currency',
      isMapped: true,
      lastSync: '2024-01-15 14:30:00'
    },
    {
      bisonField: 'product_sku',
      salesforceField: 'ProductCode',
      type: 'Text',
      isMapped: false,
      lastSync: 'Never'
    }
  ];

  const handleSyncNow = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text="Salesforce Sync" />
              <ToolbarDescription>
                Manage Salesforce integration, monitor sync status, and configure data mapping
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
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleSyncNow}
                disabled={isLoading}
              >
                <Cloud className="h-4 w-4 mr-2" />
                {isLoading ? 'Syncing...' : 'Sync Now'}
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <div className="space-y-6">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cloud className="h-4 w-4 mr-2" />
                Salesforce Connection Status
              </CardTitle>
              <CardDescription>Monitor connection health and sync performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Connected</p>
                    <p className="text-sm text-muted-foreground">Salesforce Production</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{syncStatus.syncProgress}%</p>
                  <p className="text-sm text-muted-foreground">Sync Progress</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{syncStatus.syncedRecords.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Synced Records</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{syncStatus.failedRecords}</p>
                  <p className="text-sm text-muted-foreground">Failed Records</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sync Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{syncStatus.lastSync}</div>
                <p className="text-xs text-muted-foreground">Next sync: {syncStatus.nextSync}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{syncStatus.totalRecords.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Available for sync</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Active</div>
                <p className="text-xs text-muted-foreground">Auto-sync every 30 minutes</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
              <TabsTrigger value="history">Sync History</TabsTrigger>
              <TabsTrigger value="settings">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sync Progress</CardTitle>
                    <CardDescription>Current synchronization status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Progress</span>
                          <span>{syncStatus.syncProgress}%</span>
                        </div>
                        <Progress value={syncStatus.syncProgress} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Synced Records</p>
                          <p className="font-medium">{syncStatus.syncedRecords.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Failed Records</p>
                          <p className="font-medium text-red-600">{syncStatus.failedRecords}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest sync operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {syncHistory.slice(0, 3).map((sync) => (
                        <div key={sync.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{sync.type}</p>
                            <p className="text-sm text-muted-foreground">{sync.timestamp}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={
                              sync.status === 'Completed' ? 'success' :
                              sync.status === 'Failed' ? 'destructive' :
                              'secondary'
                            }>
                              {sync.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground">{sync.records} records</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Synced Contacts</CardTitle>
                  <CardDescription>View and search contact records with customer order history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <Input placeholder="Search contacts..." className="flex-1" />
                      <Select defaultValue="all">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Contacts</SelectItem>
                          <SelectItem value="synced">Synced</SelectItem>
                          <SelectItem value="not-synced">Not Synced</SelectItem>
                          <SelectItem value="with-orders">With Orders</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contact Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Sync Status</TableHead>
                        <TableHead>Total Orders</TableHead>
                        <TableHead>Last Order</TableHead>
                        <TableHead>Total Value</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div>
                            <p className="font-medium">John Smith</p>
                            <p className="text-sm text-muted-foreground">SF ID: 0015g00000ABC123</p>
                          </div>
                        </TableCell>
                        <TableCell>john.smith@company.com</TableCell>
                        <TableCell>Acme Corp</TableCell>
                        <TableCell>
                          <Badge variant="success">Synced</Badge>
                        </TableCell>
                        <TableCell>12</TableCell>
                        <TableCell>2024-01-10</TableCell>
                        <TableCell>$2,450.00</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">View Orders</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div>
                            <p className="font-medium">Sarah Johnson</p>
                            <p className="text-sm text-muted-foreground">SF ID: 0015g00000DEF456</p>
                          </div>
                        </TableCell>
                        <TableCell>sarah.johnson@business.com</TableCell>
                        <TableCell>Business Solutions</TableCell>
                        <TableCell>
                          <Badge variant="success">Synced</Badge>
                        </TableCell>
                        <TableCell>8</TableCell>
                        <TableCell>2024-01-12</TableCell>
                        <TableCell>$1,890.50</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">View Orders</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div>
                            <p className="font-medium">Mike Wilson</p>
                            <p className="text-sm text-muted-foreground">SF ID: 0015g00000GHI789</p>
                          </div>
                        </TableCell>
                        <TableCell>mike.wilson@enterprise.com</TableCell>
                        <TableCell>Enterprise Inc</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Not Synced</Badge>
                        </TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>$0.00</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Sync Now</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mapping" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Field Mapping</CardTitle>
                  <CardDescription>Configure how Bison360 fields map to Salesforce fields</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bison360 Field</TableHead>
                        <TableHead>Salesforce Field</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataMapping.map((mapping) => (
                        <TableRow key={mapping.bisonField}>
                          <TableCell className="font-medium">{mapping.bisonField}</TableCell>
                          <TableCell>{mapping.salesforceField}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{mapping.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={mapping.isMapped ? 'success' : 'secondary'}>
                              {mapping.isMapped ? 'Mapped' : 'Unmapped'}
                            </Badge>
                          </TableCell>
                          <TableCell>{mapping.lastSync}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="outline" size="sm">Test</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sync History</CardTitle>
                  <CardDescription>Complete history of all synchronization operations</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Errors</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {syncHistory.map((sync) => (
                        <TableRow key={sync.id}>
                          <TableCell>{sync.timestamp}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{sync.type}</Badge>
                          </TableCell>
                          <TableCell>{sync.records.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={
                              sync.status === 'Completed' ? 'success' :
                              sync.status === 'Failed' ? 'destructive' :
                              'secondary'
                            }>
                              {sync.status}
                            </Badge>
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
                              {sync.status === 'Failed' && (
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

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Connection Settings</CardTitle>
                    <CardDescription>Salesforce API configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="instance">Salesforce Instance</Label>
                      <Input id="instance" value="https://company.salesforce.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiVersion">API Version</Label>
                      <Select defaultValue="58.0">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="58.0">58.0 (Latest)</SelectItem>
                          <SelectItem value="57.0">57.0</SelectItem>
                          <SelectItem value="56.0">56.0</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" value="integration@company.com" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-sync</Label>
                        <p className="text-sm text-muted-foreground">Enable automatic synchronization</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sync Settings</CardTitle>
                    <CardDescription>Configure synchronization behavior</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="syncInterval">Sync Interval</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">Every 15 minutes</SelectItem>
                          <SelectItem value="30">Every 30 minutes</SelectItem>
                          <SelectItem value="60">Every hour</SelectItem>
                          <SelectItem value="1440">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="batchSize">Batch Size</Label>
                      <Input id="batchSize" type="number" value="200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeout">Timeout (seconds)</Label>
                      <Input id="timeout" type="number" value="300" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Error Retry</Label>
                        <p className="text-sm text-muted-foreground">Retry failed records</p>
                      </div>
                      <Switch defaultChecked />
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

