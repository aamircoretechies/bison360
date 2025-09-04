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
import { Download, FileText, BarChart3, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function USDAReportsPage() {
  const { settings } = useSettings();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedFacility, setSelectedFacility] = useState('all');

  // Mock data for USDA reports
  const usdaReports = [
    {
      id: 'USDA-001',
      reportType: 'Monthly Production Report',
      facility: 'Main Processing Plant',
      period: 'January 2024',
      status: 'Submitted',
      dueDate: '2024-02-15',
      submittedDate: '2024-02-10',
      inspector: 'John Smith',
      compliance: 'Compliant'
    },
    {
      id: 'USDA-002',
      reportType: 'HACCP Plan Review',
      facility: 'Secondary Facility',
      period: 'Q4 2023',
      status: 'Pending Review',
      dueDate: '2024-01-31',
      submittedDate: '2024-01-25',
      inspector: 'Sarah Johnson',
      compliance: 'Under Review'
    },
    {
      id: 'USDA-003',
      reportType: 'Food Safety Inspection',
      facility: 'Main Processing Plant',
      period: 'December 2023',
      status: 'Completed',
      dueDate: '2024-01-15',
      submittedDate: '2024-01-10',
      inspector: 'Mike Wilson',
      compliance: 'Compliant'
    }
  ];

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle>USDA Reports</ToolbarPageTitle>
              <ToolbarDescription>
                Manage and submit USDA compliance reports and documentation
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="primary" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                New Report
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
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter reports by period and facility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period">Report Period</Label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facility">Facility</Label>
                  <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Facilities</SelectItem>
                      <SelectItem value="main">Main Processing Plant</SelectItem>
                      <SelectItem value="secondary">Secondary Facility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search">Search Reports</Label>
                  <Input placeholder="Search by report ID or type..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>USDA Reports</CardTitle>
              <CardDescription>Recent USDA compliance reports and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Inspector</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usdaReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.reportType}</TableCell>
                      <TableCell>{report.facility}</TableCell>
                      <TableCell>{report.period}</TableCell>
                      <TableCell>
                        <Badge variant={
                          report.status === 'Submitted' ? 'default' :
                          report.status === 'Pending Review' ? 'secondary' :
                          'success'
                        }>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.dueDate}</TableCell>
                      <TableCell>{report.inspector}</TableCell>
                      <TableCell>
                        <Badge variant={
                          report.compliance === 'Compliant' ? 'success' :
                          report.compliance === 'Under Review' ? 'secondary' :
                          'destructive'
                        }>
                          {report.compliance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliant</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">22</div>
                <p className="text-xs text-muted-foreground">91.7% compliance rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Due this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">All reports current</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Fragment>
  );
}

