'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Package, Truck, CheckCircle, Clock, User, MapPin, Phone, CreditCard, Calendar, FileText, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OrderItem {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  unitWeight: number;
  packingInstructions: string;
  status: 'Pending' | 'Picked' | 'Packed';
}

interface OrderDetail {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: 'CC' | 'EBT' | 'Cash';
  orderStatus: 'Pending' | 'Picked' | 'Packed' | 'Shipped' | 'Delivered';
  orderDate: string;
  assignedStaff: string;
  trackingNumber?: string;
  totalAmount: number;
  items: OrderItem[];
  notes: string;
}

// Sample order data
const sampleOrder: OrderDetail = {
  orderId: 'ORD-2024-001',
  customerName: 'John Smith',
  customerPhone: '(555) 123-4567',
  customerEmail: 'john.smith@email.com',
  shippingAddress: '123 Main St, Anytown, ST 12345',
  paymentMethod: 'CC',
  orderStatus: 'Picked',
  orderDate: '2024-01-15T10:30:00Z',
  assignedStaff: 'Sarah Johnson',
  totalAmount: 89.99,
  items: [
    {
      id: '1',
      sku: 'MT-001-23',
      productName: 'Ground Bison (1lb)',
      quantity: 2,
      unitWeight: 1.0,
      packingInstructions: 'Pack with dry ice, keep frozen',
      status: 'Picked',
    },
    {
      id: '2',
      sku: 'MT-002-23',
      productName: 'Bison Ribeye Steak (8oz)',
      quantity: 1,
      unitWeight: 0.5,
      packingInstructions: 'Pack with dry ice, keep frozen',
      status: 'Picked',
    },
    {
      id: '3',
      sku: 'MT-003-23',
      productName: 'Bison Jerky (4oz)',
      quantity: 3,
      unitWeight: 0.25,
      packingInstructions: 'Room temperature storage',
      status: 'Pending',
    },
  ],
  notes: 'Customer requested delivery before 2 PM. Handle with care - fragile items.',
};

const statusSteps = [
  { key: 'Pending', label: 'Pending', icon: Clock },
  { key: 'Picked', label: 'Picked', icon: Package },
  { key: 'Packed', label: 'Packed', icon: CheckCircle },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: CheckCircle },
];

