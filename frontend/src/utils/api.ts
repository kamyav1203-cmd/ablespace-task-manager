import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token into header if it exists in localStorage
if (typeof window !== 'undefined') {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
}

export interface Project {
  id: string;
  name: string;
  priority: string;
  leadId?: string;
  lead?: User;
  dueDate?: string;
  tasks?: Task[];
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: string; // 'To Do' | 'Doing' | 'Completed' | 'On Hold'
  priority: string; // 'No Priority' | 'Low' | 'Medium' | 'High' | 'Urgent'
  dueDate?: string;
  assigneeId?: string;
  assignee?: User;
  projectId?: string;
  project?: Project;
  labels?: string[];
  parentTaskId?: string;
  subtasks?: Task[];
}

export const authApi = {
  guestLogin: async () => {
    const res = await api.post<{ user: User; accessToken: string }>('/auth/guest-login');
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('currentUser', JSON.stringify(res.data.user));
    }
    return res.data;
  },
};

export const projectsApi = {
  getAll: async () => {
    const res = await api.get<Project[]>('/projects');
    return res.data;
  },
  getOne: async (id: string) => {
    const res = await api.get<Project>(`/projects/${id}`);
    return res.data;
  },
  create: async (data: Partial<Project>) => {
    const res = await api.post<Project>('/projects', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Project>) => {
    const res = await api.put<Project>(`/projects/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },
};

export const tasksApi = {
  getAll: async (filters: {
    projectId?: string;
    status?: string;
    search?: string;
    excludeSubtasks?: boolean;
    parentTaskId?: string;
  } = {}) => {
    const params = new URLSearchParams();
    if (filters.projectId) params.append('projectId', filters.projectId);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.excludeSubtasks !== undefined) {
      params.append('excludeSubtasks', String(filters.excludeSubtasks));
    }
    if (filters.parentTaskId) params.append('parentTaskId', filters.parentTaskId);

    const res = await api.get<Task[]>(`/tasks?${params.toString()}`);
    return res.data;
  },
  getOne: async (id: string) => {
    const res = await api.get<Task>(`/tasks/${id}`);
    return res.data;
  },
  create: async (data: Partial<Task>) => {
    const res = await api.post<Task>('/tasks', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Task>) => {
    const res = await api.put<Task>(`/tasks/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
};

export const usersApi = {
  getAll: async () => {
    const res = await api.get<User[]>('/users');
    return res.data;
  },
};

export default api;
