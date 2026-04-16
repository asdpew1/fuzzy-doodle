import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../auth/context/AuthContext';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { user, handleLogout } = useAuthContext();
  const navigate = useNavigate();

  async function onLogout() {
    await handleLogout();
    navigate('/login');
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <button className={styles.logoutButton} onClick={onLogout}>
          Sign out
        </button>
      </div>
      <div className={styles.userInfo}>
        <p>Logged in as <strong>{user?.email}</strong></p>
      </div>
    </div>
  );
}
