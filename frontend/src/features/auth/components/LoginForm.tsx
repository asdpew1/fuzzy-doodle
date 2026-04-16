import { type FormEvent, useState } from 'react';
import { AxiosError } from 'axios';
import { useLogin } from '../hooks/useLogin';
import type { ErrorResponse } from '../../../types/api';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  }

  const errorMessage = loginMutation.error instanceof AxiosError
    ? (loginMutation.error.response?.data as ErrorResponse | undefined)?.error
      ?? 'Login failed'
    : null;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      <div className={styles.fieldGroup}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className={styles.submitButton}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
