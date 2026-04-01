import {
  Line, LineChart, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short',
  });
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '13px',
      fontFamily: 'DM Sans',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
        {new Date(d.created_at).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric',
        })}
        {' · '}
        {new Date(d.created_at).toLocaleTimeString('en-GB', {
          hour: '2-digit', minute: '2-digit',
        })}
      </div>
      <div>
        <strong style={{ color: d.probability >= 50 ? 'var(--danger)' : 'var(--success)' }}>
          {d.probability}%
        </strong>
        {' — '}{d.prediction ?? 'Unknown'}
      </div>
    </div>
  );
}

export default function TrendChart({ sessions }) {
  if (!sessions?.length) {
    return (
      <div style={{
        height: 240, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14,
      }}>
        No data yet — complete a typing test first
      </div>
    );
  }

  // Sort chronologically oldest → newest
  const data = [...sessions]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((s) => ({
      ...s,
      probability: +(s.probability * 100).toFixed(1),
    }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />

        <XAxis
          dataKey="created_at"
          tickFormatter={formatDate}
          tick={{ fontSize: 11, fill: '#9aa5b4' }}
        />

        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: '#9aa5b4' }}
          tickFormatter={(v) => v + '%'}
        />

        <Tooltip content={<CustomTooltip />} />

        {/* 50% threshold line */}
        <ReferenceLine
          y={50}
          stroke="var(--danger)"
          strokeDasharray="4 4"
          strokeOpacity={0.4}
          label={{
            value: '50% threshold',
            position: 'insideTopRight',
            fontSize: 10,
            fill: 'var(--danger)',
            opacity: 0.6,
          }}
        />

        <Line
          type="monotone"
          dataKey="probability"
          stroke="#0f9b8e"
          strokeWidth={2.5}
          dot={(props) => {
            const { cx, cy, payload } = props;
            const color = payload.probability >= 50 ? 'var(--danger)' : 'var(--success)';
            return (
              <circle
                key={`dot-${payload.id}`}
                cx={cx} cy={cy} r={4}
                fill={color} stroke="#fff" strokeWidth={2}
              />
            );
          }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}