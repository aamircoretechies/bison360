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
import { Download, FileText, BarChart3, TrendingUp, TrendingDown, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

export default function MeatMovementShrinkagePage() {
  const { settings } = useSettings();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for meat movement and shrinkage
  const meatMovementData = [
    {
      id: 'MM-001',
      product: 'Ground Beef 80/20',
      category: 'Ground Meat',
      startingWeight: 1000,
      endingWeight: 950,
      shrinkage: 50,
      shrinkagePercent: 5.0,
      movement: 'Processing',
      date: '2024-01-15',
      facility: 'Main Plant',
      status: 'Completed'
    },
    {
      id: 'MM-002',
      product: 'Pork Chops',
      category: 'Pork Cuts',
      startingWeight: 800,
      endingWeight: 720,
      shrinkage: 80,
      shrinkagePercent: 10.0,
      movement: 'Packaging',
      date: '2024-01-14',
      facility: 'Secondary Facility',
      status: 'In Progress'
    },
    {
      id: 'MM-003',
      product: 'Lamb Shoulder',
      category: 'Lamb Cuts',
      startingWeight: 600,
      endingWeight: 570,
      shrinkage: 30,
      shrinkagePercent: 5.0,
      movement: 'Storage Transfer',
      date: '2024-01-13',
      facility: 'Main Plant',
      status: 'Completed'
    }
  ];

  const shrinkageTrends = [
    { month: 'Jan', ground: 4.2, pork: 8.1, lamb: 3.8, beef: 2.9 },
    { month: 'Feb', ground: 4.8, pork: 7.9, lamb: 4.1, beef: 3.2 },
    { month: 'Mar', ground: 5.1, pork: 8.5, lamb: 4.5, beef: 3.5 },
    { month: 'Apr', ground: 4.9, pork: 8.2, lamb: 4.2, beef: 3.1 }
  ];

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle>Meat Movement & Shrinkage</ToolbarPageTitle>
              <ToolbarDescription>
                Track meat inventory movement and monitor shrinkage rates across facilities
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="primary" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                New Entry
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
              <CardDescription>Filter data by period, category, and facility</CardDescription>
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Meat Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="ground">Ground Meat</SelectItem>
                      <SelectItem value="pork">Pork Cuts</SelectItem>
                      <SelectItem value="lamb">Lamb Cuts</SelectItem>
                      <SelectItem value="beef">Beef Cuts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facility">Facility</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Facilities</SelectItem>
                      <SelectItem value="main">Main Plant</SelectItem>
                      <SelectItem value="secondary">Secondary Facility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search">Search Products</Label>
                  <Input placeholder="Search by product name..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Movement</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,400 lbs</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Shrinkage</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">160 lbs</div>
                <p className="text-xs text-muted-foreground">6.7% average rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">93.3%</div>
                <p className="text-xs text-muted-foreground">+2.1% improvement</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">High shrinkage items</p>
              </CardContent>
            </Card>
          </div>

          {/* Shrinkage Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Shrinkage Trends by Category</CardTitle>
              <CardDescription>Monthly shrinkage percentage trends for different meat categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shrinkageTrends.map((trend) => (
                  <div key={trend.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{trend.month}</span>
                      <div className="flex space-x-4 text-xs text-muted-foreground">
                        <span>Ground: {trend.ground}%</span>
                        <span>Pork: {trend.pork}%</span>
                        <span>Lamb: {trend.lamb}%</span>
                        <span>Beef: {trend.beef}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <Progress value={trend.ground * 10} className="h-2" />
                      <Progress value={trend.pork * 10} className="h-2" />
                      <Progress value={trend.lamb * 10} className="h-2" />
                      <Progress value={trend.beef * 10} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Movement Table */}
          <Card>
            <CardHeader>
              <CardTitle>Meat Movement & Shrinkage Details</CardTitle>
              <CardDescription>Detailed tracking of meat movement and shrinkage calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Starting Weight (lbs)</TableHead>
                    <TableHead>Ending Weight (lbs)</TableHead>
                    <TableHead>Shrinkage (lbs)</TableHead>
                    <TableHead>Shrinkage %</TableHead>
                    <TableHead>Movement Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meatMovementData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.startingWeight.toLocaleString()}</TableCell>
                      <TableCell>{item.endingWeight.toLocaleString()}</TableCell>
                      <TableCell className="text-red-600 font-medium">{item.shrinkage.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          item.shrinkagePercent <= 5 ? 'success' :
                          item.shrinkagePercent <= 10 ? 'secondary' :
                          'destructive'
                        }>
                          {item.shrinkagePercent}%
                        </Badge>
                      </TableCell>
                      <TableCell>{item.movement}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Badge variant={
                          item.status === 'Completed' ? 'success' :
                          item.status === 'In Progress' ? 'secondary' :
                          'default'
                        }>
                          {item.status}
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
        </div>
      </Container>
    </Fragment>
  );
}

