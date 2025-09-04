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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  RotateCcw, 
  X, 
  Search, 
  Filter, 
  Receipt, 
  CreditCard, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Package,
  FileText,
  Mail,
  MessageSquare,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface RefundRequest {
  id: string;
  originalTransactionId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  originalAmount: number;
  refundAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedBy: string;
  requestedAt: string;
  processedBy?: string;
  processedAt?: string;
  items: RefundItem[];
  paymentMethod: 'cash' | 'card' | 'ebt' | 'square';
}

interface RefundItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  reason: string;
}

interface CancellationRequest {
  id: string;
  orderId: string;
  customerName: string;
  orderAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedBy: string;
  requestedAt: string;
  processedBy?: string;
  processedAt?: string;
}

export default function RefundsCancellationsPage() {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [selectedCancellation, setSelectedCancellation] = useState<CancellationRequest | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Mock refund requests data
  const refundRequests: RefundRequest[] = [
    {
      id: 'REF-001',
      originalTransactionId: 'TXN-2024-001',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      customerPhone: '+1-555-123-4567',
      originalAmount: 89.99,
      refundAmount: 89.99,
      reason: 'Product was damaged upon delivery',
      status: 'pending',
      requestedBy: 'Customer',
      requestedAt: '2024-01-15 14:30:00',
      items: [
        {
          id: '1',
          name: 'Ground Bison (1lb)',
          sku: 'GB-001',
          quantity: 1,
          price: 12.99,
          reason: 'Damaged packaging'
        },
        {
          id: '2',
          name: 'Bison Jerky',
          sku: 'BJ-003',
          quantity: 2,
          price: 8.99,
          reason: 'Wrong flavor'
        }
      ],
      paymentMethod: 'card'
    },
    {
      id: 'REF-002',
      originalTransactionId: 'TXN-2024-002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      originalAmount: 156.50,
      refundAmount: 45.00,
      reason: 'Partial refund for returned items',
      status: 'approved',
      requestedBy: 'Store Manager',
      requestedAt: '2024-01-15 10:15:00',
      processedBy: 'Jane Doe',
      processedAt: '2024-01-15 10:30:00',
      items: [
        {
          id: '3',
          name: 'Bison Ribeye Steak',
          sku: 'BR-002',
          quantity: 1,
          price: 24.99,
          reason: 'Customer not satisfied'
        }
      ],
      paymentMethod: 'square'
    },
    {
      id: 'REF-003',
      originalTransactionId: 'TXN-2024-003',
      customerName: 'Mike Wilson',
      originalAmount: 234.75,
      refundAmount: 234.75,
      reason: 'Order was never delivered',
      status: 'completed',
      requestedBy: 'Customer',
      requestedAt: '2024-01-14 16:20:00',
      processedBy: 'John Doe',
      processedAt: '2024-01-14 16:45:00',
      items: [
        {
          id: '4',
          name: 'Organic Vegetables Mix',
          sku: 'OV-004',
          quantity: 3,
          price: 6.99,
          reason: 'Delivery failure'
        }
      ],
      paymentMethod: 'cash'
    }
  ];

  // Mock cancellation requests data
  const cancellationRequests: CancellationRequest[] = [
    {
      id: 'CAN-001',
      orderId: 'ORD-2024-001',
      customerName: 'Lisa Brown',
      orderAmount: 67.25,
      reason: 'Customer changed mind',
      status: 'pending',
      requestedBy: 'Customer',
      requestedAt: '2024-01-15 13:45:00'
    },
    {
      id: 'CAN-002',
      orderId: 'ORD-2024-002',
      customerName: 'David Lee',
      orderAmount: 189.99,
      reason: 'Out of stock items',
      status: 'approved',
      requestedBy: 'Store Staff',
      requestedAt: '2024-01-15 11:20:00',
      processedBy: 'Jane Doe',
      processedAt: '2024-01-15 11:35:00'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'square':
        return <CreditCard className="h-4 w-4" />;
      case 'ebt':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const processRefund = async (refundId: string, action: 'approve' | 'reject') => {
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'approve') {
        toast.success(`Refund ${refundId} approved and processed`);
      } else {
        toast.success(`Refund ${refundId} rejected`);
      }
      
      setShowRefundDialog(false);
    } catch (error) {
      toast.error('Failed to process refund');
    }
  };

  const processCancellation = async (cancellationId: string, action: 'approve' | 'reject') => {
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'approve') {
        toast.success(`Cancellation ${cancellationId} approved and processed`);
      } else {
        toast.success(`Cancellation ${cancellationId} rejected`);
      }
      
      setShowCancellationDialog(false);
    } catch (error) {
      toast.error('Failed to process cancellation');
    }
  };

  const filteredRefunds = refundRequests.filter(refund => {
    const matchesSearch = refund.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         refund.originalTransactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || refund.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredCancellations = cancellationRequests.filter(cancellation => {
    const matchesSearch = cancellation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cancellation.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || cancellation.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text="Refunds & Cancellations" />
              <ToolbarDescription>
                Process refunds and handle order cancellations
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
              <Button variant="primary" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                New Refund
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
              <CardTitle>Filter Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by customer name or transaction ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="refunds">Refunds</SelectItem>
                      <SelectItem value="cancellations">Cancellations</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="refunds" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="refunds">Refunds ({filteredRefunds.length})</TabsTrigger>
              <TabsTrigger value="cancellations">Cancellations ({filteredCancellations.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="refunds" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Refund Requests</CardTitle>
                  <CardDescription>Process customer refund requests</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Refund ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Original Transaction</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRefunds.map((refund) => (
                        <TableRow key={refund.id}>
                          <TableCell className="font-medium">{refund.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{refund.customerName}</div>
                              {refund.customerEmail && (
                                <div className="text-sm text-muted-foreground">{refund.customerEmail}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{refund.originalTransactionId}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">${refund.refundAmount.toFixed(2)}</div>
                              {refund.refundAmount !== refund.originalAmount && (
                                <div className="text-sm text-muted-foreground">
                                  of ${refund.originalAmount.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getPaymentMethodIcon(refund.paymentMethod)}
                              <span className="capitalize">{refund.paymentMethod}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(refund.status)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(refund.requestedAt).toLocaleDateString()}</div>
                              <div className="text-muted-foreground">
                                {new Date(refund.requestedAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedRefund(refund);
                                  setShowRefundDialog(true);
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              {refund.status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => processRefund(refund.id, 'approve')}
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => processRefund(refund.id, 'reject')}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
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

            <TabsContent value="cancellations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cancellation Requests</CardTitle>
                  <CardDescription>Process order cancellation requests</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cancellation ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCancellations.map((cancellation) => (
                        <TableRow key={cancellation.id}>
                          <TableCell className="font-medium">{cancellation.id}</TableCell>
                          <TableCell className="font-medium">{cancellation.customerName}</TableCell>
                          <TableCell className="font-mono text-sm">{cancellation.orderId}</TableCell>
                          <TableCell className="font-medium">${cancellation.orderAmount.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(cancellation.status)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(cancellation.requestedAt).toLocaleDateString()}</div>
                              <div className="text-muted-foreground">
                                {new Date(cancellation.requestedAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedCancellation(cancellation);
                                  setShowCancellationDialog(true);
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              {cancellation.status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => processCancellation(cancellation.id, 'approve')}
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => processCancellation(cancellation.id, 'reject')}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
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
          </Tabs>

          {/* Refund Details Dialog */}
          <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Refund Details: {selectedRefund?.id}</DialogTitle>
                <DialogDescription>
                  Review refund request and process accordingly
                </DialogDescription>
              </DialogHeader>
              {selectedRefund && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Customer</Label>
                      <p className="font-medium">{selectedRefund.customerName}</p>
                      {selectedRefund.customerEmail && (
                        <p className="text-sm text-muted-foreground">{selectedRefund.customerEmail}</p>
                      )}
                    </div>
                    <div>
                      <Label>Original Transaction</Label>
                      <p className="font-mono text-sm">{selectedRefund.originalTransactionId}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Refund Reason</Label>
                    <p className="text-sm text-muted-foreground">{selectedRefund.reason}</p>
                  </div>

                  <div>
                    <Label>Items to Refund</Label>
                    <div className="space-y-2">
                      {selectedRefund.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedItems(prev => [...prev, item.id]);
                                } else {
                                  setSelectedItems(prev => prev.filter(id => id !== item.id));
                                }
                              }}
                            />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.sku} • Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{item.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Original Amount</Label>
                      <p className="font-medium">${selectedRefund.originalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <Label>Refund Amount</Label>
                      <p className="font-medium text-green-600">${selectedRefund.refundAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <Label>Payment Method</Label>
                    <div className="flex items-center space-x-2">
                      {getPaymentMethodIcon(selectedRefund.paymentMethod)}
                      <span className="capitalize">{selectedRefund.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
                  Close
                </Button>
                {selectedRefund?.status === 'pending' && (
                  <>
                    <Button variant="outline" onClick={() => processRefund(selectedRefund.id, 'reject')}>
                      Reject
                    </Button>
                    <Button onClick={() => processRefund(selectedRefund.id, 'approve')}>
                      Approve & Process
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Cancellation Details Dialog */}
          <Dialog open={showCancellationDialog} onOpenChange={setShowCancellationDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancellation Details: {selectedCancellation?.id}</DialogTitle>
                <DialogDescription>
                  Review cancellation request and process accordingly
                </DialogDescription>
              </DialogHeader>
              {selectedCancellation && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Customer</Label>
                      <p className="font-medium">{selectedCancellation.customerName}</p>
                    </div>
                    <div>
                      <Label>Order ID</Label>
                      <p className="font-mono text-sm">{selectedCancellation.orderId}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Order Amount</Label>
                    <p className="font-medium">${selectedCancellation.orderAmount.toFixed(2)}</p>
                  </div>

                  <div>
                    <Label>Cancellation Reason</Label>
                    <p className="text-sm text-muted-foreground">{selectedCancellation.reason}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Requested By</Label>
                      <p className="font-medium">{selectedCancellation.requestedBy}</p>
                    </div>
                    <div>
                      <Label>Requested At</Label>
                      <p className="font-medium">{new Date(selectedCancellation.requestedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCancellationDialog(false)}>
                  Close
                </Button>
                {selectedCancellation?.status === 'pending' && (
                  <>
                    <Button variant="outline" onClick={() => processCancellation(selectedCancellation.id, 'reject')}>
                      Reject
                    </Button>
                    <Button onClick={() => processCancellation(selectedCancellation.id, 'approve')}>
                      Approve & Process
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    </Fragment>
  );
}
