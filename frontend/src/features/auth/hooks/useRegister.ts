import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { register } from '../../../api/auth';
import type {
  RegistrationRequest,
  ValidationErrorResponse,
  ErrorResponse,
} from '../../../types/api';

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegistrationRequest) => register(data),
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error: AxiosError<ValidationErrorResponse | ErrorResponse>) => error,
  });
}
