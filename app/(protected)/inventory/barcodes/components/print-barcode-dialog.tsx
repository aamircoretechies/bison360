'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import BarcodeService from '@/lib/api/barcode-service';
import { detectPrinter, type PrinterDetectionResult } from '@/lib/utils/printer-detector';
import { printBarcodeImage } from '@/lib/utils/barcode-printer';

interface PrintBarcodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barCodeId: number;
  barCodeImage?: string;
  productName?: string;
}

type PrintStatus = 'idle' | 'checking' | 'connected' | 'printing' | 'error' | 'success';

export function PrintBarcodeDialog({ 
  open, 
  onOpenChange, 
  barCodeId,
  barCodeImage,
  productName,
}: PrintBarcodeDialogProps) {
  const [status, setStatus] = useState<PrintStatus>('idle');
  const [printerResult, setPrinterResult] = useState<PrinterDetectionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open && barCodeId) {
      handlePrintProcess();
    } else {
      // Reset state when dialog closes
      setStatus('idle');
      setPrinterResult(null);
      setErrorMessage('');
    }
  }, [open, barCodeId]);

  const handlePrintProcess = async () => {
    if (!barCodeId) {
      setErrorMessage('Barcode ID is missing');
      setStatus('error');
      return;
    }

    try {
      // Step 1: Check printer connection
      setStatus('checking');
      setErrorMessage('');

      const detectionResult = await detectPrinter({
        timeout: 5000, // 5 second timeout
      });

      setPrinterResult(detectionResult);

      if (!detectionResult.isConnected) {
        setErrorMessage(
          detectionResult.error || 
          'Barcode printer not found. Please ensure your printer is connected via USB, serial, or network and try again.'
        );
        setStatus('error');
        return;
      }

      // Step 2: Printer is connected, proceed with API call
      setStatus('printing');

      // Call the API to set print status
      const res = await BarcodeService.setPrintStatus({ 
        bar_code_id: barCodeId, 
        print_status: 3 // Always send 3 for Printed
      });

      // Step 3: After API success, print the barcode image
      if (barCodeImage) {
        try {
          await printBarcodeImage(barCodeImage, productName);
          setStatus('success');
          toast.success(res.message || 'Barcode printed successfully');
          
          // Invalidate queries to refresh the list
          queryClient.invalidateQueries({ queryKey: ['barcodes'] });
          
          // Close dialog after 2 seconds on success
          setTimeout(() => {
            onOpenChange(false);
          }, 2000);
        } catch (printError: any) {
          // API succeeded but printing failed
          setErrorMessage(
            printError.message || 
            'Print status updated but failed to print barcode. Please try printing manually.'
          );
          setStatus('error');
          // Still invalidate queries since API succeeded
          queryClient.invalidateQueries({ queryKey: ['barcodes'] });
        }
      } else {
        // No barcode image, but API succeeded
        setStatus('success');
        toast.success(res.message || 'Print status updated successfully');
        queryClient.invalidateQueries({ queryKey: ['barcodes'] });
        
        setTimeout(() => {
          onOpenChange(false);
        }, 2000);
      }

    } catch (apiError: any) {
      // API call failed
      const errorMsg = apiError?.message || 'Failed to update print status';
      setErrorMessage(errorMsg);
      setStatus('error');
      toast.error(errorMsg);
    }
  };

  const handleRetry = () => {
    handlePrintProcess();
  };

  const handleClose = () => {
    if (status !== 'printing' && status !== 'checking') {
      onOpenChange(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
      case 'printing':
        return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-destructive" />;
      default:
        return <Printer className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'idle':
        return 'Preparing to print...';
      case 'checking':
        return 'Checking printer connection...';
      case 'connected':
        return 'Printer connected. Sending print job...';
      case 'printing':
        return 'Barcode printing in progress...';
      case 'success':
        return 'Barcode printed successfully!';
      case 'error':
        return errorMessage || 'An error occurred';
      default:
        return 'Processing...';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Print Barcode</DialogTitle>
          {productName && (
            <DialogDescription>{productName}</DialogDescription>
          )}
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          {getStatusIcon()}
          
          <p className="text-sm text-center text-muted-foreground">
            {getStatusMessage()}
          </p>

          {status === 'checking' && printerResult?.printerName && (
            <p className="text-xs text-center text-muted-foreground">
              Detected: {printerResult.printerName}
            </p>
          )}

          {status === 'error' && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Print Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <Alert className="mt-4 border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                Barcode has been printed successfully.
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <div className="flex flex-col gap-2 mt-4 w-full">
              <div className="flex gap-2">
                <Button onClick={handleRetry} variant="default" size="sm" className="flex-1">
                  Retry
                </Button>
                <Button onClick={handleClose} variant="outline" size="sm" className="flex-1">
                  Close
                </Button>
              </div>
              {printerResult?.method === 'browser' && barCodeImage && (
                <Button 
                  onClick={async () => {
                    try {
                      // Allow manual browser print as last resort
                      await printBarcodeImage(barCodeImage, productName);
                      toast.info('Using browser print. Please select your printer in the print dialog.');
                      // Still update API status manually
                      try {
                        await BarcodeService.setPrintStatus({ 
                          bar_code_id: barCodeId, 
                          print_status: 3 
                        });
                        queryClient.invalidateQueries({ queryKey: ['barcodes'] });
                      } catch (e) {
                        // Silent fail - print succeeded even if API update failed
                      }
                      onOpenChange(false);
                    } catch (e: any) {
                      toast.error(e?.message || 'Failed to open print dialog');
                    }
                  }}
                  variant="secondary" 
                  size="sm" 
                  className="w-full mt-2"
                >
                  Try Browser Print Anyway
                </Button>
              )}
            </div>
          )}

          {(status === 'printing' || status === 'checking') && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Please wait...
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

