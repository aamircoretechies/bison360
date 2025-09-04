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
import { Save, Download, Upload, Clock, Database, HardDrive, Calendar, AlertTriangle, CheckCircle, Play, Pause, Trash2, FileText, Archive, History } from 'lucide-react';
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

export default function BackupRestorePage() {
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  // Data Asset Backups State
  const [dataAssetBackups, setDataAssetBackups] = useState({
    enableReportExports: true,
    enableLabelArchives: true,
    enableLogArchives: true,
    enableOfflinePayloads: true,
    retentionPeriod: '90',
    compressionEnabled: true
  });

  // Restore Path State
  const [restorePath, setRestorePath] = useState({
    enableLabelRestore: true,
    enableLogRestore: true,
    enablePayloadRestore: true,
    versionControl: true,
    restoreValidation: true
  });

  // Backup History Data
  const backupHistory = [
    {
      id: 'backup-001',
      name: 'Full System Backup',
      type: 'Full',
      timestamp: '2024-01-15 02:00:00',
      size: '2.4 GB',
      status: 'Completed',
      duration: '15m 32s',
      location: 'Local Storage',
      retention: '30 days'
    },
    {
      id: 'backup-002',
      name: 'Incremental Backup',
      type: 'Incremental',
      timestamp: '2024-01-14 02:00:00',
      size: '156 MB',
      status: 'Completed',
      duration: '2m 15s',
      location: 'Cloud Storage',
      retention: '90 days'
    },
    {
      id: 'backup-003',
      name: 'Database Backup',
      type: 'Database',
      timestamp: '2024-01-13 02:00:00',
      size: '890 MB',
      status: 'Failed',
      duration: '0m 0s',
      location: 'Local Storage',
      retention: '30 days'
    },
    {
      id: 'backup-004',
      name: 'Configuration Backup',
      type: 'Config',
      timestamp: '2024-01-12 02:00:00',
      size: '45 MB',
      status: 'Completed',
      duration: '0m 45s',
      location: 'Local Storage',
      retention: '30 days'
    }
  ];

  const scheduledBackups = [
    {
      id: 'scheduled-001',
      name: 'Daily Full Backup',
      schedule: 'Daily at 2:00 AM',
      type: 'Full',
      location: 'Local + Cloud',
      isActive: true,
      lastRun: '2024-01-15 02:00:00',
      nextRun: '2024-01-16 02:00:00'
    },
    {
      id: 'scheduled-002',
      name: 'Hourly Incremental',
      schedule: 'Every hour',
      type: 'Incremental',
      location: 'Cloud Storage',
      isActive: true,
      lastRun: '2024-01-15 14:00:00',
      nextRun: '2024-01-15 15:00:00'
    },
    {
      id: 'scheduled-003',
      name: 'Weekly Archive',
      schedule: 'Weekly on Sunday at 3:00 AM',
      type: 'Archive',
      location: 'Long-term Storage',
      isActive: false,
      lastRun: '2024-01-14 03:00:00',
      nextRun: '2024-01-21 03:00:00'
    }
  ];

  const storageLocations = [
    {
      name: 'Local Storage',
      path: '/backups/local',
      type: 'Local Disk',
      totalSpace: '500 GB',
      usedSpace: '125 GB',
      availableSpace: '375 GB',
      status: 'Available'
    },
    {
      name: 'Cloud Storage',
      path: 's3://bison360-backups',
      type: 'AWS S3',
      totalSpace: '1 TB',
      usedSpace: '450 GB',
      availableSpace: '550 GB',
      status: 'Available'
    },
    {
      name: 'Long-term Storage',
      path: 's3://bison360-archive',
      type: 'AWS S3 Glacier',
      totalSpace: '5 TB',
      usedSpace: '2.1 TB',
      availableSpace: '2.9 TB',
      status: 'Available'
    }
  ];

  const auditLogs = [
    {
      id: 'audit-001',
      timestamp: '2024-01-15 15:30:00',
      user: 'admin@bison360.com',
      action: 'Export Report',
      details: 'USDA Compliance Report - PDF',
      status: 'Success',
      fileSize: '2.3 MB'
    },
    {
      id: 'audit-002',
      timestamp: '2024-01-15 14:45:00',
      user: 'meat_manager@bison360.com',
      action: 'Download Label',
      details: 'Product Label - BISON-001',
      status: 'Success',
      fileSize: '156 KB'
    },
    {
      id: 'audit-003',
      timestamp: '2024-01-15 14:20:00',
      user: 'admin@bison360.com',
      action: 'Restore Data',
      details: 'Inventory Data from Backup-001',
      status: 'Success',
      fileSize: 'N/A'
    }
  ];

  const handleCreateBackup = async () => {
    setIsLoading(true);
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handleRestore = async (backupId: string) => {
    setIsLoading(true);
    // Simulate restore operation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsLoading(false);
  };

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text="Backup & Restore Settings (Admin)" />
              <ToolbarDescription>
                Manage data asset backups, restore operations, and audit trail logging
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Backup
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Backup
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleCreateBackup}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Creating...' : 'Create Backup'}
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <div className="space-y-6">
          <Tabs defaultValue="data-assets" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="data-assets">
                <Archive className="h-4 w-4 mr-2" />
                Data Assets
              </TabsTrigger>
              <TabsTrigger value="restore-path">
                <Upload className="h-4 w-4 mr-2" />
                Restore Path
              </TabsTrigger>
              <TabsTrigger value="audit-trail">
                <History className="h-4 w-4 mr-2" />
                Audit Trail
              </TabsTrigger>
              <TabsTrigger value="backup-management">
                <Database className="h-4 w-4 mr-2" />
                Backup Management
              </TabsTrigger>
            </TabsList>

            {/* Data Asset Backups Tab */}
            <TabsContent value="data-assets" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Data Asset Backup Configuration</h3>
                  <p className="text-sm text-muted-foreground">Configure backup settings for reports, labels, logs, and offline payloads</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Data Asset Backup Settings</CardTitle>
                  <CardDescription>Configure what data assets are backed up and how</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Backup Types</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Report Exports</Label>
                          <p className="text-sm text-muted-foreground">Backup generated reports (PDF/CSV)</p>
                        </div>
                        <Switch
                          checked={dataAssetBackups.enableReportExports}
                          onCheckedChange={(checked) => setDataAssetBackups({...dataAssetBackups, enableReportExports: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Label Archives</Label>
                          <p className="text-sm text-muted-foreground">Archive label PDFs</p>
                        </div>
                        <Switch
                          checked={dataAssetBackups.enableLabelArchives}
                          onCheckedChange={(checked) => setDataAssetBackups({...dataAssetBackups, enableLabelArchives: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Log Archives</Label>
                          <p className="text-sm text-muted-foreground">Archive system and audit logs</p>
                        </div>
                        <Switch
                          checked={dataAssetBackups.enableLogArchives}
                          onCheckedChange={(checked) => setDataAssetBackups({...dataAssetBackups, enableLogArchives: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Offline Payloads</Label>
                          <p className="text-sm text-muted-foreground">Backup offline sync payloads</p>
                        </div>
                        <Switch
                          checked={dataAssetBackups.enableOfflinePayloads}
                          onCheckedChange={(checked) => setDataAssetBackups({...dataAssetBackups, enableOfflinePayloads: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Backup Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                        <Select value={dataAssetBackups.retentionPeriod} onValueChange={(value) => setDataAssetBackups({...dataAssetBackups, retentionPeriod: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select retention period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="60">60 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">180 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Compression</Label>
                          <p className="text-sm text-muted-foreground">Compress backup files to save space</p>
                        </div>
                        <Switch
                          checked={dataAssetBackups.compressionEnabled}
                          onCheckedChange={(checked) => setDataAssetBackups({...dataAssetBackups, compressionEnabled: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Export Formats</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="pdf_export" defaultChecked />
                        <Label htmlFor="pdf_export">PDF</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="csv_export" defaultChecked />
                        <Label htmlFor="csv_export">CSV</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="excel_export" defaultChecked />
                        <Label htmlFor="excel_export">Excel</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="json_export" />
                        <Label htmlFor="json_export">JSON</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+3 this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.5 GB</div>
                    <p className="text-xs text-muted-foreground">+156 MB this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">95.8%</div>
                    <p className="text-xs text-muted-foreground">1 failed this week</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Restore Path Tab */}
            <TabsContent value="restore-path" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Restore Path Configuration</h3>
                  <p className="text-sm text-muted-foreground">Configure restore operations for labels, logs, and offline payloads</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Restore Path Settings</CardTitle>
                  <CardDescription>Configure how data assets are restored and validated</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Restore Types</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Label Restore</Label>
                          <p className="text-sm text-muted-foreground">Allow re-download of label PDFs</p>
                        </div>
                        <Switch
                          checked={restorePath.enableLabelRestore}
                          onCheckedChange={(checked) => setRestorePath({...restorePath, enableLabelRestore: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Log Restore</Label>
                          <p className="text-sm text-muted-foreground">Allow retrieval of archived logs</p>
                        </div>
                        <Switch
                          checked={restorePath.enableLogRestore}
                          onCheckedChange={(checked) => setRestorePath({...restorePath, enableLogRestore: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Payload Restore</Label>
                          <p className="text-sm text-muted-foreground">Allow retrieval of offline payloads</p>
                        </div>
                        <Switch
                          checked={restorePath.enablePayloadRestore}
                          onCheckedChange={(checked) => setRestorePath({...restorePath, enablePayloadRestore: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Version Control</Label>
                          <p className="text-sm text-muted-foreground">Maintain version history for restores</p>
                        </div>
                        <Switch
                          checked={restorePath.versionControl}
                          onCheckedChange={(checked) => setRestorePath({...restorePath, versionControl: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Restore Validation</h4>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Restore Validation</Label>
                        <p className="text-sm text-muted-foreground">Validate restored data integrity</p>
                      </div>
                      <Switch
                        checked={restorePath.restoreValidation}
                        onCheckedChange={(checked) => setRestorePath({...restorePath, restoreValidation: checked})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Restore Operations */}
              <Card>
                <CardHeader>
                  <CardTitle>Restore Operations</CardTitle>
                  <CardDescription>Restore data from existing backups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Restore Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Full System Restore</CardTitle>
                          <CardDescription>Restore entire system from a full backup</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullBackup">Select Backup</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose backup file" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="backup-001">Full System Backup - 2024-01-15</SelectItem>
                                <SelectItem value="backup-002">Full System Backup - 2024-01-08</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="restoreLocation">Restore Location</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose restore location" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="current">Current System</SelectItem>
                                <SelectItem value="new">New Environment</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button 
                            variant="destructive" 
                            className="w-full"
                            onClick={() => handleRestore('full')}
                            disabled={isLoading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {isLoading ? 'Restoring...' : 'Restore Full System'}
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Selective Restore</CardTitle>
                          <CardDescription>Restore specific data or components</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="selectiveBackup">Select Backup</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose backup file" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="backup-001">Full System Backup - 2024-01-15</SelectItem>
                                <SelectItem value="backup-002">Incremental Backup - 2024-01-14</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="restoreComponents">Components to Restore</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="users" defaultChecked />
                                <Label htmlFor="users">Users & Permissions</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="inventory" defaultChecked />
                                <Label htmlFor="inventory">Inventory Data</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sales" />
                                <Label htmlFor="sales">Sales Data</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="config" />
                                <Label htmlFor="config">System Configuration</Label>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => handleRestore('selective')}
                            disabled={isLoading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {isLoading ? 'Restoring...' : 'Restore Selected Components'}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Restore History */}
                    <div>
                      <h4 className="font-medium mb-4">Recent Restore Operations</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Full System Restore</p>
                            <p className="text-sm text-muted-foreground">From: Full System Backup - 2024-01-08</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="success">Completed</Badge>
                            <p className="text-sm text-muted-foreground">2024-01-10 15:30:00</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Database Restore</p>
                            <p className="text-sm text-muted-foreground">From: Database Backup - 2024-01-05</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="success">Completed</Badge>
                            <p className="text-sm text-muted-foreground">2024-01-06 09:15:00</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Trail Tab */}
            <TabsContent value="audit-trail" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Audit Trail Configuration</h3>
                  <p className="text-sm text-muted-foreground">Monitor and log all export/restore actions</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Audit Trail Settings</CardTitle>
                  <CardDescription>Configure audit logging for backup and restore operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Audit Logging</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Log Export Actions</Label>
                          <p className="text-sm text-muted-foreground">Log all data export operations</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Log Restore Actions</Label>
                          <p className="text-sm text-muted-foreground">Log all data restore operations</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Log Download Actions</Label>
                          <p className="text-sm text-muted-foreground">Log all backup downloads</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Log Upload Actions</Label>
                          <p className="text-sm text-muted-foreground">Log all backup uploads</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Audit Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="auditRetention">Audit Log Retention (days)</Label>
                        <Select defaultValue="365">
                          <SelectTrigger>
                            <SelectValue placeholder="Select retention period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">180 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                            <SelectItem value="730">2 years</SelectItem>
                            <SelectItem value="1095">3 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="auditLevel">Audit Detail Level</Label>
                        <Select defaultValue="detailed">
                          <SelectTrigger>
                            <SelectValue placeholder="Select detail level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic (User, Action, Timestamp)</SelectItem>
                            <SelectItem value="detailed">Detailed (Include file sizes, paths)</SelectItem>
                            <SelectItem value="verbose">Verbose (Include all metadata)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audit Logs Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Audit Logs</CardTitle>
                  <CardDescription>View recent export, restore, and backup operations</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>File Size</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.timestamp}</TableCell>
                          <TableCell className="font-medium">{log.user}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" appearance="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                          <TableCell>
                            <Badge variant={log.status === 'Success' ? 'success' : 'destructive'}>
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.fileSize}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Backup Management Tab */}
            <TabsContent value="backup-management" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Backup Management</h3>
                  <p className="text-sm text-muted-foreground">Manage system backups, schedules, and storage locations</p>
                </div>
              </div>

              {/* Storage Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Storage Locations</CardTitle>
                  <CardDescription>Monitor backup storage usage across different locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {storageLocations.map((location) => (
                      <div key={location.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <HardDrive className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{location.name}</h4>
                            <p className="text-sm text-muted-foreground">{location.path}</p>
                            <p className="text-xs text-muted-foreground">{location.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{location.usedSpace} / {location.totalSpace}</p>
                            <p className="text-xs text-muted-foreground">
                              {location.availableSpace} available
                            </p>
                          </div>
                          <div className="w-32">
                            <Progress 
                              value={parseInt(location.usedSpace) / parseInt(location.totalSpace) * 100} 
                              className="h-2" 
                            />
                          </div>
                          <Badge variant={location.status === 'Available' ? 'success' : 'secondary'}>
                            {location.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Backup History */}
              <Card>
                <CardHeader>
                  <CardTitle>Backup History</CardTitle>
                  <CardDescription>Complete history of all backup operations</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Backup Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {backupHistory.map((backup) => (
                        <TableRow key={backup.id}>
                          <TableCell className="font-medium">{backup.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" appearance="outline">{backup.type}</Badge>
                          </TableCell>
                          <TableCell>{backup.timestamp}</TableCell>
                          <TableCell>{backup.size}</TableCell>
                          <TableCell>
                            <Badge variant={
                              backup.status === 'Completed' ? 'success' :
                              backup.status === 'Failed' ? 'destructive' :
                              backup.status === 'In Progress' ? 'secondary' :
                              'secondary'
                            }>
                              {backup.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{backup.duration}</TableCell>
                          <TableCell>{backup.location}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Upload className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Scheduled Backups */}
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Backups</CardTitle>
                  <CardDescription>Manage automated backup schedules</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Schedule Name</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Run</TableHead>
                        <TableHead>Next Run</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduledBackups.map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell className="font-medium">{schedule.name}</TableCell>
                          <TableCell>{schedule.schedule}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" appearance="outline">{schedule.type}</Badge>
                          </TableCell>
                          <TableCell>{schedule.location}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge variant={schedule.isActive ? 'success' : 'secondary'}>
                                {schedule.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Switch
                                checked={schedule.isActive}
                                onCheckedChange={() => {}}
                              />
                            </div>
                          </TableCell>
                          <TableCell>{schedule.lastRun}</TableCell>
                          <TableCell>{schedule.nextRun}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Pause className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Calendar className="h-4 w-4" />
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
          </Tabs>
        </div>
      </Container>
    </Fragment>
  );
}

