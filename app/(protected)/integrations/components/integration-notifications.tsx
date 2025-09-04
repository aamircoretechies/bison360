'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellOff, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info
} from 'lucide-react';

interface NotificationRule {
  id: string;
  integration: string;
  event: string;
  condition: string;
  channels: string[];
  enabled: boolean;
  lastTriggered?: string;
  triggerCount: number;
}

interface NotificationSettings {
  email: {
    enabled: boolean;
    address: string;
    frequency: 'immediate' | 'hourly' | 'daily';
  };
  sms: {
    enabled: boolean;
    phone: string;
    frequency: 'immediate' | 'hourly' | 'daily';
  };
  inApp: {
    enabled: boolean;
    frequency: 'immediate' | 'hourly' | 'daily';
  };
  webhook: {
    enabled: boolean;
    url: string;
    frequency: 'immediate' | 'hourly' | 'daily';
  };
}

export function IntegrationNotifications() {
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([
    {
      id: 'rule-001',
      integration: 'Salesforce',
      event: 'sync_failed',
      condition: 'error_count > 5',
      channels: ['email', 'inApp'],
      enabled: true,
      lastTriggered: '2024-01-15 14:30:00',
      triggerCount: 3
    },
    {
      id: 'rule-002',
      integration: 'GrownBy',
      event: 'order_received',
      condition: 'order_value > 1000',
      channels: ['email', 'sms', 'inApp'],
      enabled: true,
      lastTriggered: '2024-01-15 14:25:00',
      triggerCount: 12
    },
    {
      id: 'rule-003',
      integration: 'Shipping Services',
      event: 'label_generation_failed',
      condition: 'failure_count > 3',
      channels: ['email', 'inApp'],
      enabled: true,
      lastTriggered: '2024-01-15 14:20:00',
      triggerCount: 1
    },
    {
      id: 'rule-004',
      integration: 'Stripe',
      event: 'payment_failed',
      condition: 'amount > 500',
      channels: ['email', 'sms'],
      enabled: false,
      triggerCount: 0
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      address: 'admin@company.com',
      frequency: 'immediate'
    },
    sms: {
      enabled: true,
      phone: '+1-555-123-4567',
      frequency: 'immediate'
    },
    inApp: {
      enabled: true,
      frequency: 'immediate'
    },
    webhook: {
      enabled: false,
      url: '',
      frequency: 'immediate'
    }
  });

  const [recentNotifications, setRecentNotifications] = useState([
    {
      id: 'notif-001',
      timestamp: '2024-01-15 14:30:00',
      integration: 'Salesforce',
      type: 'error',
      title: 'Sync Failed',
      message: 'Salesforce sync failed with 7 errors',
      channels: ['email', 'inApp'],
      read: false
    },
    {
      id: 'notif-002',
      timestamp: '2024-01-15 14:25:00',
      integration: 'GrownBy',
      type: 'success',
      title: 'High Value Order',
      message: 'New order received: $1,250.00',
      channels: ['email', 'sms', 'inApp'],
      read: true
    },
    {
      id: 'notif-003',
      timestamp: '2024-01-15 14:20:00',
      integration: 'Shipping Services',
      type: 'warning',
      title: 'Label Generation Failed',
      message: 'Failed to generate UPS label for order #12345',
      channels: ['email', 'inApp'],
      read: false
    },
    {
      id: 'notif-004',
      timestamp: '2024-01-15 14:15:00',
      integration: 'Stripe',
      type: 'info',
      title: 'Payment Processed',
      message: 'Payment of $89.99 completed successfully',
      channels: ['inApp'],
      read: true
    }
  ]);

  const toggleRule = (id: string) => {
    setNotificationRules(rules =>
      rules.map(rule =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'info': return <Info className="h-4 w-4 text-blue-600" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'inApp': return <MessageSquare className="h-4 w-4" />;
      case 'webhook': return <Settings className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Integration Notifications
          </CardTitle>
          <CardDescription>
            Configure notifications for integration events and system alerts
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules">Notification Rules</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
          <TabsTrigger value="test">Test Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Notification Rules</CardTitle>
              <CardDescription>Manage rules for integration event notifications</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                {notificationRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="secondary">{rule.integration}</Badge>
                        <span className="font-medium">{rule.event}</span>
                        <Badge variant="secondary">{rule.condition}</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <span>Channels:</span>
                          {rule.channels.map((channel) => (
                            <div key={channel} className="flex items-center space-x-1">
                              {getChannelIcon(channel)}
                              <span>{channel}</span>
                            </div>
                          ))}
                        </div>
                        <span>Triggered: {rule.triggerCount} times</span>
                        {rule.lastTriggered && (
                          <span>Last: {rule.lastTriggered}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Email Notifications</Label>
                  <Switch
                    checked={settings.email.enabled}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, enabled: checked }
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-address">Email Address</Label>
                  <Input
                    id="email-address"
                    value={settings.email.address}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, address: e.target.value }
                      }))
                    }
                    disabled={!settings.email.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-frequency">Frequency</Label>
                  <Select
                    value={settings.email.frequency}
                    onValueChange={(value: any) =>
                      setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, frequency: value }
                      }))
                    }
                    disabled={!settings.email.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  SMS Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable SMS Notifications</Label>
                  <Switch
                    checked={settings.sms.enabled}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        sms: { ...prev.sms, enabled: checked }
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-phone">Phone Number</Label>
                  <Input
                    id="sms-phone"
                    value={settings.sms.phone}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        sms: { ...prev.sms, phone: e.target.value }
                      }))
                    }
                    disabled={!settings.sms.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-frequency">Frequency</Label>
                  <Select
                    value={settings.sms.frequency}
                    onValueChange={(value: any) =>
                      setSettings(prev => ({
                        ...prev,
                        sms: { ...prev.sms, frequency: value }
                      }))
                    }
                    disabled={!settings.sms.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>History of sent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{notification.integration}</Badge>
                          <p className="font-medium">{notification.title}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                          <div className="flex items-center space-x-1">
                            {notification.channels.map((channel) => (
                              <div key={channel} className="flex items-center space-x-1">
                                {getChannelIcon(channel)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Badge variant="secondary">New</Badge>
                      )}
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Notifications</CardTitle>
              <CardDescription>Send test notifications to verify your settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test-integration">Integration</Label>
                  <Select defaultValue="salesforce">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salesforce">Salesforce</SelectItem>
                      <SelectItem value="grownby">GrownBy</SelectItem>
                      <SelectItem value="shipping">Shipping Services</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-type">Notification Type</Label>
                  <Select defaultValue="success">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-message">Test Message</Label>
                <Input
                  id="test-message"
                  placeholder="Enter test message..."
                  defaultValue="This is a test notification from BISON 360 integrations"
                />
              </div>
              <div className="flex space-x-2">
                <Button>Send Test Email</Button>
                <Button variant="outline">Send Test SMS</Button>
                <Button variant="outline">Send Test In-App</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
