import apiClient from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  RegistrationResponse,
} from '../types/api';

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/login', data);
  return response.data;
}

export async function register(data: RegistrationRequest): Promise<RegistrationResponse> {
  const response = await apiClient.post<RegistrationResponse>('/register', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.get('/logout');
}
