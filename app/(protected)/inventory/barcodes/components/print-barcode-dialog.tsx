'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import BarcodeService from '@/lib/api/barcode-service';
import { Loader2 } from 'lucide-react';

interface PrintBarcodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barCodeId: number;
}

export function PrintBarcodeDialog({ 
  open, 
  onOpenChange, 
  barCodeId 
}: PrintBarcodeDialogProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open && barCodeId) {
      handlePrint();
    }
  }, [open, barCodeId]);

  const handlePrint = async () => {
    if (!barCodeId) return;
    setIsPrinting(true);
    
    try {
      // Call the API to set print status
      const res = await BarcodeService.setPrintStatus({ 
        bar_code_id: barCodeId, 
        print_status: 3 // Always send 3 for Printed
      });
      
      // Show loader for 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      toast.success(res.message || 'Print status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['barcodes'] });
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to set print status');
      onOpenChange(false);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Print Barcode</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          {isPrinting ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Barcode printing in progress...</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Preparing to print...</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

