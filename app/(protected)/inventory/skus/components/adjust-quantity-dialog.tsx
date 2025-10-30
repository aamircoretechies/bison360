'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import SkuBatchesService from '@/lib/api/sku-batches-service';
import { useQueryClient } from '@tanstack/react-query';

interface AdjustQuantityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skuBatchId: number | null;
  currentQuantity?: number;
}

export default function AdjustQuantityDialog({ open, onOpenChange, skuBatchId, currentQuantity }: AdjustQuantityDialogProps) {
  const [qty, setQty] = useState<number>(currentQuantity ?? 0);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setQty(currentQuantity ?? 0);
    }
  }, [open, currentQuantity]);

  const handleSave = async () => {
    if (!skuBatchId) return;
    setIsSaving(true);
    try {
      const res = await SkuBatchesService.update({ sku_batch_id: skuBatchId, quantity: qty });
      toast.success(res.message || 'Quantity updated');
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['sku-batches'] });
      // let listing react-query refetch externally
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


