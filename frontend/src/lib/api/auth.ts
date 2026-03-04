import { api } from './client';
import type { User } from '@/types';

interface AuthResponse {
  success: boolean;
  user: User;
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/login', { email, password });
}

export async function registerApi(name: string, email: string, password: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/register', { name, email, password });
}

export async function logoutApi(): Promise<{ success: boolean }> {
  return api.post('/auth/logout');
}

export async function getMeApi(): Promise<AuthResponse> {
  return api.get<AuthResponse>('/auth/me');
}
