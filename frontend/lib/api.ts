import axios from 'axios';

const BASE_URL = `${process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000'}/api/v1`;
console.log(BASE_URL);
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  client_id: string;
  time: string;
  notes?: string;
  status: AppointmentStatus;
  client?: Client;
}

export interface AppointmentFilters {
  search?: string;
  start_date?: string;
  end_date?: string;
  status?: AppointmentStatus;
}

export interface ClientFilters {
  search?: string;
}

export const clientsApi = {
  getAll: async (filters?: ClientFilters & { page?: number, page_size?: number }) => {
    const response = await api.get<PaginatedResponse<Client>>('/clients/', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Client>(`/clients/${id}/`);
    return response.data;
  },

  create: async (data: Omit<Client, 'id' | 'updated_at'>) => {
    const response = await api.post<Client>('/clients/', data);
    return response.data;
  },
};

export const appointmentsApi = {
  getAll: async (filters?: AppointmentFilters & { page?: number, page_size?: number }) => {
    const response = await api.get<PaginatedResponse<Appointment>>('/appointments/', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Appointment>(`/appointments/${id}/`);
    return response.data;
  },

  create: async (data: Omit<Appointment, 'id'>) => {
    const response = await api.post<Appointment>('/appointments/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Appointment>) => {
    const response = await api.put<Appointment>(`/appointments/${id}/`, data);
    return response.data;
  },
}; 