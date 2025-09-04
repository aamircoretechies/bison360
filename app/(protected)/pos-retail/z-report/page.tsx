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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Download, 
  Mail, 
  Calculator, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  CreditCard, 
  Receipt, 
  TrendingUp,
  TrendingDown,
  Clock,
  User,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface ZReportData {
  id: string;
  date: string;
  shiftStart: string;
  shiftEnd: string;
  cashier: string;
  totalSales: number;
  totalTransactions: number;
  averageTicket: number;
  cashSales: number;
  cardSales: number;
  ebtSales: number;
  squareSales: number;
  totalTax: number;
  totalDiscounts: number;
  expectedCash: number;
  actualCash: number;
  variance: number;
  status: 'completed' | 'pending' | 'discrepancy';
}

interface TransactionSummary {
  paymentMethod: string;
  count: number;
  amount: number;
  percentage: number;
}

export default function ZReportPage() {
  const { settings } = useSettings();
  const [selectedReport, setSelectedReport] = useState<ZReportData | null>(null);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState('admin@company.com');

  // Mock Z-Report data
  const zReports: ZReportData[] = [
    {
      id: 'ZR-001',
      date: '2024-01-15',
      shiftStart: '08:00 AM',
      shiftEnd: '05:00 PM',
      cashier: 'John Doe',
      totalSales: 3426.90,
      totalTransactions: 42,
      averageTicket: 81.59,
      cashSales: 1250.00,
      cardSales: 1800.50,
      ebtSales: 276.40,
      squareSales: 100.00,
      totalTax: 274.15,
      totalDiscounts: 45.00,
      expectedCash: 1250.00,
      actualCash: 1248.50,
      variance: -1.50,
      status: 'completed'
    },
    {
      id: 'ZR-002',
      date: '2024-01-14',
      shiftStart: '08:00 AM',
      shiftEnd: '05:00 PM',
      cashier: 'Jane Smith',
      totalSales: 2890.75,
      totalTransactions: 38,
      averageTicket: 76.07,
      cashSales: 1100.00,
      cardSales: 1500.25,
      ebtSales: 190.50,
      squareSales: 100.00,
      totalTax: 231.26,
      totalDiscounts: 30.00,
      expectedCash: 1100.00,
      actualCash: 1100.00,
      variance: 0.00,
      status: 'completed'
    },
    {
      id: 'ZR-003',
      date: '2024-01-13',
      shiftStart: '08:00 AM',
      shiftEnd: '05:00 PM',
      cashier: 'Mike Wilson',
      totalSales: 3156.40,
      totalTransactions: 45,
      averageTicket: 70.14,
      cashSales: 1200.00,
      cardSales: 1656.40,
      ebtSales: 200.00,
      squareSales: 100.00,
      totalTax: 252.51,
      totalDiscounts: 25.00,
      expectedCash: 1200.00,
      actualCash: 1195.00,
      variance: -5.00,
      status: 'discrepancy'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'discrepancy':
        return <Badge variant="destructive">Discrepancy</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getVarianceIcon = (variance: number) => {
    if (variance === 0) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (variance < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    } else {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    }
  };

  const generateZReport = async () => {
    try {
      // Simulate Z-report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Z-Report generated successfully!');
      setShowGenerateDialog(false);
      
      // In real implementation, this would:
      // 1. Calculate all sales data for the current shift
      // 2. Generate the report
      // 3. Email to admin/accountant
      // 4. Save to database
      
    } catch (error) {
      toast.error('Failed to generate Z-Report');
    }
  };

  const emailZReport = async (reportId: string) => {
    try {
      toast.success(`Z-Report ${reportId} sent to ${emailAddress}`);
    } catch (error) {
      toast.error('Failed to email Z-Report');
    }
  };

  const exportZReport = (format: 'pdf' | 'csv', reportId: string) => {
    toast.success(`Z-Report ${reportId} exported as ${format.toUpperCase()}`);
  };

  const getTransactionSummary = (report: ZReportData): TransactionSummary[] => {
    return [
      {
        paymentMethod: 'Cash',
        count: Math.floor(report.totalTransactions * 0.3),
        amount: report.cashSales,
        percentage: (report.cashSales / report.totalSales) * 100
      },
      {
        paymentMethod: 'Credit Card',
        count: Math.floor(report.totalTransactions * 0.4),
        amount: report.cardSales,
        percentage: (report.cardSales / report.totalSales) * 100
      },
      {
        paymentMethod: 'EBT',
        count: Math.floor(report.totalTransactions * 0.2),
        amount: report.ebtSales,
        percentage: (report.ebtSales / report.totalSales) * 100
      },
      {
        paymentMethod: 'Square',
        count: Math.floor(report.totalTransactions * 0.1),
        amount: report.squareSales,
        percentage: (report.squareSales / report.totalSales) * 100
      }
    ];
  };

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text="Z-Report" />
              <ToolbarDescription>
                End-of-shift sales reports and cash drawer reconciliation
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
                <DialogTrigger asChild>
                  <Button variant="primary">
                    <Calculator className="h-4 w-4 mr-2" />
                    Generate Z-Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Z-Report</DialogTitle>
                    <DialogDescription>
                      Generate end-of-shift report for current cashier
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Report To</Label>
                      <Input
                        id="email"
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="admin@company.com"
                      />
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">Important</span>
                      </div>
                      <p className="text-sm text-yellow-800 mt-1">
                        This will close the current shift and generate a final sales report. 
                        Make sure all transactions are complete before proceeding.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={generateZReport}>
                      Generate Report
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <div className="space-y-6">
          {/* Z-Reports List */}
          <Card>
            <CardHeader>
              <CardTitle>Z-Reports History</CardTitle>
              <CardDescription>End-of-shift sales reports and cash reconciliation</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Cashier</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Cash Variance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{report.shiftStart}</div>
                          <div className="text-muted-foreground">to {report.shiftEnd}</div>
                        </div>
                      </TableCell>
                      <TableCell>{report.cashier}</TableCell>
                      <TableCell className="font-medium">${report.totalSales.toFixed(2)}</TableCell>
                      <TableCell>{report.totalTransactions}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getVarianceIcon(report.variance)}
                          <span className={report.variance === 0 ? 'text-green-600' : 'text-red-600'}>
                            ${Math.abs(report.variance).toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                          >
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => emailZReport(report.id)}
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => exportZReport('pdf', report.id)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Detailed Report View */}
          {selectedReport && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Z-Report Details: {selectedReport.id}</span>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => emailZReport(selectedReport.id)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => exportZReport('pdf', selectedReport.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  {selectedReport.date} • {selectedReport.shiftStart} - {selectedReport.shiftEnd} • {selectedReport.cashier}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Sales Summary */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Sales Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Sales:</span>
                        <span className="font-medium">${selectedReport.totalSales.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Transactions:</span>
                        <span className="font-medium">{selectedReport.totalTransactions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Average Ticket:</span>
                        <span className="font-medium">${selectedReport.averageTicket.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Tax:</span>
                        <span className="font-medium">${selectedReport.totalTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Discounts:</span>
                        <span className="font-medium">${selectedReport.totalDiscounts.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Payment Methods</h4>
                    <div className="space-y-2">
                      {getTransactionSummary(selectedReport).map((method) => (
                        <div key={method.paymentMethod} className="flex justify-between">
                          <span className="text-sm">{method.paymentMethod}:</span>
                          <div className="text-right">
                            <div className="font-medium">${method.amount.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">
                              {method.count} transactions ({method.percentage.toFixed(1)}%)
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cash Reconciliation */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Cash Reconciliation</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Expected Cash:</span>
                        <span className="font-medium">${selectedReport.expectedCash.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Actual Cash:</span>
                        <span className="font-medium">${selectedReport.actualCash.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Variance:</span>
                        <div className="flex items-center space-x-1">
                          {getVarianceIcon(selectedReport.variance)}
                          <span className={`font-medium ${
                            selectedReport.variance === 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${Math.abs(selectedReport.variance).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedReport.variance !== 0 && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">Cash Variance Detected</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          {selectedReport.variance < 0 ? 'Short' : 'Over'} by ${Math.abs(selectedReport.variance).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Shift Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Shift Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Cashier:</span>
                        <span className="font-medium">{selectedReport.cashier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Date:</span>
                        <span className="font-medium">{selectedReport.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Start Time:</span>
                        <span className="font-medium">{selectedReport.shiftStart}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">End Time:</span>
                        <span className="font-medium">{selectedReport.shiftEnd}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Status:</span>
                        {getStatusBadge(selectedReport.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </Fragment>
  );
}
