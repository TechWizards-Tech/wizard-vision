import './StatCard.css';

const COLOR_MAP = {
  green: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
  blue: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', text: '#6366f1' },
  red: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' },
  purple: { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)', text: '#a855f7' },
};

export default function StatCard({ id, icon, label, value, color = 'green' }) {
  const colors = COLOR_MAP[color] || COLOR_MAP.green;

  return (
    <div
      id={id}
      className="stat-card"
      style={{
        '--stat-bg': colors.bg,
        '--stat-border': colors.border,
        '--stat-text': colors.text,
      }}
    >
      <div className="stat-icon-wrap">
        <span className="stat-icon">{icon}</span>
      </div>
      <div className="stat-content">
        <span className="stat-value">{value?.toLocaleString('pt-BR') ?? '—'}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}
