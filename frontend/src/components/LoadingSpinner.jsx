import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ message = 'Loading...', sub = '' }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.spinner} />
        <div className={styles.message}>{message}</div>
        {sub && <div className={styles.sub}>{sub}</div>}
      </div>
    </div>
  );
}