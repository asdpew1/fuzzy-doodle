import { type FormEvent, useState } from 'react';
import { AxiosError } from 'axios';
import { useRegister } from '../hooks/useRegister';
import type { ValidationErrorResponse, ErrorResponse } from '../../../types/api';
import styles from './RegistrationForm.module.css';

export default function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const registerMutation = useRegister();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);
    registerMutation.mutate({ email, password, passwordConfirmation });
  }

  let generalError: string | null = null;
  let fieldErrors: Record<string, string> = {};

  if (registerMutation.error instanceof AxiosError) {
    const data = registerMutation.error.response?.data as
      | ValidationErrorResponse
      | ErrorResponse
      | undefined;
    if (data && 'errors' in data) {
      fieldErrors = data.errors;
    } else if (data && 'error' in data) {
      generalError = data.error;
    } else {
      generalError = 'Registration failed';
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {generalError && <div className={styles.error}>{generalError}</div>}
      <div className={styles.fieldGroup}>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {fieldErrors.email && (
          <span className={styles.fieldError}>{fieldErrors.email}</span>
        )}
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        {fieldErrors.password && (
          <span className={styles.fieldError}>{fieldErrors.password}</span>
        )}
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="register-password-confirmation">Confirm password</label>
        <input
          id="register-password-confirmation"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          minLength={8}
        />
        {passwordMismatch && (
          <span className={styles.fieldError}>Passwords do not match.</span>
        )}
        {fieldErrors.passwordConfirmation && (
          <span className={styles.fieldError}>
            {fieldErrors.passwordConfirmation}
          </span>
        )}
      </div>
      <button
        type="submit"
        className={styles.submitButton}
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
