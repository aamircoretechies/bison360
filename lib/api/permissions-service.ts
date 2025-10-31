import { API_CONFIG, API_MODULES } from './config';
import {
  PermissionsRequest,
  PermissionsResponse,
  PermissionCreateRequest,
  PermissionCreateResponse,
  PermissionUpdateRequest,
  PermissionUpdateResponse,
  PermissionDeleteRequest,
  PermissionDeleteResponse,
} from './types';
import SharedPreferences from '@/lib/shared-preferences';

const BASE_URL = API_CONFIG.BASE_URLS.DEVELOPMENT;

export class PermissionsService {
  static async getAll(params: PermissionsRequest): Promise<PermissionsResponse> {
    const url = `${BASE_URL}/${API_MODULES.PERMISSIONS.GET_ALL}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    if (params.page !== undefined) formData.append('page', String(params.page));
    if (params.size !== undefined) formData.append('size', String(params.size));
    if (params.search) formData.append('search', params.search);
    if (params.user_role !== undefined) formData.append('user_role', String(params.user_role));
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
      throw new Error(data?.message || 'Failed to fetch permissions');
    }
    return data as PermissionsResponse;
  }

  static async create(payload: PermissionCreateRequest): Promise<PermissionCreateResponse> {
    const url = `${BASE_URL}/${API_MODULES.PERMISSIONS.CREATE}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    formData.append('permission_name', payload.permission_name);
    formData.append('permission_code', String(payload.permission_code));
    formData.append('permission_slug', payload.permission_slug);
    formData.append('permission_description', payload.permission_description);
    formData.append('user_role', String(payload.user_role));

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
      throw new Error(data?.message || 'Failed to create permission');
    }
    return data as PermissionCreateResponse;
  }

  static async update(payload: PermissionUpdateRequest): Promise<PermissionUpdateResponse> {
    const url = `${BASE_URL}/${API_MODULES.PERMISSIONS.UPDATE}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    formData.append('permissions_id', String(payload.permissions_id));
    if (payload.permission_name !== undefined) formData.append('permission_name', payload.permission_name);
    if (payload.permission_code !== undefined) formData.append('permission_code', String(payload.permission_code));
    if (payload.permission_slug !== undefined) formData.append('permission_slug', payload.permission_slug);
    if (payload.permission_description !== undefined) formData.append('permission_description', payload.permission_description);
    if (payload.user_role !== undefined) formData.append('user_role', String(payload.user_role));

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
      throw new Error(data?.message || 'Failed to update permission');
    }
    return data as PermissionUpdateResponse;
  }

  static async delete(payload: PermissionDeleteRequest): Promise<PermissionDeleteResponse> {
    const url = `${BASE_URL}/${API_MODULES.PERMISSIONS.DELETE}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    formData.append('permissions_ids', payload.permissions_ids);

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
      throw new Error(data?.message || 'Failed to delete permission');
    }
    return data as PermissionDeleteResponse;
  }
}

export default PermissionsService;

