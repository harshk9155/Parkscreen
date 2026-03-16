import {
  Line, LineChart, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function TrendChart({ sessions }) {
  // Reverse so oldest is on the left
  const data = [...sessions]
    .reverse()
    .map((s) => ({
      date: s.date,
      probability: +(s.probability * 100).toFixed(1),
    }));

  if (data.length === 0) {
    return (
      <div style={{ height: 240, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        No data yet — complete a typing test first
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9aa5b4' }} />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: '#9aa5b4' }}
          tickFormatter={(v) => v + '%'}
        />
        <Tooltip
          formatter={(value) => [value + '%', 'Probability']}
          contentStyle={{
            borderRadius: 8, border: '1px solid var(--border)',
            fontSize: 13, fontFamily: 'DM Sans',
          }}
        />
        <Line
          type="monotone"
          dataKey="probability"
          stroke="#0f9b8e"
          strokeWidth={2.5}
          dot={{ fill: '#0f9b8e', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}