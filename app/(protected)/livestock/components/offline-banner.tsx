'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export interface PendingRecord {
  id: string;
  type: string;
  status: 'queued' | 'synced' | 'failed';
}

interface OfflineBannerProps {
  queue: PendingRecord[];
  onSync?: () => Promise<void> | void;
}

export function OfflineBanner({ queue, onSync }: OfflineBannerProps) {
  const [online, setOnline] = useState<boolean>(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (online && queue.length === 0) return null;

  return (
    <Alert variant="mono">
      <AlertTitle>
        {online ? 'Pending sync items' : 'Offline mode'} ({queue.length})
      </AlertTitle>
      <AlertDescription>
        {online ? 'Some records are pending sync.' : 'You are offline. New records will be saved locally and synced when back online.'}
      </AlertDescription>
      <div className="mt-2 flex items-center gap-2">
        <Button size="sm" onClick={() => onSync?.()}>Sync now</Button>
      </div>
      {queue.length > 0 && (
        <div className="mt-3 space-y-1 text-xs">
          {queue.map((r) => (
            <div key={r.id} className="flex items-center justify-between">
              <span>#{r.id} – {r.type}</span>
              <span className={r.status === 'synced' ? 'text-success' : r.status === 'failed' ? 'text-destructive' : 'text-muted-foreground'}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </Alert>
  );
} 