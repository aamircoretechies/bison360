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
import { Save, Settings, Users, Barcode, MapPin, CreditCard, FileText, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function MasterSettingsPage() {
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  // Users & Roles State
  const [users, setUsers] = useState([
    {
      id: 'user-001',
      name: 'John Smith',
      email: 'john.smith@bison360.com',
      role: 'Admin',
      accessRights: 'Both',
      isActive: true,
      lastLogin: '2024-01-15 14:30:00'
    },
    {
      id: 'user-002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@bison360.com',
      role: 'Meat Manager',
      accessRights: 'Both',
      isActive: true,
      lastLogin: '2024-01-15 13:45:00'
    },
    {
      id: 'user-003',
      name: 'Mike Wilson',
      email: 'mike.wilson@bison360.com',
      role: 'Retail Manager',
      accessRights: 'Read',
      isActive: true,
      lastLogin: '2024-01-15 12:20:00'
    }
  ]);

  const [roles] = useState([
    { name: 'Admin', permissions: ['Full Access'], description: 'Complete system access' },
    { name: 'Accountant', permissions: ['Financial Reports', 'Inventory Reports'], description: 'Financial and reporting access' },
    { name: 'Meat Manager', permissions: ['Inventory Management', 'Production Reports'], description: 'Meat processing operations' },
    { name: 'Retail Manager', permissions: ['POS Operations', 'Sales Reports'], description: 'Retail store operations' },
    { name: 'Cashier Manager', permissions: ['POS Transactions', 'Customer Service'], description: 'Point of sale management' },
    { name: 'Shipping Staff', permissions: ['Order Fulfillment', 'Shipping Reports'], description: 'Shipping and logistics' },
    { name: 'Livestock Manager', permissions: ['Livestock Tracking', 'Breeding Reports'], description: 'Livestock management' }
  ]);

  // SKU & Barcode Rules State
  const [skuSettings, setSkuSettings] = useState({
    autoSkuGeneration: true,
    skuPrefix: 'BISON',
    skuFormat: 'PREFIX-YYYY-XXXX',
    barcodeAssignment: 'shelf',
    barcodePrinting: true,
    manualOverride: true
  });

  // Inventory Locations State
  const [locations, setLocations] = useState([
    {
      id: 'loc-001',
      name: 'Ranch HQ',
      type: 'Main',
      address: '1234 Processing Lane, Meat City, MC 12345',
      rackShelves: true,
      alerts: true,
      isActive: true
    },
    {
      id: 'loc-002',
      name: 'Satellite Site A',
      type: 'Satellite',
      address: '5678 Ranch Road, Satellite City, SC 67890',
      rackShelves: true,
      alerts: true,
      isActive: true
    }
  ]);

  // POS & Payments State
  const [posSettings, setPosSettings] = useState({
    creditCard: true,
    ebtReader: true,
    cash: true,
    discounts: true,
    overrides: true,
    cartFeatures: ['discounts', 'overrides', 'promotions']
  });

  // Compliance & Reporting State
  const [complianceSettings, setComplianceSettings] = useState({
    usdaReports: true,
    meatMovement: true,
    inventoryShrinkage: true,
    saleTypeReports: true,
    exportFormats: ['PDF', 'CSV', 'Excel', 'JSON']
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleAddUser = () => {
    // Add new user logic
  };

  const handleEditUser = (userId: string) => {
    // Edit user logic
  };

  const handleDeleteUser = (userId: string) => {
    // Delete user logic
  };

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text="Master Settings (Admin)" />
              <ToolbarDescription>
                Configure system-wide settings, user management, and business rules
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <div className="space-y-6">
          <Tabs defaultValue="users-roles" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="users-roles">
                <Users className="h-4 w-4 mr-2" />
                Users & Roles
              </TabsTrigger>
              <TabsTrigger value="sku-barcode">
                <Barcode className="h-4 w-4 mr-2" />
                SKU & Barcode
              </TabsTrigger>
              <TabsTrigger value="inventory-locations">
                <MapPin className="h-4 w-4 mr-2" />
                Inventory Locations
              </TabsTrigger>
              <TabsTrigger value="pos-payments">
                <CreditCard className="h-4 w-4 mr-2" />
                POS & Payments
              </TabsTrigger>
              <TabsTrigger value="compliance">
                <FileText className="h-4 w-4 mr-2" />
                Compliance & Reporting
              </TabsTrigger>
            </TabsList>

            {/* Users & Roles Tab */}
            <TabsContent value="users-roles" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Users & Roles Management</h3>
                  <p className="text-sm text-muted-foreground">Create/edit users, assign roles, and set access rights</p>
                </div>
                <Button onClick={handleAddUser}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle>System Users</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Access Rights</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                                                  <TableCell>
                          <Badge variant="secondary" appearance="outline">{user.role}</Badge>
                        </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{user.accessRights}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isActive ? 'success' : 'secondary'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {user.lastLogin}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditUser(user.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Roles Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Roles</CardTitle>
                  <CardDescription>System roles and their associated permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map((role) => (
                      <div key={role.name} className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">{role.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((permission) => (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Audit Logs */}
              <Card>
                <CardHeader>
                  <CardTitle>Audit Logs</CardTitle>
                  <CardDescription>Track changes to users, roles, and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">User Role Updated</p>
                        <p className="text-sm text-muted-foreground">Sarah Johnson: Retail Manager → Meat Manager</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">2024-01-15 10:30:00</p>
                        <p className="text-xs text-muted-foreground">by admin@bison360.com</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">New User Created</p>
                        <p className="text-sm text-muted-foreground">Mike Wilson - Cashier Manager</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">2024-01-14 15:45:00</p>
                        <p className="text-xs text-muted-foreground">by admin@bison360.com</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SKU & Barcode Rules Tab */}
            <TabsContent value="sku-barcode" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SKU & Barcode Rules</CardTitle>
                  <CardDescription>Configure SKU generation and barcode management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Auto-SKU Generation */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Auto-SKU Generation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Auto-SKU Generation</Label>
                          <p className="text-sm text-muted-foreground">Automatically generate SKUs for new products</p>
                        </div>
                        <Switch
                          checked={skuSettings.autoSkuGeneration}
                          onCheckedChange={(checked) => setSkuSettings({...skuSettings, autoSkuGeneration: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Allow Manual Override</Label>
                          <p className="text-sm text-muted-foreground">Users can manually set SKUs when needed</p>
                        </div>
                        <Switch
                          checked={skuSettings.manualOverride}
                          onCheckedChange={(checked) => setSkuSettings({...skuSettings, manualOverride: checked})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="skuPrefix">SKU Prefix</Label>
                        <Input
                          id="skuPrefix"
                          value={skuSettings.skuPrefix}
                          onChange={(e) => setSkuSettings({...skuSettings, skuPrefix: e.target.value})}
                          placeholder="e.g., BISON"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="skuFormat">SKU Format</Label>
                        <Input
                          id="skuFormat"
                          value={skuSettings.skuFormat}
                          onChange={(e) => setSkuSettings({...skuSettings, skuFormat: e.target.value})}
                          placeholder="e.g., PREFIX-YYYY-XXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Barcode Management */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Barcode Management</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="barcodeAssignment">Barcode Assignment Level</Label>
                        <Select value={skuSettings.barcodeAssignment} onValueChange={(value) => setSkuSettings({...skuSettings, barcodeAssignment: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignment level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="product">Product Level</SelectItem>
                            <SelectItem value="shelf">Shelf Level</SelectItem>
                            <SelectItem value="location">Location Level</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Barcode Printing</Label>
                          <p className="text-sm text-muted-foreground">Allow printing of barcodes at shelf level</p>
                        </div>
                        <Switch
                          checked={skuSettings.barcodePrinting}
                          onCheckedChange={(checked) => setSkuSettings({...skuSettings, barcodePrinting: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inventory Locations Tab */}
            <TabsContent value="inventory-locations" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Inventory Locations</h3>
                  <p className="text-sm text-muted-foreground">Manage multi-location inventory with rack/shelf views</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>

              {/* Locations List */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Location Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Rack/Shelf View</TableHead>
                        <TableHead>Alerts</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {locations.map((location) => (
                        <TableRow key={location.id}>
                          <TableCell className="font-medium">{location.name}</TableCell>
                                                  <TableCell>
                          <Badge variant="secondary" appearance="outline">{location.type}</Badge>
                        </TableCell>
                          <TableCell className="max-w-xs truncate">{location.address}</TableCell>
                          <TableCell>
                            <Badge variant={location.rackShelves ? 'success' : 'secondary'}>
                              {location.rackShelves ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={location.alerts ? 'success' : 'secondary'}>
                              {location.alerts ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={location.isActive ? 'success' : 'secondary'}>
                              {location.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <MapPin className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Location Alerts Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Location Alerts Configuration</CardTitle>
                  <CardDescription>Configure alerts for inventory levels and movements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Low Stock Alerts</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Enable Low Stock Alerts</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lowStockThreshold">Low Stock Threshold (%)</Label>
                          <Input id="lowStockThreshold" type="number" defaultValue={20} min="1" max="100" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Movement Alerts</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Enable Movement Alerts</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="movementThreshold">Movement Threshold (units)</Label>
                          <Input id="movementThreshold" type="number" defaultValue={100} min="1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* POS & Payments Tab */}
            <TabsContent value="pos-payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>POS & Payment Settings</CardTitle>
                  <CardDescription>Configure accepted payment methods and cart features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Methods */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Accepted Payment Methods</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Credit Card (Square)</Label>
                          <p className="text-sm text-muted-foreground">Accept credit card payments via Square</p>
                        </div>
                        <Switch
                          checked={posSettings.creditCard}
                          onCheckedChange={(checked) => setPosSettings({...posSettings, creditCard: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label>EBT Reader</Label>
                          <p className="text-sm text-muted-foreground">Accept EBT/SNAP payments</p>
                        </div>
                        <Switch
                          checked={posSettings.ebtReader}
                          onCheckedChange={(checked) => setPosSettings({...posSettings, ebtReader: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Cash</Label>
                          <p className="text-sm text-muted-foreground">Accept cash payments</p>
                        </div>
                        <Switch
                          checked={posSettings.cash}
                          onCheckedChange={(checked) => setPosSettings({...posSettings, cash: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Cart Features */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Cart Features & Permissions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <h5 className="font-medium">Feature Toggles</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Enable Discounts</span>
                            <Switch
                              checked={posSettings.discounts}
                              onCheckedChange={(checked) => setPosSettings({...posSettings, discounts: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Enable Price Overrides</span>
                            <Switch
                              checked={posSettings.overrides}
                              onCheckedChange={(checked) => setPosSettings({...posSettings, overrides: checked})}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h5 className="font-medium">Role-Based Permissions</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Cashier Manager</span>
                            <Badge variant="secondary" appearance="outline">Discounts + Overrides</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Retail Manager</span>
                            <Badge variant="secondary" appearance="outline">All Features</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Admin</span>
                            <Badge variant="secondary" appearance="outline">Full Access</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compliance & Reporting Tab */}
            <TabsContent value="compliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance & Reporting Settings</CardTitle>
                  <CardDescription>Configure report templates and export formats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Report Types */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Required Reports</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label>USDA Reports</Label>
                          <p className="text-sm text-muted-foreground">USDA compliance and inspection reports</p>
                        </div>
                        <Switch
                          checked={complianceSettings.usdaReports}
                          onCheckedChange={(checked) => setComplianceSettings({...complianceSettings, usdaReports: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Meat Movement Reports</Label>
                          <p className="text-sm text-muted-foreground">Track meat product movements and transfers</p>
                        </div>
                        <Switch
                          checked={complianceSettings.meatMovement}
                          onCheckedChange={(checked) => setComplianceSettings({...complianceSettings, meatMovement: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Inventory Shrinkage Reports</Label>
                          <p className="text-sm text-muted-foreground">Monitor inventory losses and discrepancies</p>
                        </div>
                        <Switch
                          checked={complianceSettings.inventoryShrinkage}
                          onCheckedChange={(checked) => setComplianceSettings({...complianceSettings, inventoryShrinkage: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Sale-Type Reports</Label>
                          <p className="text-sm text-muted-foreground">Categorize sales by type and channel</p>
                        </div>
                        <Switch
                          checked={complianceSettings.saleTypeReports}
                          onCheckedChange={(checked) => setComplianceSettings({...complianceSettings, saleTypeReports: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Export Formats */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Export Formats</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Available Export Formats</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {complianceSettings.exportFormats.map((format) => (
                            <div key={format} className="flex items-center space-x-2">
                              <input type="checkbox" id={format} defaultChecked />
                              <Label htmlFor={format}>{format}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Default Export Format</Label>
                        <Select defaultValue="PDF">
                          <SelectTrigger>
                            <SelectValue placeholder="Select default format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PDF">PDF</SelectItem>
                            <SelectItem value="CSV">CSV</SelectItem>
                            <SelectItem value="Excel">Excel</SelectItem>
                            <SelectItem value="JSON">JSON</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Report Templates */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Report Templates</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">USDA Template</h5>
                        <p className="text-sm text-muted-foreground mb-2">Standard USDA compliance format</p>
                        <Button variant="outline" size="sm" className="w-full">Customize</Button>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">Inventory Template</h5>
                        <p className="text-sm text-muted-foreground mb-2">Inventory movement and shrinkage</p>
                        <Button variant="outline" size="sm" className="w-full">Customize</Button>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">Sales Template</h5>
                        <p className="text-sm text-muted-foreground mb-2">Sales categorization and analysis</p>
                        <Button variant="outline" size="sm" className="w-full">Customize</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </Fragment>
  );
}

