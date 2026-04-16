import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import styles from './RegistrationPage.module.css';

export default function RegistrationPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Create account</h1>
      <RegistrationForm />
      <p className={styles.link}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
