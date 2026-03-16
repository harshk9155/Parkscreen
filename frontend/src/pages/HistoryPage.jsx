import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HistoryTable from '../components/HistoryTable';
import TrendChart from '../components/TrendChart';
import styles from './HistoryPage.module.css';

const MOCK_SESSIONS = [];

export default function HistoryPage() {
  const navigate = useNavigate();
  const sessions = MOCK_SESSIONS;
  const avg = sessions.length ? sessions.reduce((s, r) => s + r.probability, 0) / sessions.length : null;
  const min = sessions.length ? Math.min(...sessions.map((s) => s.probability)) : null;
  const max = sessions.length ? Math.max(...sessions.map((s) => s.probability)) : null;

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Session History</h1>
            <p className={styles.subtitle}>All your past screening tests</p>
          </div>
          <button className={styles.btn} onClick={() => navigate('/test')}>+ New Test</button>
        </div>

        <div className={styles.topRow}>
          <div className={styles.card} style={{ flex: 1.5 }}>
            <div className={styles.cardTitle}>Probability Over Time</div>
            <TrendChart sessions={sessions} />
          </div>
          <div className={styles.card} style={{ flex: 1 }}>
            <div className={styles.cardTitle}>Summary</div>
            <div className={styles.summaryGrid}>
              {[
                { label: 'Total tests',  val: sessions.length, color: 'var(--text)' },
                { label: 'Avg score',    val: avg !== null ? Math.round(avg*100)+'%' : '—', color: 'var(--teal)' },
                { label: 'Lowest risk',  val: min !== null ? Math.round(min*100)+'%' : '—', color: 'var(--success)' },
                { label: 'Highest risk', val: max !== null ? Math.round(max*100)+'%' : '—', color: 'var(--danger)' },
              ].map((item) => (
                <div key={item.label} className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>{item.label}</div>
                  <div className={styles.summaryVal} style={{ color: item.color }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>All Sessions</div>
          <HistoryTable
            sessions={sessions}
            onRowClick={(s) => navigate('/result', { state: { result: s, features: s.features } })}
          />
        </div>
      </div>
    </>
  );
}