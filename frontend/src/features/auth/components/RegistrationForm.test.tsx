import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import RegistrationForm from './RegistrationForm';

vi.mock('../../../api/auth', () => ({
  register: vi.fn(),
  logout: vi.fn(),
}));

import { register } from '../../../api/auth';

const mockedRegister = vi.mocked(register);

function renderRegistrationForm() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <RegistrationForm />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('RegistrationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email, password and confirm password fields', () => {
    renderRegistrationForm();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument();
  });

  it('submits the form with entered values', async () => {
    mockedRegister.mockResolvedValue({ id: 1, email: 'new@example.com' });
    const user = userEvent.setup();
    renderRegistrationForm();

    await user.type(screen.getByLabelText('Email'), 'new@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(mockedRegister).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    });
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderRegistrationForm();

    await user.type(screen.getByLabelText('Email'), 'new@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'different456');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    expect(mockedRegister).not.toHaveBeenCalled();
  });

  it('shows loading state while submitting', async () => {
    mockedRegister.mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    renderRegistrationForm();

    await user.type(screen.getByLabelText('Email'), 'new@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(
      screen.getByRole('button', { name: 'Creating account...' }),
    ).toBeDisabled();
  });

  it('displays field validation errors', async () => {
    const { AxiosError } = await import('axios');
    const error = new AxiosError('Validation failed', '422', undefined, undefined, {
      data: { errors: { email: 'This value is not a valid email address.' } },
      status: 422,
      statusText: 'Unprocessable Entity',
      headers: {},
      config: { headers: {} },
    } as never);
    mockedRegister.mockRejectedValue(error);
    const user = userEvent.setup();
    renderRegistrationForm();

    await user.type(screen.getByLabelText('Email'), 'bad@test.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(
      await screen.findByText('This value is not a valid email address.'),
    ).toBeInTheDocument();
  });

  it('displays password confirmation mismatch error from server', async () => {
    const { AxiosError } = await import('axios');
    const error = new AxiosError('Validation failed', '422', undefined, undefined, {
      data: { errors: { passwordConfirmation: 'Passwords do not match.' } },
      status: 422,
      statusText: 'Unprocessable Entity',
      headers: {},
      config: { headers: {} },
    } as never);
    mockedRegister.mockRejectedValue(error);
    const user = userEvent.setup();
    renderRegistrationForm();

    await user.type(screen.getByLabelText('Email'), 'new@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(
      await screen.findByText('Passwords do not match.'),
    ).toBeInTheDocument();
  });

  it('displays conflict error when email is taken', async () => {
    const { AxiosError } = await import('axios');
    const error = new AxiosError('Conflict', '409', undefined, undefined, {
      data: { error: 'Email already registered' },
      status: 409,
      statusText: 'Conflict',
      headers: {},
      config: { headers: {} },
    } as never);
    mockedRegister.mockRejectedValue(error);
    const user = userEvent.setup();
    renderRegistrationForm();

    await user.type(screen.getByLabelText('Email'), 'existing@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Email already registered')).toBeInTheDocument();
  });
});
