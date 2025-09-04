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
import { Save, Bell, Mail, MessageSquare, Smartphone, Plus, Edit, Trash2, TestTube, AlertTriangle, Clock, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

export default function NotificationsSetupPage() {
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  // Inventory Alerts State
  const [inventoryAlerts, setInventoryAlerts] = useState({
    lowStockThreshold: 20,
    expiryThreshold: 7,
    dashboardCards: true,
    emailNotifications: true,
    recipients: ['meat_manager', 'admin']
  });

  // End-of-Day POS State
  const [endOfDayPOS, setEndOfDayPOS] = useState({
    zReportEmail: true,
    recipients: ['admin', 'accountant'],
    sendTime: '23:59',
    includeSummary: true
  });

  // Offline Sync Notices State
  const [offlineSyncNotices, setOfflineSyncNotices] = useState({
    inAppNotices: true,
    perRecordStatus: true,
    syncQueueDisplay: true,
    reconnectionAlerts: true
  });

  // Notification Templates
  const [notificationTemplates, setNotificationTemplates] = useState([
    {
      id: 'template-001',
      name: 'Low Inventory Alert',
      type: 'Email',
      subject: 'Low Inventory Alert - [product_name]',
      body: 'Dear [user_name],\n\nThis is to notify you that [product_name] has reached low inventory levels.\n\nCurrent Stock: [current_stock]\nReorder Point: [reorder_point]\n\nPlease take necessary action.\n\nBest regards,\nBison360 System',
      isActive: true,
      triggers: ['inventory_low', 'stock_alert']
    },
    {
      id: 'template-002',
      name: 'End-of-Day Z-Report',
      type: 'Email',
      subject: 'End-of-Day Z-Report - [date]',
      body: 'Dear [recipient_name],\n\nPlease find attached the End-of-Day Z-Report for [date].\n\nTotal Sales: [total_sales]\nTotal Transactions: [total_transactions]\n\nBest regards,\nBison360 POS System',
      isActive: true,
      triggers: ['end_of_day', 'pos_close']
    },
    {
      id: 'template-003',
      name: 'Offline Sync Notice',
      type: 'In-App',
      subject: '',
      body: 'You have [pending_records] records waiting to sync. Please reconnect to the internet to synchronize your data.',
      isActive: true,
      triggers: ['offline_detected', 'sync_pending']
    }
  ]);

  // Delivery Settings
  const [deliverySettings, setDeliverySettings] = useState({
    email: {
      smtpServer: 'smtp.gmail.com',
      smtpPort: 587,
      username: 'notifications@bison360.com',
      useTLS: true,
      fromName: 'Bison360 Notifications',
      fromEmail: 'notifications@bison360.com'
    },
    sms: {
      provider: 'Twilio',
      accountSid: 'AC1234567890abcdef',
      authToken: '••••••••••••••••',
      fromNumber: '+15551234567'
    }
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleTestNotification = (type: string) => {
    // Simulate sending test notification
    console.log(`Testing ${type} notification`);
  };

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle>Notification Setup (Admin)</ToolbarPageTitle>
              <ToolbarDescription>
                Configure inventory alerts, end-of-day POS reports, and offline sync notifications
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline" size="sm">
                <TestTube className="h-4 w-4 mr-2" />
                Test Notifications
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
          <Tabs defaultValue="inventory-alerts" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inventory-alerts">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Inventory Alerts
              </TabsTrigger>
              <TabsTrigger value="end-of-day-pos">
                <Clock className="h-4 w-4 mr-2" />
                End-of-Day POS
              </TabsTrigger>
              <TabsTrigger value="offline-sync">
                <Wifi className="h-4 w-4 mr-2" />
                Offline Sync Notices
              </TabsTrigger>
            </TabsList>

            {/* Inventory Alerts Tab */}
            <TabsContent value="inventory-alerts" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Inventory Alerts Configuration</h3>
                  <p className="text-sm text-muted-foreground">Set low stock & expiry thresholds and notification preferences</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Low Stock Alerts</CardTitle>
                  <CardDescription>Configure when and how low stock alerts are triggered</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Threshold (%)</Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        value={inventoryAlerts.lowStockThreshold}
                        onChange={(e) => setInventoryAlerts({...inventoryAlerts, lowStockThreshold: parseInt(e.target.value)})}
                        min="1"
                        max="100"
                        placeholder="20"
                      />
                      <p className="text-xs text-muted-foreground">Alert when stock falls below this percentage</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryThreshold">Expiry Warning (Days)</Label>
                      <Input
                        id="expiryThreshold"
                        type="number"
                        value={inventoryAlerts.expiryThreshold}
                        onChange={(e) => setInventoryAlerts({...inventoryAlerts, expiryThreshold: parseInt(e.target.value)})}
                        min="1"
                        max="30"
                        placeholder="7"
                      />
                      <p className="text-xs text-muted-foreground">Warn when products expire within this many days</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Methods</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Dashboard Cards</Label>
                          <p className="text-sm text-muted-foreground">Show alerts as dashboard notification cards</p>
                        </div>
                        <Switch
                          checked={inventoryAlerts.dashboardCards}
                          onCheckedChange={(checked) => setInventoryAlerts({...inventoryAlerts, dashboardCards: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send email alerts to Meat Manager and Admin</p>
                        </div>
                        <Switch
                          checked={inventoryAlerts.emailNotifications}
                          onCheckedChange={(checked) => setInventoryAlerts({...inventoryAlerts, emailNotifications: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Alert Recipients</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="meat_manager" defaultChecked />
                        <Label htmlFor="meat_manager">Meat Manager</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="admin" defaultChecked />
                        <Label htmlFor="admin">Admin</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="inventory_staff" />
                        <Label htmlFor="inventory_staff">Inventory Staff</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="warehouse_supervisor" />
                        <Label htmlFor="warehouse_supervisor">Warehouse Supervisor</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alert Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Alert Templates</CardTitle>
                  <CardDescription>Customize notification messages for different alert types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Low Stock Alert Template</h4>
                      <div className="space-y-2">
                        <Label htmlFor="lowStockSubject">Subject Line</Label>
                        <Input
                          id="lowStockSubject"
                          defaultValue="Low Stock Alert - [product_name]"
                          placeholder="Enter subject line with placeholders"
                        />
                        <Label htmlFor="lowStockBody">Message Body</Label>
                        <Textarea
                          id="lowStockBody"
                          defaultValue="Dear [user_name], This is to notify you that [product_name] has reached low inventory levels. Current Stock: [current_stock] Reorder Point: [reorder_point] Please take necessary action."
                          rows={4}
                          placeholder="Enter message body with placeholders"
                        />
                        <p className="text-xs text-muted-foreground">
                          Available placeholders: [product_name], [current_stock], [reorder_point], [user_name]
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Expiry Warning Template</h4>
                      <div className="space-y-2">
                        <Label htmlFor="expirySubject">Subject Line</Label>
                        <Input
                          id="expirySubject"
                          defaultValue="Product Expiry Warning - [product_name]"
                          placeholder="Enter subject line with placeholders"
                        />
                        <Label htmlFor="expiryBody">Message Body</Label>
                        <Textarea
                          id="expiryBody"
                          defaultValue="Dear [user_name], [product_name] will expire on [expiry_date]. Current stock: [current_stock]. Please take action to prevent waste."
                          rows={4}
                          placeholder="Enter message body with placeholders"
                        />
                        <p className="text-xs text-muted-foreground">
                          Available placeholders: [product_name], [expiry_date], [current_stock], [user_name]
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* End-of-Day POS Tab */}
            <TabsContent value="end-of-day-pos" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">End-of-Day POS Configuration</h3>
                  <p className="text-sm text-muted-foreground">Configure Z-Report email notifications at shift close</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Z-Report Email Settings</CardTitle>
                  <CardDescription>Automatically send Z-Reports to Admin and Accountant at shift close</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Z-Report Emails</Label>
                      <p className="text-sm text-muted-foreground">Send Z-Report emails automatically at shift close</p>
                    </div>
                    <Switch
                      checked={endOfDayPOS.zReportEmail}
                      onCheckedChange={(checked) => setEndOfDayPOS({...endOfDayPOS, zReportEmail: checked})}
                    />
                  </div>

                  {endOfDayPOS.zReportEmail && (
                    <>
                      <Separator />
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Email Configuration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="sendTime">Send Time</Label>
                            <Input
                              id="sendTime"
                              type="time"
                              value={endOfDayPOS.sendTime}
                              onChange={(e) => setEndOfDayPOS({...endOfDayPOS, sendTime: e.target.value})}
                            />
                            <p className="text-xs text-muted-foreground">Time to send Z-Report emails</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Include Summary</Label>
                              <p className="text-sm text-muted-foreground">Include summary statistics in email body</p>
                            </div>
                            <Switch
                              checked={endOfDayPOS.includeSummary}
                              onCheckedChange={(checked) => setEndOfDayPOS({...endOfDayPOS, includeSummary: checked})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Email Recipients</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="admin_recipient" defaultChecked />
                            <Label htmlFor="admin_recipient">Admin</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="accountant_recipient" defaultChecked />
                            <Label htmlFor="accountant_recipient">Accountant</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="store_manager" />
                            <Label htmlFor="store_manager">Store Manager</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="pos_supervisor" />
                            <Label htmlFor="pos_supervisor">POS Supervisor</Label>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Z-Report Template */}
              <Card>
                <CardHeader>
                  <CardTitle>Z-Report Email Template</CardTitle>
                  <CardDescription>Customize the Z-Report email format and content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="zReportSubject">Subject Line</Label>
                                              <Input
                          id="zReportSubject"
                          defaultValue="End-of-Day Z-Report - [date] - [store_name]"
                          placeholder="Enter subject line with placeholders"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zReportBody">Email Body</Label>
                        <Textarea
                          id="zReportBody"
                          defaultValue="Dear [recipient_name], Please find attached the End-of-Day Z-Report for [date] from [store_name]. Total Sales: [total_sales] Total Transactions: [total_transactions] Cash Sales: [cash_sales] Card Sales: [card_sales] Best regards, Bison360 POS System"
                          rows={6}
                          placeholder="Enter email body with placeholders"
                        />
                        <p className="text-xs text-muted-foreground">
                          Available placeholders: [date], [store_name], [total_sales], [total_transactions], [cash_sales], [card_sales], [recipient_name]
                        </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Offline Sync Notices Tab */}
            <TabsContent value="offline-sync" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Offline Sync Notices</h3>
                  <p className="text-sm text-muted-foreground">Configure in-app notices for unsynced records and sync status</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Offline Sync Notice Settings</CardTitle>
                  <CardDescription>Configure how offline sync notices are displayed to users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Notice Display Options</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>In-App Notices</Label>
                          <p className="text-sm text-muted-foreground">Show notices for unsynced records</p>
                        </div>
                        <Switch
                          checked={offlineSyncNotices.inAppNotices}
                          onCheckedChange={(checked) => setOfflineSyncNotices({...offlineSyncNotices, inAppNotices: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Per-Record Status</Label>
                          <p className="text-sm text-muted-foreground">Show sync status for individual records</p>
                        </div>
                        <Switch
                          checked={offlineSyncNotices.perRecordStatus}
                          onCheckedChange={(checked) => setOfflineSyncNotices({...offlineSyncNotices, perRecordStatus: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Sync Queue Display</Label>
                          <p className="text-sm text-muted-foreground">Show unsynced queue status</p>
                        </div>
                        <Switch
                          checked={offlineSyncNotices.syncQueueDisplay}
                          onCheckedChange={(checked) => setOfflineSyncNotices({...offlineSyncNotices, syncQueueDisplay: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Reconnection Alerts</Label>
                          <p className="text-sm text-muted-foreground">Alert when connection is restored</p>
                        </div>
                        <Switch
                          checked={offlineSyncNotices.reconnectionAlerts}
                          onCheckedChange={(checked) => setOfflineSyncNotices({...offlineSyncNotices, reconnectionAlerts: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Notice Appearance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="noticePosition">Notice Position</Label>
                        <Select defaultValue="top-right">
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top-right">Top Right</SelectItem>
                            <SelectItem value="top-left">Top Left</SelectItem>
                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="noticeDuration">Notice Duration (seconds)</Label>
                        <Input
                          id="noticeDuration"
                          type="number"
                          defaultValue={5}
                          min="1"
                          max="30"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Offline Sync Notice Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Offline Sync Notice Templates</CardTitle>
                  <CardDescription>Customize messages for different offline sync scenarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Offline Detection Notice</h4>
                      <div className="space-y-2">
                        <Label htmlFor="offlineNotice">Notice Message</Label>
                        <Textarea
                          id="offlineNotice"
                          defaultValue="You are currently offline. [pending_records] records are waiting to sync. Please reconnect to the internet to synchronize your data."
                          rows={3}
                          placeholder="Enter offline notice message"
                        />
                        <p className="text-xs text-muted-foreground">
                          Available placeholders: [pending_records]
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Reconnection Success Notice</h4>
                      <div className="space-y-2">
                        <Label htmlFor="reconnectionNotice">Notice Message</Label>
                        <Textarea
                          id="reconnectionNotice"
                          defaultValue="Connection restored! Syncing [pending_records] records... This may take a few moments."
                          rows={3}
                          placeholder="Enter reconnection notice message"
                        />
                        <p className="text-xs text-muted-foreground">
                          Available placeholders: [pending_records]
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Sync Complete Notice</h4>
                      <div className="space-y-2">
                        <Label htmlFor="syncCompleteNotice">Notice Message</Label>
                        <Textarea
                          id="syncCompleteNotice"
                          defaultValue="Sync complete! All [synced_records] records have been synchronized successfully."
                          rows={3}
                          placeholder="Enter sync complete notice message"
                        />
                        <p className="text-xs text-muted-foreground">
                          Available placeholders: [synced_records]
                        </p>
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

