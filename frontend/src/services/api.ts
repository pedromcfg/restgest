import axios from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const comidasAPI = {
  getAll: () => api.get('/comidas'),
  getById: (id: string) => api.get(`/comidas/${id}`),
  create: (data: FormData) => api.post('/comidas', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: string, data: FormData) => api.put(`/comidas/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: string) => api.delete(`/comidas/${id}`),
};

export const bebidasAPI = {
  getAll: () => api.get('/bebidas'),
  getById: (id: string) => api.get(`/bebidas/${id}`),
  create: (data: FormData) => api.post('/bebidas', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: string, data: FormData) => api.put(`/bebidas/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: string) => api.delete(`/bebidas/${id}`),
};

export const materialSalaAPI = {
  getAll: () => api.get('/material-sala'),
  getById: (id: string) => api.get(`/material-sala/${id}`),
  create: (data: FormData) => api.post('/material-sala', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: string, data: FormData) => api.put(`/material-sala/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: string) => api.delete(`/material-sala/${id}`),
};

export const studentsAPI = {
  getAll: () => api.get('/students'),
  getByTurma: (turma: string) => api.get(`/students/turma/${turma}`),
  getById: (id: string) => api.get(`/students/${id}`),
  create: (data: any) => api.post('/students', data),
  update: (id: string, data: any) => api.put(`/students/${id}`, data),
  delete: (id: string) => api.delete(`/students/${id}`),
};

export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id: string) => api.get(`/services/${id}`),
  create: (data: any) => api.post('/services', data),
  update: (id: string, data: any) => api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
};

export const quebrasAPI = {
  getAll: () => api.get('/quebras'),
  getById: (id: string) => api.get(`/quebras/${id}`),
  create: (data: any) => api.post('/quebras', data),
  delete: (id: string) => api.delete(`/quebras/${id}`),
};

export default api;
