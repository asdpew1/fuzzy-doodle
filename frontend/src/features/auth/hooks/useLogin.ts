import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { login } from '../../../api/auth';
import { useAuthContext } from '../context/AuthContext';
import type { LoginRequest, ErrorResponse } from '../../../types/api';

export function useLogin() {
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      setUser(data);
      navigate('/dashboard');
    },
    onError: (error: AxiosError<ErrorResponse>) => error,
  });
}
