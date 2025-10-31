import { API_CONFIG, API_MODULES } from './config';
import {
  RolesRequest,
  RolesResponse,
  RoleCreateRequest,
  RoleCreateResponse,
  RoleUpdateRequest,
  RoleUpdateResponse,
  RoleDeleteRequest,
  RoleDeleteResponse,
} from './types';
import SharedPreferences from '@/lib/shared-preferences';

const BASE_URL = API_CONFIG.BASE_URLS.DEVELOPMENT;

export class RolesService {
  static async getAll(params: RolesRequest): Promise<RolesResponse> {
    const url = `${BASE_URL}/${API_MODULES.ROLES.GET_ALL}`;
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
      throw new Error(data?.message || 'Failed to fetch roles');
    }
    return data as RolesResponse;
  }

  static async create(payload: RoleCreateRequest): Promise<RoleCreateResponse> {
    const url = `${BASE_URL}/${API_MODULES.ROLES.CREATE}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    formData.append('role_name', payload.role_name);
    formData.append('role_slug', payload.role_slug);
    formData.append('role_description', payload.role_description);
    formData.append('role_permissions_id', payload.role_permissions_id);

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
      throw new Error(data?.message || 'Failed to create role');
    }
    return data as RoleCreateResponse;
  }

  static async update(payload: RoleUpdateRequest): Promise<RoleUpdateResponse> {
    const url = `${BASE_URL}/${API_MODULES.ROLES.UPDATE}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    formData.append('role_id', String(payload.role_id));
    if (payload.role_name !== undefined) formData.append('role_name', payload.role_name);
    if (payload.role_slug !== undefined) formData.append('role_slug', payload.role_slug);
    if (payload.role_description !== undefined) formData.append('role_description', payload.role_description);
    if (payload.role_permissions_id !== undefined) formData.append('role_permissions_id', payload.role_permissions_id);

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
      throw new Error(data?.message || 'Failed to update role');
    }
    return data as RoleUpdateResponse;
  }

  static async delete(payload: RoleDeleteRequest): Promise<RoleDeleteResponse> {
    const url = `${BASE_URL}/${API_MODULES.ROLES.DELETE}`;
    const token = SharedPreferences.getBearerToken();
    const formData = new FormData();
    formData.append('role_ids', payload.role_ids);

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
      throw new Error(data?.message || 'Failed to delete role');
    }
    return data as RoleDeleteResponse;
  }
}

export default RolesService;