export function OrderDetailContent({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderDetail>(sampleOrder);
  const [notes, setNotes] = useState(order.notes);
  const [packingChecklist, setPackingChecklist] = useState<Record<string, boolean>>({});
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const getStatusProgress = () => {
    const currentIndex = statusSteps.findIndex(step => step.key === order.orderStatus);
    return ((currentIndex + 1) / statusSteps.length) * 100;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Picked':
        return 'info';
      case 'Packed':
        return 'secondary';
      case 'Shipped':
        return 'success';
      case 'Delivered':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getItemStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Picked':
        return 'info';
      case 'Packed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const handleStatusUpdate = async (newStatus: OrderDetail['orderStatus']) => {
    setIsUpdatingStatus(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrder(prev => ({ ...prev, orderStatus: newStatus }));
      
      toast.custom(
        (t) => (
          <Alert
            variant="mono"
            icon="success"
            close={false}
            onClose={() => toast.dismiss(t)}
          >
            <RiCheckboxCircleFill />
            <AlertDescription>
              Order status updated to {newStatus}!
            </AlertDescription>
          </Alert>
        ),
        {
          position: 'top-center',
        }
      );
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleGenerateLabel = () => {
    toast.success('Shipping label generated successfully!');
  };

  const handlePrintOrder = () => {
    toast.success('Order printed successfully!');
  };

  const handleSaveNotes = () => {
    setOrder(prev => ({ ...prev, notes }));
    toast.success('Notes saved successfully!');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content - 2/3 width */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Progress value={getStatusProgress()} className="flex-1" />
              <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
                {order.orderStatus}
              </Badge>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = statusSteps.findIndex(s => s.key === order.orderStatus) >= index;
                const isCurrent = step.key === order.orderStatus;
                
                return (
                  <div key={step.key} className="flex flex-col items-center gap-1">
                    <div className={`p-2 rounded-full ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={`text-xs ${isCurrent ? 'font-medium text-foreground' : ''}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{item.productName}</h4>
                        <Badge variant={getItemStatusBadgeVariant(item.status)} size="sm">
                          {item.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>SKU: {item.sku}</div>
                        <div>Quantity: {item.quantity}</div>
                        <div>Unit Weight: {item.unitWeight} lbs</div>
                        <div>Total Weight: {(item.quantity * item.unitWeight).toFixed(2)} lbs</div>
                      </div>
                      <div className="mt-2">
                        <Label className="text-sm font-medium">Packing Instructions:</Label>
                        <p className="text-sm text-muted-foreground">{item.packingInstructions}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline">
                        Mark as Picked
                      </Button>
                      <Button size="sm" variant="outline">
                        Mark as Packed
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Packing Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Packing Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`pack-${item.id}`}
                    checked={packingChecklist[item.id] || false}
                    onCheckedChange={(checked) => 
                      setPackingChecklist(prev => ({ ...prev, [item.id]: checked === true }))
                    }
                  />
                  <Label htmlFor={`pack-${item.id}`} className="flex-1">
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-muted-foreground">{item.packingInstructions}</div>
                  </Label>
                </div>
              ))}
              <Separator />
              <div className="flex items-center gap-3">
                <Checkbox
                  id="pack-dry-ice"
                  checked={packingChecklist['dry-ice'] || false}
                  onCheckedChange={(checked) => 
                    setPackingChecklist(prev => ({ ...prev, 'dry-ice': checked === true }))
                  }
                />
                <Label htmlFor="pack-dry-ice">Add dry ice for frozen items</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="pack-insulation"
                  checked={packingChecklist['insulation'] || false}
                  onCheckedChange={(checked) => 
                    setPackingChecklist(prev => ({ ...prev, 'insulation': checked === true }))
                  }
                />
                <Label htmlFor="pack-insulation">Wrap with insulation</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="pack-label"
                  checked={packingChecklist['label'] || false}
                  onCheckedChange={(checked) => 
                    setPackingChecklist(prev => ({ ...prev, 'label': checked === true }))
                  }
                />
                <Label htmlFor="pack-label">Attach shipping label</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - 1/3 width */}
      <div className="space-y-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <p className="text-sm">{order.customerName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Phone</Label>
              <p className="text-sm flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {order.customerPhone}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm">{order.customerEmail}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Shipping Address</Label>
              <p className="text-sm flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                {order.shippingAddress}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Order ID</Label>
              <p className="text-sm font-mono">{order.orderId}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Order Date</Label>
              <p className="text-sm">
                {new Date(order.orderDate).toLocaleDateString()} at{' '}
                {new Date(order.orderDate).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Payment Method</Label>
              <p className="text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {order.paymentMethod === 'CC' ? 'Credit Card' : order.paymentMethod}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Total Amount</Label>
              <p className="text-lg font-semibold">${order.totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Assigned Staff</Label>
              <p className="text-sm">{order.assignedStaff}</p>
            </div>
            {order.trackingNumber && (
              <div>
                <Label className="text-sm font-medium">Tracking Number</Label>
                <p className="text-sm font-mono">{order.trackingNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handlePrintOrder}
            >
              <FileText className="h-4 w-4 mr-2" />
              Print Order
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleGenerateLabel}
            >
              <Printer className="h-4 w-4 mr-2" />
              Generate Shipping Label
            </Button>
            <Separator />
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleStatusUpdate('Picked')}
              disabled={isUpdatingStatus || order.orderStatus === 'Picked'}
            >
              <Package className="h-4 w-4 mr-2" />
              Mark as Picked
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleStatusUpdate('Packed')}
              disabled={isUpdatingStatus || order.orderStatus === 'Packed'}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Packed
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleStatusUpdate('Shipped')}
              disabled={isUpdatingStatus || order.orderStatus === 'Shipped'}
            >
              <Truck className="h-4 w-4 mr-2" />
              Mark as Shipped
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleStatusUpdate('Delivered')}
              disabled={isUpdatingStatus || order.orderStatus === 'Delivered'}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Delivered
            </Button>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Add notes about this order..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleSaveNotes}
            >
              Save Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
