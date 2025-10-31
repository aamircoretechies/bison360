'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import BarcodeService from '@/lib/api/barcode-service';

interface AdjustBarcodeQuantityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barCodeId: number;
  currentQuantity: number;
}

export function AdjustBarcodeQuantityDialog({ 
  open, 
  onOpenChange, 
  barCodeId, 
  currentQuantity 
}: AdjustBarcodeQuantityDialogProps) {
  const [quantityAdjustment, setQuantityAdjustment] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setQuantityAdjustment(currentQuantity);
    }
  }, [open, currentQuantity]);

  const handleSave = async () => {
    if (!barCodeId) return;
    setIsSaving(true);
    try {
      // quantity_adjustment is the new total quantity (not a delta)
      const res = await BarcodeService.adjustQuantity({ 
        bar_code_id: barCodeId, 
        quantity_adjustment: quantityAdjustment 
      });
      if (res.status === 0) {
        alert(res.message || 'Failed to adjust quantity');
        return;
      }
      toast.success(res.message || 'Quantity adjusted successfully');
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['barcodes'] });
    } catch (e: any) {
      toast.error(e?.message || 'Failed to adjust quantity');
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
          <Input 
            id="qty" 
            type="number" 
            value={quantityAdjustment} 
            onChange={(e) => setQuantityAdjustment(parseInt(e.target.value) || 0)} 
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

