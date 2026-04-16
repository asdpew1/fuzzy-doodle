export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
}

export interface RegistrationRequest {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface RegistrationResponse {
  id: number;
  email: string;
}

export interface AuthUser {
  id: number;
  email: string;
}

export interface ValidationErrorResponse {
  errors: Record<string, string>;
}

export interface ErrorResponse {
  error: string;
}
