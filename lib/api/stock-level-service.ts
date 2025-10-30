import { API_CONFIG, API_MODULES } from './config';
import {
  StockLevelRequest,
  StockLevelResponse,
  StockCreateRequest,
  StockCreateResponse,
  StockUpdateRequest,
  StockUpdateResponse,
  StockDeleteRequest,
  StockDeleteResponse,
} from './types';
import SharedPreferences from '@/lib/shared-preferences';

const BASE_URL = API_CONFIG.BASE_URLS.DEVELOPMENT;

export class StockLevelService {
  static async getAll(params: StockLevelRequest): Promise<StockLevelResponse> {
    const url = `${BASE_URL}/${API_MODULES.STOCK_LEVEL.GET_ALL}`;
    const token = SharedPreferences.getBearerToken();
    const form = new FormData();
    if (params.page !== undefined) form.append('page', String(params.page));
    if (params.size !== undefined) form.append('size', String(params.size));
    if (params.search) form.append('search', params.search);
    if (params.status !== undefined) form.append('status', String(params.status));
    if (params.sort_by) form.append('sort_by', params.sort_by);

    const res = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Failed to fetch stock levels');
    return data as StockLevelResponse;
  }

  static async create(payload: StockCreateRequest): Promise<StockCreateResponse> {
    const url = `${BASE_URL}/${API_MODULES.STOCK_LEVEL.CREATE}`;
    const token = SharedPreferences.getBearerToken();
    const form = new FormData();
    form.append('sku_code', payload.sku_code);
    form.append('product_name', payload.product_name);
    form.append('batch_number', payload.batch_number);
    form.append('quantity', String(payload.quantity));
    form.append('location', payload.location);
    form.append('expiry_date', payload.expiry_date);
    form.append('status', String(payload.status));

    const res = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Failed to create stock level');
    return data as StockCreateResponse;
  }

  static async update(payload: StockUpdateRequest): Promise<StockUpdateResponse> {
    const url = `${BASE_URL}/${API_MODULES.STOCK_LEVEL.UPDATE}`;
    const token = SharedPreferences.getBearerToken();
    const form = new FormData();
    form.append('stock_level_id', String(payload.stock_level_id));
    if (payload.sku_code !== undefined) form.append('sku_code', payload.sku_code);
    if (payload.product_name !== undefined) form.append('product_name', payload.product_name);
    if (payload.batch_number !== undefined) form.append('batch_number', payload.batch_number);
    if (payload.quantity !== undefined) form.append('quantity', String(payload.quantity));
    if (payload.location !== undefined) form.append('location', payload.location);
    if (payload.expiry_date !== undefined) form.append('expiry_date', payload.expiry_date);
    if (payload.status !== undefined) form.append('status', String(payload.status));

    const res = await fetch(url, {
      method: 'PUT',
      headers: { Accept: 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Failed to update stock level');
    return data as StockUpdateResponse;
  }

  static async delete(payload: StockDeleteRequest): Promise<StockDeleteResponse> {
    const url = `${BASE_URL}/${API_MODULES.STOCK_LEVEL.DELETE}`;
    const token = SharedPreferences.getBearerToken();
    const form = new FormData();
    form.append('stock_level_ids', payload.stock_level_ids);

    const res = await fetch(url, {
      method: 'DELETE',
      headers: { Accept: 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Failed to delete stock level');
    return data as StockDeleteResponse;
  }
}

export default StockLevelService;


