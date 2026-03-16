import styles from './HistoryTable.module.css';

function ProbBadge({ probability }) {
  const pct = Math.round(probability * 100);
  const cls = probability < 0.3 ? styles.low : probability < 0.6 ? styles.med : styles.high;
  return <span className={`${styles.badge} ${cls}`}>{pct}%</span>;
}

function PredBadge({ prediction }) {
  return (
    <span className={`${styles.pred} ${prediction === 0 ? styles.control : styles.parkinson}`}>
      {prediction === 0 ? 'Control' : 'Elevated'}
    </span>
  );
}

export default function HistoryTable({ sessions, onRowClick }) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📋</div>
        <div className={styles.emptyTitle}>No sessions yet</div>
        <div className={styles.emptyDesc}>
          Complete your first typing test to see history here.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Session</th>
            <th>Date</th>
            <th>Keystrokes</th>
            <th>Probability</th>
            <th>Prediction</th>
            <th>Hold Avg</th>
            <th>Asymmetry</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.session_id} onClick={() => onRowClick?.(s)}>
              <td className={styles.mono}>#{String(s.session_id).padStart(4, '0')}</td>
              <td>{s.date}</td>
              <td>{s.keystrokes ?? '—'}</td>
              <td><ProbBadge probability={s.probability} /></td>
              <td><PredBadge prediction={s.prediction} /></td>
              <td className={styles.muted}>{s.features?.mean_hold ?? '—'} ms</td>
              <td className={styles.muted}>{s.features?.hold_asym ?? '—'} ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}