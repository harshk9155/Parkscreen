import styles from './HistoryTable.module.css';

const fmt  = (v) => (v != null ? (v * 1000).toFixed(1) + ' ms' : '—');
const pct  = (v) => (v != null ? Math.round(v * 100) + '%' : '—');

export default function HistoryTable({ sessions, onRowClick }) {
  if (!sessions?.length) return null;

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Date &amp; Time</th>
            <th>Prediction</th>
            <th>Probability</th>
            <th>Avg Hold</th>
            <th>Avg Latency</th>
            <th>Avg Flight</th>
            <th>Hold Asym</th>
            <th>L Hold</th>
            <th>R Hold</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => {
            const f           = s.features || {};
            const isParkinson = s.prediction === "Parkinson's";

            return (
              <tr key={s.id} className={styles.row} onClick={() => onRowClick?.(s)}>

                <td className={styles.index}>{sessions.length - i}</td>

                <td className={styles.dateCell}>
                  <span>
                    {new Date(s.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </span>
                  <span className={styles.time}>
                    {new Date(s.created_at).toLocaleTimeString('en-GB', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </td>

                <td>
                  <span
                    className={styles.predBadge}
                    data-type={isParkinson ? 'parkinson' : 'control'}
                  >
                    {s.prediction ?? 'Unknown'}
                  </span>
                </td>

                <td className={styles.probCell}>
                  <div className={styles.probRow}>
                    <div className={styles.probBar}>
                      <div
                        className={styles.probFill}
                        style={{
                          width: pct(s.probability),
                          background: isParkinson ? 'var(--danger)' : 'var(--success)',
                        }}
                      />
                    </div>
                    <span
                      className={styles.probText}
                      style={{ color: isParkinson ? 'var(--danger)' : 'var(--success)' }}
                    >
                      {pct(s.probability)}
                    </span>
                  </div>
                </td>

                <td>{fmt(f.mean_hold)}</td>
                <td>{fmt(f.mean_latency)}</td>
                <td>{fmt(f.mean_flight)}</td>
                <td>
                  {f.hold_asym != null
                    ? (f.hold_asym >= 0 ? '+' : '') + f.hold_asym.toFixed(3)
                    : '—'}
                </td>
                <td>{fmt(f.l_hold)}</td>
                <td>{fmt(f.r_hold)}</td>

                <td className={styles.arrow}>›</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}