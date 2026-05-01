import './AthleteCard.css';

const PROFILE_LABELS = {
  explosivo: { label: 'Explosivo', color: '#f59e0b', icon: '⚡' },
  alta_resistencia: { label: 'Alta Resistência', color: '#10b981', icon: '🏃' },
  alta_carga_impacto: { label: 'Alta Carga', color: '#ef4444', icon: '💥' },
  baixa_intensidade: { label: 'Baixa Intensidade', color: '#6366f1', icon: '🔵' },
};

export default function AthleteCard({ athlete, onClick }) {
  const profile = PROFILE_LABELS[athlete.profile];
  const lastSession = athlete.sessions?.[0];

  return (
    <article
      className="athlete-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Header */}
      <div className="athlete-card-header">
        <div className="athlete-avatar">
          {(athlete.position || 'A').charAt(0)}
        </div>
        <div className="athlete-info">
          <span className="athlete-id">#{String(athlete.athleteId).slice(-6)}</span>
          <span className="athlete-position">{athlete.position || 'Posição N/D'}</span>
          <span className="athlete-group">{athlete.group || ''}</span>
        </div>
        {athlete._count?.alerts > 0 && (
          <div className="alert-badge" title="Alertas ativos">
            🔔 {athlete._count.alerts}
          </div>
        )}
      </div>

      {/* Perfil */}
      {profile && (
        <div
          className="athlete-profile-badge"
          style={{ '--profile-color': profile.color }}
        >
          {profile.icon} {profile.label}
        </div>
      )}

      {/* Métricas da última sessão */}
      {lastSession && (
        <div className="athlete-metrics">
          <div className="metric">
            <span className="metric-value">{lastSession.distanceM ? (lastSession.distanceM / 1000).toFixed(1) : '—'}</span>
            <span className="metric-label">km</span>
          </div>
          <div className="metric">
            <span className="metric-value">{lastSession.topSpeedKph?.toFixed(1) || '—'}</span>
            <span className="metric-label">km/h top</span>
          </div>
          <div className="metric">
            <span className="metric-value">{lastSession.noOfSprints ?? '—'}</span>
            <span className="metric-label">sprints</span>
          </div>
          <div className="metric">
            <span className="metric-value">{lastSession.highIntensityRunM ? Math.round(lastSession.highIntensityRunM) : '—'}</span>
            <span className="metric-label">m HIR</span>
          </div>
        </div>
      )}

      <div className="card-footer">
        <span className="sessions-count">
          📋 {athlete._count?.sessions || 0} sessões
        </span>
        <span className="view-more">Ver detalhes →</span>
      </div>
    </article>
  );
}
