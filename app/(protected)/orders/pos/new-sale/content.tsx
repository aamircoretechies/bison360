'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Camera, 
  Plus, 
  Minus, 
  X, 
  ShoppingCart, 
  CreditCard, 
  DollarSign, 
  Receipt, 
  Mail, 
  MessageSquare,
  Wifi,
  WifiOff,
  Tag,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'Meat' | 'Tools' | 'Merchandise';
  price: number;
  stock: number;
  image?: string;
  barcode?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: 'card' | 'ebt' | 'cash';
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Ground Bison (1lb)',
    sku: 'MT-001-23',
    category: 'Meat',
    price: 12.99,
    stock: 45,
    barcode: '1234567890123',
  },
  {
    id: '2',
    name: 'Bison Ribeye Steak (8oz)',
    sku: 'MT-002-23',
    category: 'Meat',
    price: 18.99,
    stock: 23,
    barcode: '1234567890124',
  },
  {
    id: '3',
    name: 'Bison Jerky (4oz)',
    sku: 'MT-003-23',
    category: 'Meat',
    price: 8.99,
    stock: 67,
    barcode: '1234567890125',
  },
  {
    id: '4',
    name: 'Butcher Knife Set',
    sku: 'TL-001-23',
    category: 'Tools',
    price: 89.99,
    stock: 12,
    barcode: '1234567890126',
  },
  {
    id: '5',
    name: 'Bison360 T-Shirt (L)',
    sku: 'MR-001-23',
    category: 'Merchandise',
    price: 24.99,
    stock: 34,
    barcode: '1234567890127',
  },
  {
    id: '6',
    name: 'Bison360 Hat',
    sku: 'MR-002-23',
    category: 'Merchandise',
    price: 19.99,
    stock: 28,
    barcode: '1234567890128',
  },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: <CreditCard className="h-5 w-5" />,
    type: 'card',
  },
  {
    id: 'ebt',
    name: 'EBT',
    icon: <DollarSign className="h-5 w-5" />,
    type: 'ebt',
  },
  {
    id: 'cash',
    name: 'Cash',
    icon: <DollarSign className="h-5 w-5" />,
    type: 'cash',
  },
];

export function NewSaleContent() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [couponCode, setCouponCode] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate totals
  const subtotal = useMemo(() => 
    cart.reduce((sum, item) => sum + item.subtotal, 0), [cart]
  );
  
  const tax = useMemo(() => subtotal * 0.08, [subtotal]); // 8% tax
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);
  const change = useMemo(() => amountReceived - total, [amountReceived, total]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = sampleProducts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.barcode?.includes(searchQuery)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Add item to cart
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.product.price }
            : item
        );
      } else {
        // Add new item
        return [...prev, { product, quantity: 1, subtotal: product.price }];
      }
    });
    
    toast.success(`${product.name} added to cart`);
  };

  // Update cart item quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.product.price }
          : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setCouponCode('');
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
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Product Selection - 2/3 width */}
      <div className="lg:col-span-2 space-y-6">
        {/* Search and Scan */}
        <Card>
          <CardHeader>
            <CardTitle>Product Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products by name, SKU, or scan barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={scanBarcode}>
                <Camera className="h-4 w-4 mr-2" />
                Scan
              </Button>
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Meat">Meat</TabsTrigger>
                <TabsTrigger value="Tools">Tools</TabsTrigger>
                <TabsTrigger value="Merchandise">Merchandise</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Offline Status */}
            {isOffline && (
              <Alert>
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  Working offline - transactions will sync when connection is restored
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Product Grid */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => addToCart(product)}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{product.name}</h3>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                                             <Badge variant="secondary" className="text-xs">
                         {product.category}
                       </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-bold">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>
                    
                    <Button size="sm" className="w-full">
                      <Plus className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products found matching your search.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cart and Payment - 1/3 width */}
      <div className="space-y-6">
        {/* Cart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart ({cart.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Cart is empty</p>
                <p className="text-sm">Add products to get started</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-xs text-gray-500">{item.product.sku}</p>
                        <p className="text-sm font-medium">${item.product.price.toFixed(2)} each</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Coupon */}
                <div className="space-y-2">
                  <Label htmlFor="coupon">Coupon Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setShowPaymentDialog(true)}
                    disabled={cart.length === 0}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Process Payment
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearCart}
                    disabled={cart.length === 0}
                  >
                    Clear Cart
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full">
              <DollarSign className="h-4 w-4 mr-2" />
              Manager Override
            </Button>
            <Button variant="outline" className="w-full">
              <Receipt className="h-4 w-4 mr-2" />
              Reprint Last Receipt
            </Button>
            <Button variant="outline" className="w-full">
              <AlertCircle className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Processing</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Payment Method Selection */}
            <div>
              <Label>Payment Method</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {paymentMethods.map((method) => (
                  <Button
                    key={method.id}
                    variant={selectedPaymentMethod === method.id ? "primary" : "outline"}
                    className="justify-start"
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    {method.icon}
                    <span className="ml-2">{method.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Cash Payment */}
            {selectedPaymentMethod === 'cash' && (
              <div>
                <Label htmlFor="amountReceived">Amount Received</Label>
                <Input
                  id="amountReceived"
                  type="number"
                  step="0.01"
                  min={total}
                  value={amountReceived || ''}
                  onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount received"
                />
                {amountReceived > 0 && (
                  <div className="mt-2 p-2 bg-gray-50 rounded">
                    <div className="flex justify-between">
                      <span>Change Due:</span>
                      <span className="font-bold">${change.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Total Display */}
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold">${total.toFixed(2)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowPaymentDialog(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={processPayment}
                disabled={!selectedPaymentMethod || isProcessing || (selectedPaymentMethod === 'cash' && amountReceived < total)}
              >
                {isProcessing ? 'Processing...' : 'Complete Payment'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Complete</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="font-medium">Payment Successful!</p>
              <p className="text-sm text-gray-600">Transaction ID: POS-{Date.now()}</p>
            </div>

            {/* Receipt Options */}
            <div className="space-y-2">
              <Button className="w-full">
                <Receipt className="h-4 w-4 mr-2" />
                Print Receipt
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Email Receipt
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS Receipt
              </Button>
            </div>

            <Button className="w-full" onClick={completeSale}>
              Complete Sale
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
