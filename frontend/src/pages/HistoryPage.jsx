import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HistoryTable from '../components/HistoryTable';
import TrendChart from '../components/TrendChart';
import { getSessionHistory } from '../Services/api';
import styles from './HistoryPage.module.css';

export default function HistoryPage() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getSessionHistory();
        setSessions(data.sessions || []);
      } catch (err) {
        setError('Failed to load history. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Only use completed sessions for stats
  const completed = sessions.filter((s) => s.probability != null);

  const avg          = completed.length ? completed.reduce((acc, s) => acc + s.probability, 0) / completed.length : null;
  const min          = completed.length ? Math.min(...completed.map((s) => s.probability)) : null;
  const max          = completed.length ? Math.max(...completed.map((s) => s.probability)) : null;
  const highRiskCount = completed.filter((s) => s.probability >= 0.5).length;

  const pct  = (v) => (v != null ? Math.round(v * 100) + '%' : '—');
  const dash = (v) => (loading ? '…' : v);

  return (
    <>
      <Navbar />
      <div className={styles.page}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Session History</h1>
            <p className={styles.subtitle}>All your past screening tests</p>
          </div>
          <button className={styles.btn} onClick={() => navigate('/test')}>
            + New Test
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className={styles.errorBanner}>{error}</div>
        )}

        {/* Chart + Summary row */}
        <div className={styles.topRow}>

          <div className={`${styles.card} ${styles.chartCard}`}>
            <div className={styles.cardTitle}>Probability Over Time</div>
            <TrendChart sessions={completed} />
          </div>

          <div className={`${styles.card} ${styles.summaryCard}`}>
            <div className={styles.cardTitle}>Summary</div>
            <div className={styles.summaryGrid}>

              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Total Tests</div>
                <div className={styles.summaryVal} style={{ color: 'var(--text)' }}>
                  {dash(sessions.length)}
                </div>
              </div>

              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Avg Score</div>
                <div className={styles.summaryVal} style={{ color: 'var(--teal)' }}>
                  {dash(pct(avg))}
                </div>
              </div>

              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Lowest Risk</div>
                <div className={styles.summaryVal} style={{ color: 'var(--success)' }}>
                  {dash(pct(min))}
                </div>
              </div>

              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Highest Risk</div>
                <div className={styles.summaryVal} style={{ color: 'var(--danger)' }}>
                  {dash(pct(max))}
                </div>
              </div>

              <div className={styles.summaryItem} style={{ gridColumn: 'span 2' }}>
                <div className={styles.summaryLabel}>High-Risk Sessions</div>
                <div className={styles.summaryVal} style={{ color: 'var(--danger)' }}>
                  {dash(highRiskCount)}
                </div>
              </div>

              <div className={styles.summaryItem} style={{ gridColumn: 'span 2' }}>
                <div className={styles.summaryLabel}>Latest Result</div>
                <div
                  className={styles.summaryVal}
                  style={{
                    color: completed[0]?.prediction === "Parkinson's"
                      ? 'var(--danger)'
                      : completed[0]?.prediction === 'Healthy'
                      ? 'var(--success)'
                      : 'var(--text-muted)',
                  }}
                >
                  {dash(completed.length ? completed[0].prediction ?? '—' : '—')}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* All Sessions table */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>All Sessions</div>
          {loading ? (
            <div className={styles.loadingMsg}>Loading sessions…</div>
          ) : completed.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>📋</span>
              <p>No sessions yet — complete a typing test first</p>
            </div>
          ) : (
            <HistoryTable
              sessions={completed}
              onRowClick={(s) =>
                navigate('/result', { state: { result: s, features: s.features } })
              }
            />
          )}
        </div>

      </div>
    </>
  );
}