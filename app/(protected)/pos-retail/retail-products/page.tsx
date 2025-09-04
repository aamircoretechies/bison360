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
  Package, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Star,
  Tag,
  Image as ImageIcon,
  BarChart3,
  Grid3X3,
  List
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  cost: number;
  category: string;
  stock: number;
  lowStockThreshold: number;
  image?: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  salesCount: number;
  rating: number;
}

interface ProductCategory {
  id: string;
  name: string;
  productCount: number;
}

export default function RetailProductsPage() {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showStockDialog, setShowStockDialog] = useState(false);

  // Mock products data
  const products: Product[] = [
    {
      id: '1',
      name: 'Ground Bison (1lb)',
      description: 'Premium ground bison meat, perfect for burgers and meatballs',
      sku: 'GB-001',
      price: 12.99,
      cost: 8.50,
      category: 'Meat',
      stock: 25,
      lowStockThreshold: 10,
      tags: ['organic', 'grass-fed', 'premium'],
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      salesCount: 156,
      rating: 4.8
    },
    {
      id: '2',
      name: 'Bison Ribeye Steak',
      description: 'Tender ribeye steak from grass-fed bison',
      sku: 'BR-002',
      price: 24.99,
      cost: 18.00,
      category: 'Meat',
      stock: 15,
      lowStockThreshold: 5,
      tags: ['premium', 'steak', 'grass-fed'],
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      salesCount: 89,
      rating: 4.9
    },
    {
      id: '3',
      name: 'Bison Jerky',
      description: 'Dried bison jerky, perfect for snacking',
      sku: 'BJ-003',
      price: 8.99,
      cost: 5.50,
      category: 'Snacks',
      stock: 50,
      lowStockThreshold: 20,
      tags: ['jerky', 'snack', 'protein'],
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      salesCount: 234,
      rating: 4.6
    },
    {
      id: '4',
      name: 'Organic Vegetables Mix',
      description: 'Fresh organic vegetables from local farms',
      sku: 'OV-004',
      price: 6.99,
      cost: 4.00,
      category: 'Produce',
      stock: 5,
      lowStockThreshold: 15,
      tags: ['organic', 'vegetables', 'fresh'],
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      salesCount: 78,
      rating: 4.4
    },
    {
      id: '5',
      name: 'Bison Sausage Links',
      description: 'Spicy bison sausage links, great for grilling',
      sku: 'BS-005',
      price: 14.99,
      cost: 9.50,
      category: 'Meat',
      stock: 0,
      lowStockThreshold: 8,
      tags: ['sausage', 'spicy', 'grilling'],
      isActive: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      salesCount: 45,
      rating: 4.7
    }
  ];

  const categories: ProductCategory[] = [
    { id: 'all', name: 'All Categories', productCount: products.length },
    { id: 'meat', name: 'Meat', productCount: products.filter(p => p.category === 'Meat').length },
    { id: 'snacks', name: 'Snacks', productCount: products.filter(p => p.category === 'Snacks').length },
    { id: 'produce', name: 'Produce', productCount: products.filter(p => p.category === 'Produce').length }
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === selectedCategory
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return a.stock - b.stock;
        case 'sales':
          return b.salesCount - a.salesCount;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  // Get stock status
  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { status: 'out', color: 'destructive', label: 'Out of Stock' };
    } else if (product.stock <= product.lowStockThreshold) {
      return { status: 'low', color: 'default', label: 'Low Stock' };
    } else {
      return { status: 'good', color: 'success', label: 'In Stock' };
    }
  };

  // Update stock
  const updateStock = (productId: string, newStock: number) => {
    toast.success(`Stock updated for product ${productId}`);
    setShowStockDialog(false);
    // In real implementation, this would update the database
  };

  // Delete product
  const deleteProduct = (productId: string) => {
    toast.success(`Product ${productId} deleted`);
    // In real implementation, this would delete from database
  };

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle>Retail Products</ToolbarPageTitle>
              <ToolbarDescription>
                Manage product catalog, inventory, and pricing
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" size="sm">
                <Package className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <div className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Search, filter, and manage your product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products by name, SKU, or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name} ({category.productCount})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Product Image */}
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                            <Badge variant={stockStatus.color as any}>{stockStatus.label}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{product.sku}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                          
                          {/* Price and Stock */}
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">${product.price}</span>
                            <span className="text-sm text-muted-foreground">
                              {product.stock} in stock
                            </span>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {product.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {product.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{product.tags.length - 2}
                              </Badge>
                            )}
                          </div>

                          {/* Rating and Sales */}
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{product.rating}</span>
                            </div>
                            <span>{product.salesCount} sold</span>
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowProductDialog(true);
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowStockDialog(true);
                              }}
                            >
                              <Package className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product);
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" />
                                ) : (
                                  <ImageIcon className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{product.category}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">${product.price}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Badge variant={stockStatus.color as any}>{stockStatus.label}</Badge>
                          </TableCell>
                          <TableCell>{product.salesCount}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{product.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowProductDialog(true);
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteProduct(product.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Product Details Dialog */}
          <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Product Details</DialogTitle>
                <DialogDescription>
                  View and manage product information
                </DialogDescription>
              </DialogHeader>
              {selectedProduct && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Product Name</Label>
                      <p className="font-medium">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <Label>SKU</Label>
                      <p className="font-mono">{selectedProduct.sku}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Price</Label>
                      <p className="font-medium">${selectedProduct.price}</p>
                    </div>
                    <div>
                      <Label>Cost</Label>
                      <p className="font-medium">${selectedProduct.cost}</p>
                    </div>
                    <div>
                      <Label>Margin</Label>
                      <p className="font-medium">
                        {(((selectedProduct.price - selectedProduct.cost) / selectedProduct.price) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Stock</Label>
                      <p className="font-medium">{selectedProduct.stock} units</p>
                    </div>
                    <div>
                      <Label>Low Stock Threshold</Label>
                      <p className="font-medium">{selectedProduct.lowStockThreshold} units</p>
                    </div>
                  </div>
                  <div>
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedProduct.tags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowProductDialog(false)}>
                  Close
                </Button>
                <Button>Edit Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Stock Update Dialog */}
          <Dialog open={showStockDialog} onOpenChange={setShowStockDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Stock</DialogTitle>
                <DialogDescription>
                  Adjust inventory levels for {selectedProduct?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="stock">Current Stock: {selectedProduct?.stock}</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="Enter new stock quantity"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason for Change</Label>
                  <Textarea
                    id="reason"
                    placeholder="Enter reason for stock adjustment..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowStockDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => updateStock(selectedProduct?.id || '', 0)}>
                  Update Stock
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    </Fragment>
  );
}
