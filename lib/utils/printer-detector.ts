/**
 * Printer Detection Utility
 * Detects barcode printer connectivity using multiple methods:
 * - WebUSB API (for USB printers)
 * - Web Serial API (for serial/USB-to-serial printers)
 * - Network printer detection (via fetch)
 * - Browser print API fallback
 */

export interface PrinterDetectionResult {
  isConnected: boolean;
  method?: 'webusb' | 'webserial' | 'network' | 'browser';
  device?: any; // USBDevice | SerialPort - using any to avoid TypeScript errors
  error?: string;
  printerName?: string;
}

export interface PrinterDetectionOptions {
  timeout?: number; // Detection timeout in milliseconds
  networkPrinterUrls?: string[]; // Optional network printer URLs to check
  usbVendorIds?: number[]; // USB vendor IDs for barcode printers (common ones)
}

/**
 * Common USB Vendor IDs for popular barcode printers
 */
const COMMON_BARCODE_PRINTER_VENDOR_IDS = [
  0x0a5f, // Zebra Technologies
  0x04f9, // Brother
  0x03f0, // HP
  0x04b8, // Epson
  0x0483, // Generic USB serial devices
];

/**
 * Detect printer connection using WebUSB API
 */
async function detectWebUSBPrinter(
  vendorIds: number[] = COMMON_BARCODE_PRINTER_VENDOR_IDS,
  timeout: number = 3000
): Promise<PrinterDetectionResult> {
  try {
    // Check if WebUSB is supported
    if (!navigator.usb || !navigator.usb.getDevices) {
      return {
        isConnected: false,
        error: 'WebUSB API is not supported in this browser',
      };
    }

      // Try to get already connected devices
      const devices = await Promise.race([
        navigator.usb.getDevices(),
        new Promise<any[]>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ]);

    // Filter devices by vendor IDs
    const printerDevices = devices.filter((device) =>
      vendorIds.includes(device.vendorId)
    );

    if (printerDevices.length > 0) {
      return {
        isConnected: true,
        method: 'webusb',
        device: printerDevices[0],
        printerName: printerDevices[0].productName || 'USB Barcode Printer',
      };
    }

    // Try to request device access (will prompt user)
    try {
      const device = await Promise.race([
        navigator.usb.requestDevice({
          filters: vendorIds.map((vid) => ({ vendorId: vid })),
        }),
        new Promise<any>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ]);

      if (device) {
        return {
          isConnected: true,
          method: 'webusb',
          device,
          printerName: device.productName || 'USB Barcode Printer',
        };
      }
    } catch (error: any) {
      // User cancelled or no device found
      if (error.name === 'NotFoundError' || error.message === 'Timeout') {
        return {
          isConnected: false,
          error: 'No USB barcode printer found. Please connect your printer and try again.',
        };
      }
    }

    return {
      isConnected: false,
      error: 'No USB barcode printer detected',
    };
  } catch (error: any) {
    return {
      isConnected: false,
      error: error.message || 'Failed to detect USB printer',
    };
  }
}

/**
 * Detect printer connection using Web Serial API
 */
async function detectWebSerialPrinter(
  timeout: number = 3000
): Promise<PrinterDetectionResult> {
  try {
    // Check if Web Serial is supported
    if (!navigator.serial || !navigator.serial.getPorts) {
      return {
        isConnected: false,
        error: 'Web Serial API is not supported in this browser',
      };
    }

    // Try to get already connected ports
    const ports = await Promise.race([
      navigator.serial.getPorts(),
      new Promise<any[]>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout)
      ),
    ]);

    if (ports.length > 0) {
      return {
        isConnected: true,
        method: 'webserial',
        device: ports[0],
        printerName: 'Serial Barcode Printer',
      };
    }

    // Try to request port access (will prompt user)
    try {
      const port = await Promise.race([
        navigator.serial.requestPort(),
        new Promise<any>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ]);

      if (port) {
        return {
          isConnected: true,
          method: 'webserial',
          device: port,
          printerName: 'Serial Barcode Printer',
        };
      }
    } catch (error: any) {
      // User cancelled or no port found
      if (error.name === 'NotFoundError' || error.message === 'Timeout') {
        return {
          isConnected: false,
          error: 'No serial barcode printer found. Please connect your printer and try again.',
        };
      }
    }

    return {
      isConnected: false,
      error: 'No serial barcode printer detected',
    };
  } catch (error: any) {
    return {
      isConnected: false,
      error: error.message || 'Failed to detect serial printer',
    };
  }
}

