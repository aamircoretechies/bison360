import { API_CONFIG, API_MODULES } from './config';
import {
  SkuBatchesRequest,
  SkuBatchesResponse,
  SkuCreateRequest,
  SkuCreateResponse,
  SkuUpdateRequest,
  SkuUpdateResponse,
  SkuDeleteRequest,
  SkuDeleteResponse,
} from './types';
import SharedPreferences from '@/lib/shared-preferences';

const BASE_URL = API_CONFIG.BASE_URLS.DEVELOPMENT;

export class SkuBatchesService {
  static async getAll(params: SkuBatchesRequest): Promise<SkuBatchesResponse> {
    const url = `${BASE_URL}/${API_MODULES.SKU_BATCHES.GET_ALL}`;
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
      throw new Error(data?.message || 'Failed to fetch SKU batches');
    }
    return data as SkuBatchesResponse;
  }

  static async create(payload: SkuCreateRequest): Promise<SkuCreateResponse> {
    const url = `${BASE_URL}/${API_MODULES.SKU_BATCHES.CREATE}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    formData.append('product_name', payload.product_name);
    formData.append('batch_number', payload.batch_number);
    formData.append('quantity', String(payload.quantity));
    formData.append('shelf', payload.shelf);
    formData.append('expiry_date', payload.expiry_date);
    formData.append('status', String(payload.status));
    formData.append('sku_code', payload.sku_code);

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
      throw new Error(data?.message || 'Failed to create SKU batch');
    }
    return data as SkuCreateResponse;
  }

  static async update(payload: SkuUpdateRequest): Promise<SkuUpdateResponse> {
    const url = `${BASE_URL}/${API_MODULES.SKU_BATCHES.UPDATE}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    formData.append('sku_batch_id', String(payload.sku_batch_id));
    if (payload.product_name !== undefined) formData.append('product_name', payload.product_name);
    if (payload.batch_number !== undefined) formData.append('batch_number', payload.batch_number);
    if (payload.quantity !== undefined) formData.append('quantity', String(payload.quantity));
    if (payload.shelf !== undefined) formData.append('shelf', payload.shelf);
    if (payload.expiry_date !== undefined) formData.append('expiry_date', payload.expiry_date);
    if (payload.status !== undefined) formData.append('status', String(payload.status));
    if (payload.sku_code !== undefined) formData.append('sku_code', String(payload.sku_code));

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
      throw new Error(data?.message || 'Failed to update SKU batch');
    }
    return data as SkuUpdateResponse;
  }

  static async delete(payload: SkuDeleteRequest): Promise<SkuDeleteResponse> {
    const url = `${BASE_URL}/${API_MODULES.SKU_BATCHES.DELETE}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    formData.append('sku_batch_ids', payload.sku_batch_ids);

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
      throw new Error(data?.message || 'Failed to delete SKU batch');
    }
    return data as SkuDeleteResponse;
  }
}

export default SkuBatchesService;


