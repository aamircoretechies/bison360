'use client';

import { Fragment, useState, useEffect } from 'react';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  ShoppingCart, 
  CreditCard, 
  DollarSign, 
  Receipt, 
  QrCode, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Calculator,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  X,
  Printer,
  Mail,
  MessageSquare,
  User,
  Clock,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  stock: number;
  category: string;
}

interface PaymentMethod {
  type: 'cash' | 'card' | 'ebt' | 'square';
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export default function POSTerminalPage() {
  const { settings } = useSettings();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Mock products data
  const products: CartItem[] = [
    {
      id: '1',
      name: 'Ground Bison (1lb)',
      sku: 'GB-001',
      price: 12.99,
      quantity: 0,
      stock: 25,
      category: 'Meat'
    },
    {
      id: '2',
      name: 'Bison Ribeye Steak',
      sku: 'BR-002',
      price: 24.99,
      quantity: 0,
      stock: 15,
      category: 'Meat'
    },
    {
      id: '3',
      name: 'Bison Jerky',
      sku: 'BJ-003',
      price: 8.99,
      quantity: 0,
      stock: 50,
      category: 'Snacks'
    },
    {
      id: '4',
      name: 'Organic Vegetables',
      sku: 'OV-004',
      price: 6.99,
      quantity: 0,
      stock: 30,
      category: 'Produce'
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      type: 'cash',
      label: 'Cash',
      icon: <DollarSign className="h-4 w-4" />,
      enabled: true
    },
    {
      type: 'card',
      label: 'Credit Card',
      icon: <CreditCard className="h-4 w-4" />,
      enabled: true
    },
    {
      type: 'square',
      label: 'Square (Tap to Pay)',
      icon: <CreditCard className="h-4 w-4" />,
      enabled: true
    },
    {
      type: 'ebt',
      label: 'EBT Card',
      icon: <CreditCard className="h-4 w-4" />,
      enabled: true
    }
  ];

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = discountType === 'percentage' 
    ? (subtotal * discountAmount) / 100 
    : discountAmount;
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal - discount + tax;
  const change = amountReceived - total;

  // Check online status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOffline(!navigator.onLine);
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Add item to cart
  const addToCart = (product: CartItem) => {
    if (product.stock <= 0) {
      toast.error('Product out of stock');
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          toast.error('Not enough stock available');
          return prev;
        }
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setDiscountAmount(0);
    setAmountReceived(0);
    setSelectedPaymentMethod('');
  };

  // Process payment
  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (selectedPaymentMethod === 'cash' && amountReceived < total) {
      toast.error('Amount received must be greater than or equal to total');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate offline sync if needed
      if (isOffline) {
        toast.info('Transaction saved offline - will sync when connection restored');
      }
      
      setShowPaymentDialog(false);
      setShowReceiptDialog(true);
      
      toast.success('Payment processed successfully!');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Complete sale
  const completeSale = () => {
    // Save to backend, update inventory, etc.
    toast.success('Sale completed!');
    clearCart();
    setShowReceiptDialog(false);
  };

  // Scan barcode
  const scanBarcode = () => {
    toast.info('Barcode scanner activated - scan a product');
    // In real implementation, this would activate camera/scanner
  };

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text="POS Terminal" />
              <ToolbarDescription>
                Point of Sale system for in-store transactions
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <div className="flex items-center space-x-2">
                {isOffline ? (
                  <Badge variant="destructive" className="flex items-center space-x-1">
                    <WifiOff className="h-3 w-3" />
                    <span>Offline</span>
                  </Badge>
                ) : (
                  <Badge variant="success" className="flex items-center space-x-1">
                    <Wifi className="h-3 w-3" />
                    <span>Online</span>
                  </Badge>
                )}
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Cashier: John Doe
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Shift: 8:00 AM - 5:00 PM
                </Button>
              </div>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Product Selection */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Barcode */}
            <Card>
              <CardHeader>
                <CardTitle>Product Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Search products by name or SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button onClick={scanBarcode} variant="outline">
                    <QrCode className="h-4 w-4 mr-2" />
                    Scan
                  </Button>
                </div>
                
                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {products
                    .filter(product => 
                      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((product) => (
                      <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{product.name}</h4>
                                <p className="text-xs text-muted-foreground">{product.sku}</p>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-bold">${product.price}</span>
                              <div className="flex items-center space-x-1">
                                <Package className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {product.stock} in stock
                                </span>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              className="w-full"
                              onClick={() => addToCart(product)}
                              disabled={product.stock <= 0}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add to Cart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart and Checkout */}
          <div className="space-y-4">
            {/* Cart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart ({cart.length})
                  </span>
                  {cart.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearCart}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Cart is empty</p>
                    <p className="text-sm">Add products to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.sku}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium ml-2">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Totals */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {/* Discount */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Discount"
                      value={discountAmount || ''}
                      onChange={(e) => setDiscountAmount(Number(e.target.value))}
                      className="w-20"
                    />
                    <Select value={discountType} onValueChange={(value: any) => setDiscountType(value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">%</SelectItem>
                        <SelectItem value="fixed">$</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <span>Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowPaymentDialog(true)}
                  disabled={cart.length === 0}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Process Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Process Payment</DialogTitle>
              <DialogDescription>
                Total Amount: ${total.toFixed(2)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Payment Methods */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((method) => (
                    <Button
                      key={method.type}
                      variant={selectedPaymentMethod === method.type ? 'default' : 'outline'}
                      onClick={() => setSelectedPaymentMethod(method.type)}
                      className="flex items-center space-x-2"
                    >
                      {method.icon}
                      <span>{method.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Cash Payment */}
              {selectedPaymentMethod === 'cash' && (
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount Received</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amountReceived || ''}
                    onChange={(e) => setAmountReceived(Number(e.target.value))}
                    placeholder="0.00"
                  />
                  {amountReceived > 0 && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Change:</p>
                      <p className="text-lg font-bold text-green-600">
                        ${change.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Customer Info */}
              <div className="space-y-2">
                <Label>Customer Information (Optional)</Label>
                <Input
                  placeholder="Customer name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Email for receipt"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                />
                <Input
                  placeholder="Phone number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={processPayment}
                disabled={!selectedPaymentMethod || (selectedPaymentMethod === 'cash' && amountReceived < total) || isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Process Payment'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Receipt Dialog */}
        <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Payment Successful
              </DialogTitle>
              <DialogDescription>
                Transaction completed successfully
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Receipt Options</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Receipt
                  </Button>
                  {customerInfo.email && (
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Receipt
                    </Button>
                  )}
                  {customerInfo.phone && (
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      SMS Receipt
                    </Button>
                  )}
                </div>
              </div>

              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono">TXN-{Date.now()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{paymentMethods.find(m => m.type === selectedPaymentMethod)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={completeSale} className="w-full">
                Complete Sale
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Container>
    </Fragment>
  );
}
