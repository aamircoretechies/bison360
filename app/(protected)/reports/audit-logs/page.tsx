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
import { Download, FileText, BarChart3, Shield, AlertTriangle, Eye, Clock, User, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AuditLogsPage() {
  const { settings } = useSettings();
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Mock audit log data
  const auditLogs = [
    {
      id: 'AUDIT-001',
      timestamp: '2024-01-15 14:30:25',
      user: 'john.smith@company.com',
      action: 'User Login',
      resource: 'Authentication System',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0.0.0',
      status: 'Success',
      level: 'Info',
      details: 'Successful login from office network'
    },
    {
      id: 'AUDIT-002',
      timestamp: '2024-01-15 14:25:18',
      user: 'sarah.johnson@company.com',
      action: 'Data Export',
      resource: 'Inventory Database',
      ipAddress: '192.168.1.105',
      userAgent: 'Firefox 121.0.0.0',
      status: 'Success',
      level: 'Info',
      details: 'Exported 500 inventory records to CSV'
    },
    {
      id: 'AUDIT-003',
      timestamp: '2024-01-15 14:20:42',
      user: 'admin@company.com',
      action: 'User Role Modified',
      resource: 'User Management',
      ipAddress: '192.168.1.001',
      userAgent: 'Chrome 120.0.0.0',
      status: 'Success',
      level: 'Warning',
      details: 'Changed role for user mike.wilson from User to Manager'
    },
    {
      id: 'AUDIT-004',
      timestamp: '2024-01-15 14:15:33',
      user: 'unknown',
      action: 'Failed Login Attempt',
      resource: 'Authentication System',
      ipAddress: '203.45.67.89',
      userAgent: 'Unknown Browser',
      status: 'Failed',
      level: 'Error',
      details: 'Multiple failed login attempts from external IP'
    }
  ];

  const securityEvents = [
    { type: 'Failed Logins', count: 12, severity: 'Medium', trend: '+3' },
    { type: 'Data Exports', count: 8, severity: 'Low', trend: '+1' },
    { type: 'Role Changes', count: 3, severity: 'High', trend: '+2' },
    { type: 'System Access', count: 45, severity: 'Low', trend: '+5' }
  ];

  const userActivity = [
    { user: 'john.smith@company.com', lastActivity: '2 minutes ago', status: 'Active', sessions: 1 },
    { user: 'sarah.johnson@company.com', lastActivity: '15 minutes ago', status: 'Active', sessions: 1 },
    { user: 'admin@company.com', lastActivity: '1 hour ago', status: 'Active', sessions: 2 },
    { user: 'mike.wilson@company.com', lastActivity: '3 hours ago', status: 'Inactive', sessions: 0 }
  ];

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle>Audit Logs</ToolbarPageTitle>
              <ToolbarDescription>
                Monitor system activity, user actions, and security events across all platforms
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Logs
              </Button>
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Security Report
              </Button>
              <Button variant="primary" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Live Monitor
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
              <CardTitle>Log Filters</CardTitle>
              <CardDescription>Filter audit logs by time, severity, and user</CardDescription>
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
                      <SelectItem value="1h">Last Hour</SelectItem>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Log Level</Label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user">User</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="admin">Administrators</SelectItem>
                      <SelectItem value="manager">Managers</SelectItem>
                      <SelectItem value="user">Regular Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search">Search Logs</Label>
                  <Input placeholder="Search by action, resource..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68</div>
                <p className="text-xs text-muted-foreground">+12 from last hour</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">2 high priority</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">3 internal, 1 external</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Logs Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="security">Security Events</TabsTrigger>
              <TabsTrigger value="users">User Activity</TabsTrigger>
              <TabsTrigger value="logs">Detailed Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Distribution</CardTitle>
                    <CardDescription>Audit events by severity level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { level: 'Info', count: 45, color: 'bg-blue-500', percentage: 66 },
                        { level: 'Warning', count: 15, color: 'bg-yellow-500', percentage: 22 },
                        { level: 'Error', count: 6, color: 'bg-red-500', percentage: 9 },
                        { level: 'Critical', count: 2, color: 'bg-purple-500', percentage: 3 }
                      ].map((item) => (
                        <div key={item.level} className="flex items-center justify-between">
                          <span className="text-sm">{item.level}</span>
                          <div className="flex items-center space-x-2">
                            <div className={`w-20 h-2 rounded-full ${item.color}`}></div>
                            <span className="text-sm font-medium">{item.count}</span>
                            <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity Timeline</CardTitle>
                    <CardDescription>Latest system events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {auditLogs.slice(0, 4).map((log) => (
                        <div key={log.id} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            log.level === 'Info' ? 'bg-blue-500' :
                            log.level === 'Warning' ? 'bg-yellow-500' :
                            log.level === 'Error' ? 'bg-red-500' : 'bg-purple-500'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{log.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {log.user} • {log.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Event Summary</CardTitle>
                  <CardDescription>Overview of security-related activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Type</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {securityEvents.map((event) => (
                        <TableRow key={event.type}>
                          <TableCell className="font-medium">{event.type}</TableCell>
                          <TableCell>{event.count}</TableCell>
                          <TableCell>
                            <Badge variant={
                              event.severity === 'High' ? 'destructive' :
                              event.severity === 'Medium' ? 'secondary' :
                              'outline'
                            }>
                              {event.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-green-600">{event.trend}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Investigate</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity Monitor</CardTitle>
                  <CardDescription>Real-time user session and activity tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Active Sessions</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userActivity.map((user) => (
                        <TableRow key={user.user}>
                          <TableCell className="font-medium">{user.user}</TableCell>
                          <TableCell>{user.lastActivity}</TableCell>
                          <TableCell>
                            <Badge variant={
                              user.status === 'Active' ? 'success' : 'secondary'
                            }>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.sessions}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View Details</Button>
                              <Button variant="outline" size="sm">Terminate Session</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Audit Logs</CardTitle>
                  <CardDescription>Comprehensive view of all system audit events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.id}</TableCell>
                          <TableCell>{log.timestamp}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.resource}</TableCell>
                          <TableCell>{log.ipAddress}</TableCell>
                          <TableCell>
                            <Badge variant={
                              log.status === 'Success' ? 'success' :
                              log.status === 'Failed' ? 'destructive' :
                              'secondary'
                            }>
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              log.level === 'Info' ? 'default' :
                              log.level === 'Warning' ? 'secondary' :
                              log.level === 'Error' ? 'destructive' :
                              'outline'
                            }>
                              {log.level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Clock className="h-4 w-4" />
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

