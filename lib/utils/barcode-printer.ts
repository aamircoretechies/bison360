/**
 * Barcode Printing Utility
 * Handles printing barcode images to connected printers
 */

const BARCODE_IMAGE_BASE_URL = 'https://jaap.live/bison-images/';

/**
 * Print barcode image using browser print dialog
 */
export async function printBarcodeImage(
  barCodeImage: string,
  productName?: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const imageUrl = `${BARCODE_IMAGE_BASE_URL}${barCodeImage}`;
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        reject(new Error('Failed to open print window. Please allow popups for this site.'));
        return;
      }

      // Create print-friendly HTML
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Barcode</title>
            <style>
              @media print {
                body {
                  margin: 0;
                  padding: 20px;
                }
                @page {
                  margin: 0;
                  size: auto;
                }
              }
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
                font-family: Arial, sans-serif;
              }
              .barcode-container {
                text-align: center;
              }
              .barcode-image {
                max-width: 100%;
                height: auto;
                display: block;
                margin: 0 auto;
              }
              .product-name {
                margin-top: 10px;
                font-size: 14px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="barcode-container">
              <img 
                src="${imageUrl}" 
                alt="Barcode" 
                class="barcode-image"
                onload="window.print(); window.onafterprint = function() { window.close(); }"
                onerror="alert('Failed to load barcode image'); window.close();"
              />
              ${productName ? `<div class="product-name">${productName}</div>` : ''}
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();

      // Focus the window
      printWindow.focus();

      // Auto-close after print or if user cancels
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
        }
        resolve();
      }, 10000); // Close after 10 seconds if still open

    } catch (error: any) {
      reject(error);
    }
  });
}

/**
 * Print barcode image directly (for USB/Serial printers using WebUSB/WebSerial)
 * This is a placeholder for future implementation with direct printer communication
 */
export async function printBarcodeDirect(
  barCodeImage: string,
  device: any, // USBDevice | SerialPort - using any to avoid TypeScript errors
  method: 'webusb' | 'webserial'
): Promise<void> {
  // TODO: Implement direct printing via WebUSB/WebSerial
  // This requires printer-specific ZPL/EPL commands
  // For now, fallback to browser print
  throw new Error('Direct printing not yet implemented. Using browser print instead.');
}

