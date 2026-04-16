import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Sign in</h1>
      <LoginForm />
      <p className={styles.link}>
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}
