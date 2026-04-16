import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProtectedRoute from './ProtectedRoute';

const mockUseAuthContext = vi.fn();

vi.mock('../features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

function renderWithRouter(isAuthenticated: boolean) {
  mockUseAuthContext.mockReturnValue({
    user: isAuthenticated ? { id: 1, email: 'test@example.com' } : null,
    setUser: vi.fn(),
    handleLogout: vi.fn(),
  });

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div>Protected content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', () => {
    renderWithRouter(true);
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    renderWithRouter(false);
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});
