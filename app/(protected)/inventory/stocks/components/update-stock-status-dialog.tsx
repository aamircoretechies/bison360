'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import StockLevelService from '@/lib/api/stock-level-service';

interface UpdateStockStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockLevelId: number | null;
  currentStatus?: number; // 1..4
}

const STATUS_OPTIONS = [
  { value: 1, label: 'Active' },
  { value: 2, label: 'Expiring Soon' },
  { value: 3, label: 'Out of Stock' },
  { value: 4, label: 'Low Stock' },
];

export default function UpdateStockStatusDialog({ open, onOpenChange, stockLevelId, currentStatus }: UpdateStockStatusDialogProps) {
  const [status, setStatus] = useState<number>(currentStatus ?? 1);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setStatus(currentStatus ?? 1);
    }
  }, [open, currentStatus]);

  const handleSave = async () => {
    if (!stockLevelId) return;
    setIsSaving(true);
    try {
      const res = await StockLevelService.update({ stock_level_id: stockLevelId, status });
      toast.success(res.message || 'Status updated');
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['stock-level'] });
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update status');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(parseInt(e.target.value) || 1)}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


