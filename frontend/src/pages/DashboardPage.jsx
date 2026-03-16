import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Navbar from '../components/Navbar';
import TrendChart from '../components/TrendChart';
import HistoryTable from '../components/HistoryTable';
import styles from './DashboardPage.module.css';

// For now using mock data — replace with API call when backend is ready
const MOCK_SESSIONS = [];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const sessions = MOCK_SESSIONS;

  const total   = sessions.length;
  const latest  = sessions[0] ?? null;
  const avg     = total ? (sessions.reduce((s, r) => s + r.probability, 0) / total) : null;

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Health Dashboard</h1>
            <p className={styles.subtitle}>
              Welcome back, {user?.name?.split(' ')[0] || 'there'} — your Parkinson's screening overview
            </p>
          </div>
          <button className={styles.newTestBtn} onClick={() => navigate('/test')}>
            + New Screening Test
          </button>
        </div>

        {/* Stat cards */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.accent1}`}>
            <div className={styles.statLabel}>Total Sessions</div>
            <div className={styles.statVal}>{total || '0'}</div>
            <div className={styles.statTag}>All time screenings</div>
          </div>
          <div className={`${styles.statCard} ${styles.accent2}`}>
            <div className={styles.statLabel}>Latest Score</div>
            <div className={styles.statVal}>
              {latest ? Math.round(latest.probability * 100) + '%' : '—'}
            </div>
            <div className={`${styles.statTag} ${latest?.prediction === 0 ? styles.tagGreen : styles.tagRed}`}>
              {latest ? (latest.prediction === 0 ? 'Control' : 'Elevated Risk') : 'No test yet'}
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.accent3}`}>
            <div className={styles.statLabel}>Avg Probability</div>
            <div className={styles.statVal}>
              {avg !== null ? Math.round(avg * 100) + '%' : '—'}
            </div>
            <div className={styles.statTag}>Across all sessions</div>
          </div>
          <div className={`${styles.statCard} ${styles.accent4}`}>
            <div className={styles.statLabel}>Trend</div>
            <div className={styles.statVal}>
              {sessions.length >= 2
                ? sessions[0].probability < sessions[sessions.length - 1].probability
                  ? '↑'
                  : '↓'
                : '—'}
            </div>
            <div className={styles.statTag}>
              {sessions.length >= 2 ? 'Compared to first test' : 'Need more tests'}
            </div>
          </div>
        </div>

        {/* Charts row */}
        <div className={styles.chartsRow}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Probability Trend Over Time</span>
            </div>
            <TrendChart sessions={sessions} />
          </div>
        </div>

        {/* Recent sessions table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Recent Sessions</span>
            <button className={styles.viewAll} onClick={() => navigate('/history')}>
              View all →
            </button>
          </div>
          <HistoryTable
            sessions={sessions.slice(0, 5)}
            onRowClick={(s) => navigate('/result', { state: { result: s, features: s.features } })}
          />
        </div>
      </div>
    </>
  );
}