'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import StockLevelService from '@/lib/api/stock-level-service';

interface AdjustStockQuantityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockLevelId: number | null;
  currentQuantity?: number;
}

export default function AdjustStockQuantityDialog({ open, onOpenChange, stockLevelId, currentQuantity }: AdjustStockQuantityDialogProps) {
  const [qty, setQty] = useState<number>(currentQuantity ?? 0);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setQty(currentQuantity ?? 0);
    }
  }, [open, currentQuantity]);

  const handleSave = async () => {
    if (!stockLevelId) return;
    setIsSaving(true);
    try {
      const res = await StockLevelService.update({ stock_level_id: stockLevelId, quantity: qty });
      toast.success(res.message || 'Quantity updated');
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['stock-level'] });
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update quantity');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Quantity</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="qty">Edit Quantity</Label>
          <Input id="qty" type="number" value={qty} onChange={(e) => setQty(parseInt(e.target.value) || 0)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


