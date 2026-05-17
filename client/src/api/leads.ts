import api from './client';
import type {
  ApiResponse,
  Lead,
  CreateLeadData,
  UpdateLeadData,
  LeadFilters,
} from '../types';

export const leadsApi = {
  getAll: async (filters: LeadFilters): Promise<ApiResponse<{ leads: Lead[] }>> => {
    const params: Record<string, string | number> = {
      page: filters.page,
      limit: filters.limit,
    };

    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.search) params.search = filters.search;
    if (filters.sortBy) params.sortBy = filters.sortBy;

    const response = await api.get<ApiResponse<{ leads: Lead[] }>>('/leads', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<{ lead: Lead }>> => {
    const response = await api.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
    return response.data;
  },

  create: async (data: CreateLeadData): Promise<ApiResponse<{ lead: Lead }>> => {
    const response = await api.post<ApiResponse<{ lead: Lead }>>('/leads', data);
    return response.data;
  },

  update: async (id: string, data: UpdateLeadData): Promise<ApiResponse<{ lead: Lead }>> => {
    const response = await api.put<ApiResponse<{ lead: Lead }>>(`/leads/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/leads/${id}`);
    return response.data;
  },

  exportCSV: async (filters: Omit<LeadFilters, 'page' | 'limit'>): Promise<Blob> => {
    const params: Record<string, string> = {};

    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.search) params.search = filters.search;
    if (filters.sortBy) params.sortBy = filters.sortBy;

    const response = await api.get('/leads/export/csv', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