/**
 * Detect network printer (basic connectivity check)
 */
async function detectNetworkPrinter(
  urls: string[] = [],
  timeout: number = 3000
): Promise<PrinterDetectionResult> {
  if (urls.length === 0) {
    return {
      isConnected: false,
      error: 'No network printer URLs configured',
    };
  }

  // Try to ping network printer URLs
  const checkPromises = urls.map(async (url) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return true;
    } catch {
      return false;
    }
  });

  const results = await Promise.all(checkPromises);
  const isConnected = results.some((result) => result === true);

  if (isConnected) {
    return {
      isConnected: true,
      method: 'network',
      printerName: 'Network Barcode Printer',
    };
  }

  return {
    isConnected: false,
    error: 'Network printer not reachable',
  };
}

/**
 * Check if browser print API is available (fallback)
 */
function checkBrowserPrint(): PrinterDetectionResult {
  // Browser print API is always available, but we can't detect specific printer
  // This is a fallback method
  return {
    isConnected: true,
    method: 'browser',
    printerName: 'System Printer (Browser)',
  };
}

/**
 * Main printer detection function
 * Tries multiple methods to detect printer connection
 */
export async function detectPrinter(
  options: PrinterDetectionOptions = {}
): Promise<PrinterDetectionResult> {
  const {
    timeout = 3000,
    networkPrinterUrls = [],
    usbVendorIds = COMMON_BARCODE_PRINTER_VENDOR_IDS,
  } = options;

  // Method 1: Try WebUSB (for USB barcode printers)
  try {
    const usbResult = await detectWebUSBPrinter(usbVendorIds, timeout);
    if (usbResult.isConnected) {
      return usbResult;
    }
  } catch (error) {
    // Continue to next method
  }

  // Method 2: Try Web Serial (for serial/USB-to-serial printers)
  try {
    const serialResult = await detectWebSerialPrinter(timeout);
    if (serialResult.isConnected) {
      return serialResult;
    }
  } catch (error) {
    // Continue to next method
  }

  // Method 3: Try Network Printer (if URLs provided)
  if (networkPrinterUrls.length > 0) {
    try {
      const networkResult = await detectNetworkPrinter(networkPrinterUrls, timeout);
      if (networkResult.isConnected) {
        return networkResult;
      }
    } catch (error) {
      // Continue to fallback
    }
  }

  // Method 4: Browser print fallback
  // Note: Browser print doesn't guarantee a printer is connected
  // It's only available as a manual fallback option
  // For automatic detection, we consider this as "not connected"
  return {
    isConnected: false,
    method: 'browser',
    error: 'No barcode printer detected. Please connect your printer via USB, serial, or network. You can still use browser print manually after connecting.',
  };
}

/**
 * Quick printer availability check (non-blocking, doesn't request permissions)
 */
export async function quickPrinterCheck(): Promise<boolean> {
  try {
    // Check for already connected devices without requesting new ones
    if (navigator.usb && navigator.usb.getDevices) {
      const devices = await navigator.usb.getDevices();
      if (devices.length > 0) {
        const printerDevices = devices.filter((device) =>
          COMMON_BARCODE_PRINTER_VENDOR_IDS.includes(device.vendorId)
        );
        if (printerDevices.length > 0) return true;
      }
    }

    if (navigator.serial && navigator.serial.getPorts) {
      const ports = await navigator.serial.getPorts();
      if (ports.length > 0) return true;
    }

    // Browser print is always available as fallback
    return true;
  } catch {
    // If all methods fail, browser print is still available
    return true;
  }
}

