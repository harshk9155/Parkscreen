import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import styles from './ResultPage.module.css';

const FEATURE_CONFIG = [
  { key: 'mean_hold',    label: 'Mean Hold Time',      unit: 'ms', max: 300 },
  { key: 'std_hold',     label: 'Hold Variability',     unit: 'ms', max: 100 },
  { key: 'mean_latency', label: 'Mean Latency',         unit: 'ms', max: 200 },
  { key: 'std_latency',  label: 'Latency Irregularity', unit: 'ms', max: 80  },
  { key: 'hold_asym',    label: 'Hand Asymmetry',       unit: 'ms', max: 60  },
  { key: 'mean_flight',  label: 'Mean Flight Time',     unit: 'ms', max: 300 },
];

function getLevel(val, max) {
  const pct = val / max;
  if (pct < 0.35) return 'low';
  if (pct < 0.65) return 'mid';
  return 'high';
}

// ── 3-tier prediction logic ───────────────────────────────────
// < 45%      → Normal
// 45% – 60%  → Uncertain
// > 60%      → Parkinson

function getPredictionLevel(pct) {
  if (pct < 45)  return 'normal';
  if (pct <= 60) return 'uncertain';
  return 'parkinson';
}

const PREDICTION_CONFIG = {
  normal: {
    heroClass:    'heroControl',
    metaValClass: 'metaValControl',
    gaugeColor:   '#5df5e8',
    label:        'Normal — Low Risk',
    badgeBg:      '#dcfce7',
    badgeColor:   '#16a34a',
    badgeText:    '✅ Normal',
    riskBarLabel: '< 45% — Normal range',
    description:  'Your typing patterns are within the normal range. Continue monitoring with regular screenings to track any changes over time.',
  },
  uncertain: {
    heroClass:    'heroUncertain',
    metaValClass: 'metaValUncertain',
    gaugeColor:   '#fbbf24',
    label:        'Uncertain — Monitor Closely',
    badgeBg:      '#fef9c3',
    badgeColor:   '#d97706',
    badgeText:    '⚠️ Uncertain',
    riskBarLabel: '45–60% — Uncertain range',
    description:  'Your typing patterns show some irregularities in the uncertain range. This is not a diagnosis. Repeat the test in a few days and consult a doctor if the score remains elevated.',
  },
  parkinson: {
    heroClass:    'heroParkinson',
    metaValClass: 'metaValParkinson',
    gaugeColor:   '#ff6b6b',
    label:        'Elevated Risk Detected',
    badgeBg:      '#fee2e2',
    badgeColor:   '#dc2626',
    badgeText:    '🔴 High Risk',
    riskBarLabel: '> 60% — High risk range',
    description:  'Your typing patterns show significant irregularities. This is NOT a medical diagnosis. Please consult a licensed neurologist for a professional evaluation as soon as possible.',
  },
};

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state    = location.state;

  if (!state?.result) {
    return (
      <>
        <Navbar />
        <div className={styles.page}>
          <div className={styles.emptyCard}>
            <div className={styles.emptyIcon}>🔬</div>
            <div className={styles.emptyTitle}>No result yet</div>
            <p className={styles.emptyDesc}>Complete a typing test first.</p>
            <button className={styles.btn} onClick={() => navigate('/test')}>
              Take Typing Test
            </button>
          </div>
        </div>
      </>
    );
  }

  const { result, features } = state;
  const pct           = Math.round(result.probability * 100);
  const level         = getPredictionLevel(pct);
  const cfg           = PREDICTION_CONFIG[level];
  const circumference = 2 * Math.PI * 60;
  const offset        = circumference - circumference * result.probability;

  return (
    <>
      <Navbar />
      <div className={styles.page}>

        {/* ── Hero card ──────────────────────────────────── */}
        <div className={`${styles.hero} ${styles[cfg.heroClass]}`}>

          {/* Gauge ring */}
          <div className={styles.gauge}>
            <svg className={styles.gaugeSvg} viewBox="0 0 150 150">
              <circle className={styles.gaugeBg} cx="75" cy="75" r="60" />
              <circle
                className={styles.gaugeFill}
                cx="75" cy="75" r="60"
                stroke={cfg.gaugeColor}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className={styles.gaugeText}>
              <span className={styles.gaugePct}>{pct}%</span>
              <span className={styles.gaugeSub}>probability</span>
            </div>
          </div>

          {/* Info */}
          <div className={styles.info}>
            <div className={styles.infoLabel}>ML Model Prediction</div>

            {/* Title + badge */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap', marginBottom:'8px' }}>
              <div className={styles.prediction}>{cfg.label}</div>
              <span style={{
                background:   cfg.badgeBg,
                color:        cfg.badgeColor,
                padding:      '4px 12px',
                borderRadius: '20px',
                fontSize:     '12px',
                fontWeight:   700,
                whiteSpace:   'nowrap',
              }}>
                {cfg.badgeText}
              </span>
            </div>

            {/* Risk range bar */}
            <div className={styles.riskBarWrap}>
              <div className={styles.riskBarTrack}>
                <div className={styles.riskBarNormal}    style={{ opacity: level === 'normal'    ? 1 : 0.25 }} />
                <div className={styles.riskBarUncertain} style={{ opacity: level === 'uncertain' ? 1 : 0.25 }} />
                <div className={styles.riskBarParkinson} style={{ opacity: level === 'parkinson' ? 1 : 0.25 }} />
              </div>
              <span className={styles.riskBarLabel}>{cfg.riskBarLabel}</span>
            </div>

            <p className={styles.description}>{cfg.description}</p>

            {/* Meta row */}
            <div className={styles.meta}>
              <div>
                <div className={styles[cfg.metaValClass]}>{result.keystrokes}</div>
                <div className={styles.metaLabel}>Keystrokes analyzed</div>
              </div>
              <div>
                <div className={styles[cfg.metaValClass]}>{result.date}</div>
                <div className={styles.metaLabel}>Test date</div>
              </div>
              <div>
                <div className={styles[cfg.metaValClass]}>{pct}%</div>
                <div className={styles.metaLabel}>Risk score</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Disclaimer ─────────────────────────────────── */}
        <div className={styles.disclaimer}>
          ⚠️ <strong>Medical disclaimer:</strong> This tool is for educational
          screening only and is NOT a medical diagnosis. Please consult a
          licensed neurologist for any health concerns.
        </div>

        {/* ── Score interpretation guide ──────────────────── */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Score Interpretation Guide</div>
          <div className={styles.interpretGrid}>

            <div className={`${styles.interpretCard} ${level === 'normal' ? styles.activeNormal : ''}`}>
              <div className={styles.interpretHeader}>
                <span style={{ fontSize:'16px' }}>✅</span>
                <span className={`${styles.interpretLabel} ${styles.interpretLabelNormal}`}>Normal</span>
              </div>
              <div className={`${styles.interpretRange} ${styles.interpretRangeNormal}`}>0% – 44%</div>
              <div className={styles.interpretDesc}>Typing patterns within normal range. No action needed.</div>
              {level === 'normal' && (
                <span className={`${styles.interpretYourScore} ${styles.yourScoreNormal}`}>← Your score: {pct}%</span>
              )}
            </div>

            <div className={`${styles.interpretCard} ${level === 'uncertain' ? styles.activeUncertain : ''}`}>
              <div className={styles.interpretHeader}>
                <span style={{ fontSize:'16px' }}>⚠️</span>
                <span className={`${styles.interpretLabel} ${styles.interpretLabelUncertain}`}>Uncertain</span>
              </div>
              <div className={`${styles.interpretRange} ${styles.interpretRangeUncertain}`}>45% – 60%</div>
              <div className={styles.interpretDesc}>Some irregularities detected. Retest and monitor.</div>
              {level === 'uncertain' && (
                <span className={`${styles.interpretYourScore} ${styles.yourScoreUncertain}`}>← Your score: {pct}%</span>
              )}
            </div>

            <div className={`${styles.interpretCard} ${level === 'parkinson' ? styles.activeParkinson : ''}`}>
              <div className={styles.interpretHeader}>
                <span style={{ fontSize:'16px' }}>🔴</span>
                <span className={`${styles.interpretLabel} ${styles.interpretLabelParkinson}`}>High Risk</span>
              </div>
              <div className={`${styles.interpretRange} ${styles.interpretRangeParkinson}`}>61% – 100%</div>
              <div className={styles.interpretDesc}>Significant irregularities. Consult a neurologist.</div>
              {level === 'parkinson' && (
                <span className={`${styles.interpretYourScore} ${styles.yourScoreParkinson}`}>← Your score: {pct}%</span>
              )}
            </div>

          </div>
        </div>

        {/* ── Feature analysis ───────────────────────────── */}
        {features && (
          <div className={styles.card}>
            <div className={styles.cardTitle}>Typing Pattern Analysis</div>
            <div className={styles.featuresGrid}>
              {FEATURE_CONFIG.map((f) => {
                const val     = features[f.key] ?? 0;
                const fillPct = Math.min((val / f.max) * 100, 100);
                const lvl     = getLevel(val, f.max);
                return (
                  <div key={f.key} className={styles.featureCard}>
                    <div className={styles.featureName}>{f.label}</div>
                    <div className={styles.featureVal}>{val} {f.unit}</div>
                    <div className={styles.featureBar}>
                      <div
                        className={`${styles.featureFill} ${styles[lvl]}`}
                        style={{ width: fillPct.toFixed(0) + '%' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Actions ────────────────────────────────────── */}
        <div className={styles.actions}>
          <button className={styles.btn} onClick={() => navigate('/test')}>
            Take New Test
          </button>
          <button className={styles.btnOutline} onClick={() => navigate('/history')}>
            View History
          </button>
        </div>

      </div>
    </>
  );
}