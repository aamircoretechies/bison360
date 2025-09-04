'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  WifiOff, 
  Wifi, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Database,
  Upload
} from 'lucide-react';

interface PendingTransaction {
  id: string;
  type: 'sale' | 'refund' | 'inventory_update';
  timestamp: string;
  amount?: number;
  items?: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
}

interface OfflinePOSBannerProps {
  onSync?: () => Promise<void> | void;
  onViewQueue?: () => void;
}

export function OfflinePOSBanner({ onSync, onViewQueue }: OfflinePOSBannerProps) {
  const [online, setOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);

  // Mock pending transactions
  const [pendingTransactions] = useState<PendingTransaction[]>([
    {
      id: 'txn-001',
      type: 'sale',
      timestamp: '2024-01-15 14:30:00',
      amount: 89.99,
      items: 3,
      status: 'pending',
      retryCount: 0
    },
    {
      id: 'txn-002',
      type: 'sale',
      timestamp: '2024-01-15 14:25:00',
      amount: 156.50,
      items: 5,
      status: 'pending',
      retryCount: 0
    },
    {
      id: 'txn-003',
      type: 'inventory_update',
      timestamp: '2024-01-15 14:20:00',
      status: 'syncing',
      retryCount: 1
    },
    {
      id: 'txn-004',
      type: 'refund',
      timestamp: '2024-01-15 14:15:00',
      amount: 45.00,
      items: 1,
      status: 'failed',
      retryCount: 2
    }
  ]);

  useEffect(() => {
    const updateOnlineStatus = () => setOnline(navigator.onLine);
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleSync = async () => {
    if (!onSync) return;
    
    setIsSyncing(true);
    setSyncProgress(0);
    
    try {
      // Simulate sync progress
      const interval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsSyncing(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      await onSync();
    } catch (error) {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'refund':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'inventory_update':
        return <Database className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'syncing':
        return <Badge variant="primary">Syncing</Badge>;
      case 'synced':
        return <Badge variant="success">Synced</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingCount = pendingTransactions.filter(t => t.status === 'pending').length;
  const failedCount = pendingTransactions.filter(t => t.status === 'failed').length;
  const syncingCount = pendingTransactions.filter(t => t.status === 'syncing').length;

  if (online && pendingTransactions.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Offline Status Banner */}
      {!online && (
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Offline Mode</AlertTitle>
          <AlertDescription>
            You are currently offline. Transactions will be saved locally and synced when connection is restored.
          </AlertDescription>
        </Alert>
      )}

      {/* Sync Queue Banner */}
      {(online && pendingTransactions.length > 0) && (
        <Alert>
          <Database className="h-4 w-4" />
          <AlertTitle>Pending Sync Items ({pendingTransactions.length})</AlertTitle>
          <AlertDescription>
            Some transactions are pending synchronization with the server.
          </AlertDescription>
        </Alert>
      )}

      {/* Sync Progress */}
      {isSyncing && (
        <Alert>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertTitle>Synchronizing...</AlertTitle>
          <AlertDescription>
            <div className="space-y-2">
              <Progress value={syncProgress} className="w-full" />
              <p className="text-sm">Syncing transactions with server...</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Pending Transactions Queue */}
      {pendingTransactions.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Sync Queue</h4>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{pendingCount} Pending</Badge>
              {syncingCount > 0 && <Badge variant="primary">{syncingCount} Syncing</Badge>}
              {failedCount > 0 && <Badge variant="destructive">{failedCount} Failed</Badge>}
            </div>
          </div>
          
          <div className="space-y-2">
            {pendingTransactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="text-sm font-medium">
                      {transaction.type === 'sale' && `Sale - $${transaction.amount?.toFixed(2)}`}
                      {transaction.type === 'refund' && `Refund - $${transaction.amount?.toFixed(2)}`}
                      {transaction.type === 'inventory_update' && 'Inventory Update'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(transaction.status)}
                  {transaction.retryCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      Retry {transaction.retryCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {pendingTransactions.length > 3 && (
              <div className="text-center">
                <Button variant="outline" size="sm" onClick={onViewQueue}>
                  View All {pendingTransactions.length} Items
                </Button>
              </div>
            )}
          </div>

          {/* Sync Actions */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <div className="text-sm text-muted-foreground">
              {online ? (
                <div className="flex items-center space-x-2">
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span>Online - Ready to sync</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <WifiOff className="h-4 w-4 text-red-600" />
                  <span>Offline - Will sync when connected</span>
                </div>
              )}
            </div>
            
            {online && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onViewQueue}
                >
                  <Database className="h-4 w-4 mr-2" />
                  View Queue
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSync}
                  disabled={isSyncing || pendingTransactions.length === 0}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
