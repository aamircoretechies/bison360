'use client';

import { Fragment, useState, useMemo } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingCart, 
  DollarSign, 
  Calendar,
  Star,
  TrendingUp,
  UserPlus,
  CreditCard,
  Package,
  Receipt
} from 'lucide-react';
import { toast } from 'sonner';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  memberSince: string;
  loyaltyPoints: number;
  status: 'active' | 'inactive' | 'vip';
  notes?: string;
  paymentMethods: string[];
  tags: string[];
}

interface CustomerOrder {
  id: string;
  date: string;
  amount: number;
  items: number;
  status: 'completed' | 'pending' | 'cancelled';
  paymentMethod: string;
}

export default function CustomerManagementPage() {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    notes: ''
  });

  // Mock customers data
  const customers: Customer[] = [
    {
      id: 'CUST-001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-123-4567',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701'
      },
      totalOrders: 15,
      totalSpent: 1247.50,
      averageOrderValue: 83.17,
      lastOrderDate: '2024-01-15',
      memberSince: '2023-06-15',
      loyaltyPoints: 1250,
      status: 'active',
      notes: 'Prefers ground bison, regular customer',
      paymentMethods: ['Credit Card', 'Cash'],
      tags: ['regular', 'premium']
    },
    {
      id: 'CUST-002',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1-555-234-5678',
      address: {
        street: '456 Oak Ave',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62702'
      },
      totalOrders: 8,
      totalSpent: 567.25,
      averageOrderValue: 70.91,
      lastOrderDate: '2024-01-14',
      memberSince: '2023-09-20',
      loyaltyPoints: 567,
      status: 'active',
      notes: 'Vegetarian options preferred',
      paymentMethods: ['Square', 'EBT'],
      tags: ['vegetarian']
    },
    {
      id: 'CUST-003',
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      phone: '+1-555-345-6789',
      totalOrders: 3,
      totalSpent: 189.99,
      averageOrderValue: 63.33,
      lastOrderDate: '2024-01-10',
      memberSince: '2024-01-01',
      loyaltyPoints: 190,
      status: 'active',
      paymentMethods: ['Credit Card'],
      tags: ['new']
    },
    {
      id: 'CUST-004',
      name: 'Lisa Brown',
      email: 'lisa.brown@email.com',
      phone: '+1-555-456-7890',
      address: {
        street: '789 Pine St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62703'
      },
      totalOrders: 25,
      totalSpent: 2156.75,
      averageOrderValue: 86.27,
      lastOrderDate: '2024-01-12',
      memberSince: '2023-03-10',
      loyaltyPoints: 2157,
      status: 'vip',
      notes: 'VIP customer, bulk orders, corporate account',
      paymentMethods: ['Credit Card', 'Corporate Account'],
      tags: ['vip', 'corporate', 'bulk']
    },
    {
      id: 'CUST-005',
      name: 'David Lee',
      email: 'david.lee@email.com',
      phone: '+1-555-567-8901',
      totalOrders: 1,
      totalSpent: 45.99,
      averageOrderValue: 45.99,
      lastOrderDate: '2023-12-20',
      memberSince: '2023-12-20',
      loyaltyPoints: 46,
      status: 'inactive',
      paymentMethods: ['Cash'],
      tags: ['inactive']
    }
  ];

  // Mock customer orders data
  const customerOrders: CustomerOrder[] = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      amount: 89.99,
      items: 3,
      status: 'completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      amount: 156.50,
      items: 5,
      status: 'completed',
      paymentMethod: 'Square'
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      amount: 67.25,
      items: 2,
      status: 'completed',
      paymentMethod: 'Cash'
    }
  ];

  // Filter customers
  const filteredCustomers = useMemo(() => {
    let filtered = customers;

    if (searchQuery) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.includes(searchQuery) ||
        customer.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(customer => customer.status === selectedStatus);
    }

    return filtered.sort((a, b) => b.totalSpent - a.totalSpent);
  }, [searchQuery, selectedStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'vip':
        return <Badge variant="primary">VIP</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const createNewCustomer = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Customer created successfully!');
      setShowNewCustomerDialog(false);
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        },
        notes: ''
      });
    } catch (error) {
      toast.error('Failed to create customer');
    }
  };

  const getCustomerStats = () => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const vipCustomers = customers.filter(c => c.status === 'vip').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    
    return {
      totalCustomers,
      activeCustomers,
      vipCustomers,
      totalRevenue
    };
  };

  const stats = getCustomerStats();

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle>Customer Management</ToolbarPageTitle>
              <ToolbarDescription>
                Manage customer profiles, orders, and loyalty programs
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowNewCustomerDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <div className="space-y-6">
          {/* Customer Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeCustomers} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.vipCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.vipCustomers / stats.totalCustomers) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  From all customers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(stats.totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0)).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all orders
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Search & Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers by name, email, phone, or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
              <CardDescription>Customer profiles and order history</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Avg Order</TableHead>
                    <TableHead>Loyalty Points</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.id}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {customer.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {customer.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{customer.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {customer.email && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="h-3 w-3" />
                              <span>{customer.email}</span>
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="h-3 w-3" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">{customer.totalOrders}</div>
                          <div className="text-sm text-muted-foreground">orders</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${customer.totalSpent.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${customer.averageOrderValue.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="font-medium">{customer.loyaltyPoints}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell>
                        {customer.lastOrderDate ? (
                          <div className="text-sm">
                            <div>{new Date(customer.lastOrderDate).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              {Math.floor((Date.now() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No orders</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setShowCustomerDialog(true);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Customer Details Dialog */}
          <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Customer Details: {selectedCustomer?.name}</DialogTitle>
                <DialogDescription>
                  View customer profile, order history, and loyalty information
                </DialogDescription>
              </DialogHeader>
              {selectedCustomer && (
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="orders">Order History</TabsTrigger>
                    <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Customer ID</Label>
                        <p className="font-mono text-sm">{selectedCustomer.id}</p>
                      </div>
                      <div>
                        <Label>Member Since</Label>
                        <p className="font-medium">{new Date(selectedCustomer.memberSince).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Email</Label>
                        <p className="font-medium">{selectedCustomer.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <p className="font-medium">{selectedCustomer.phone || 'Not provided'}</p>
                      </div>
                    </div>

                    {selectedCustomer.address && (
                      <div>
                        <Label>Address</Label>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">
                            {selectedCustomer.address.street}, {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zipCode}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label>Payment Methods</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedCustomer.paymentMethods.map((method) => (
                          <Badge key={method} variant="secondary">
                            <CreditCard className="h-3 w-3 mr-1" />
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedCustomer.notes && (
                      <div>
                        <Label>Notes</Label>
                        <p className="text-sm text-muted-foreground">{selectedCustomer.notes}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="orders" className="space-y-4">
                    <div className="space-y-4">
                      {customerOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="font-medium">{order.id}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(order.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">${order.amount.toFixed(2)}</div>
                              <div className="text-sm text-muted-foreground">
                                {order.items} items
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {getOrderStatusBadge(order.status)}
                            <Badge variant="secondary">
                              <CreditCard className="h-3 w-3 mr-1" />
                              {order.paymentMethod}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="loyalty" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Loyalty Points</Label>
                        <div className="flex items-center space-x-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <span className="text-2xl font-bold">{selectedCustomer.loyaltyPoints}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Customer Status</Label>
                        {getStatusBadge(selectedCustomer.status)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Total Orders</Label>
                        <p className="text-2xl font-bold">{selectedCustomer.totalOrders}</p>
                      </div>
                      <div>
                        <Label>Total Spent</Label>
                        <p className="text-2xl font-bold">${selectedCustomer.totalSpent.toFixed(2)}</p>
                      </div>
                      <div>
                        <Label>Average Order</Label>
                        <p className="text-2xl font-bold">${selectedCustomer.averageOrderValue.toFixed(2)}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCustomerDialog(false)}>
                  Close
                </Button>
                <Button>Edit Customer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* New Customer Dialog */}
          <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Create a new customer profile
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={newCustomer.address.street}
                      onChange={(e) => setNewCustomer(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, street: e.target.value }
                      }))}
                      placeholder="Enter street address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={newCustomer.address.city}
                      onChange={(e) => setNewCustomer(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, city: e.target.value }
                      }))}
                      placeholder="Enter city"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={newCustomer.address.state}
                      onChange={(e) => setNewCustomer(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, state: e.target.value }
                      }))}
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={newCustomer.address.zipCode}
                      onChange={(e) => setNewCustomer(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, zipCode: e.target.value }
                      }))}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newCustomer.notes}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Enter any additional notes about the customer"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewCustomerDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createNewCustomer} disabled={!newCustomer.name}>
                  Create Customer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    </Fragment>
  );
}
