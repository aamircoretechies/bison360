import { API_CONFIG, API_MODULES } from './config';
import {
  BarcodesRequest,
  BarcodesResponse,
  BarcodeCreateRequest,
  BarcodeCreateResponse,
  BarcodeUpdateRequest,
  BarcodeUpdateResponse,
  BarcodeAdjustQuantityRequest,
  BarcodeAdjustQuantityResponse,
  BarcodeSetPrintStatusRequest,
  BarcodeSetPrintStatusResponse,
  BarcodeDeleteRequest,
  BarcodeDeleteResponse,
} from './types';
import SharedPreferences from '@/lib/shared-preferences';

const BASE_URL = API_CONFIG.BASE_URLS.DEVELOPMENT;

export class BarcodeService {
  static async getAll(params: BarcodesRequest): Promise<BarcodesResponse> {
    const url = `${BASE_URL}/${API_MODULES.BARCODES.GET_ALL}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    if (params.page !== undefined) formData.append('page', String(params.page));
    if (params.size !== undefined) formData.append('size', String(params.size));
    if (params.search) formData.append('search', params.search);
    if (params.status !== undefined) formData.append('status', String(params.status));
    if (params.sort_by) formData.append('sort_by', params.sort_by);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to fetch barcodes');
    }
    return data as BarcodesResponse;
  }

  static async create(payload: BarcodeCreateRequest): Promise<BarcodeCreateResponse> {
    const url = `${BASE_URL}/${API_MODULES.BARCODES.CREATE}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    formData.append('sku_code', payload.sku_code);
    formData.append('product_name', payload.product_name);
    formData.append('batch_number', payload.batch_number);
    formData.append('location', payload.location);
    formData.append('expiry_date', payload.expiry_date);
    formData.append('status', String(payload.status));
    formData.append('bar_code_status', String(payload.bar_code_status));
    formData.append('quantity', String(payload.quantity));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to create barcode');
    }
    return data as BarcodeCreateResponse;
  }

  static async update(payload: BarcodeUpdateRequest): Promise<BarcodeUpdateResponse> {
    const url = `${BASE_URL}/${API_MODULES.BARCODES.UPDATE}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    formData.append('bar_code_id', String(payload.bar_code_id));
    if (payload.sku_code !== undefined) formData.append('sku_code', payload.sku_code);
    if (payload.product_name !== undefined) formData.append('product_name', payload.product_name);
    if (payload.batch_number !== undefined) formData.append('batch_number', payload.batch_number);
    if (payload.location !== undefined) formData.append('location', payload.location);
    if (payload.expiry_date !== undefined) formData.append('expiry_date', payload.expiry_date);
    if (payload.status !== undefined) formData.append('status', String(payload.status));
    if (payload.bar_code_status !== undefined) formData.append('bar_code_status', String(payload.bar_code_status));
    if (payload.quantity !== undefined) formData.append('quantity', String(payload.quantity));

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to update barcode');
    }
    return data as BarcodeUpdateResponse;
  }

  static async adjustQuantity(payload: BarcodeAdjustQuantityRequest): Promise<BarcodeAdjustQuantityResponse> {
    const url = `${BASE_URL}/${API_MODULES.BARCODES.ADJUST_QUANTITY}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    formData.append('bar_code_id', String(payload.bar_code_id));
    formData.append('quantity_adjustment', String(payload.quantity_adjustment));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to adjust quantity');
    }
    return data as BarcodeAdjustQuantityResponse;
  }

  static async setPrintStatus(payload: BarcodeSetPrintStatusRequest): Promise<BarcodeSetPrintStatusResponse> {
    const url = `${BASE_URL}/${API_MODULES.BARCODES.SET_PRINT_STATUS}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    formData.append('bar_code_id', String(payload.bar_code_id));
    formData.append('print_status', String(payload.print_status));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to set print status');
    }
    return data as BarcodeSetPrintStatusResponse;
  }

  static async delete(payload: BarcodeDeleteRequest): Promise<BarcodeDeleteResponse> {
    const url = `${BASE_URL}/${API_MODULES.BARCODES.DELETE}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    formData.append('bar_code_ids', payload.bar_code_ids);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to delete barcode');
    }
    return data as BarcodeDeleteResponse;
  }

  // Helper methods for status mapping
  static mapStatusToNumber(status: string): number {
    switch (status) {
      case 'Active': return 1;
      case 'Expiring Soon': return 2;
      case 'Out of Stock': return 3;
      case 'Low Stock': return 4;
      default: return 1;
    }
  }

  static mapStatusToLabel(status: number): string {
    switch (status) {
      case 1: return 'Active';
      case 2: return 'Expiring Soon';
      case 3: return 'Out of Stock';
      case 4: return 'Low Stock';
      default: return 'Active';
    }
  }

  static mapBarcodeStatusToNumber(status: string): number {
    switch (status) {
      case 'Print Active': return 1;
      case 'Print Pending': return 2;
      case 'Printed': return 3;
      case 'Print Error': return 4;
      default: return 1;
    }
  }

  static mapBarcodeStatusToLabel(status: number): string {
    switch (status) {
      case 1: return 'Print Active';
      case 2: return 'Print Pending';
      case 3: return 'Printed';
      case 4: return 'Print Error';
      default: return 'Print Active';
    }
  }
}

export default BarcodeService;

