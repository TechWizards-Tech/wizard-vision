import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';
import './AthleteDetail.css';

const PROFILE_LABELS = {
  explosivo: { label: 'Explosivo', color: '#f59e0b', icon: '⚡' },
  alta_resistencia: { label: 'Alta Resistência', color: '#10b981', icon: '🏃' },
  alta_carga_impacto: { label: 'Alta Carga', color: '#ef4444', icon: '💥' },
  baixa_intensidade: { label: 'Baixa Intensidade', color: '#6366f1', icon: '🔵' },
};

const METRICS = {
  metresPerMinute: { label: 'Ritmo (m/min)', color: '#10b981', unit: ' m/min' },
  loadPerMinute: { label: 'Carga/min', color: '#3b82f6', unit: ' un/min' },
  sprintsPerMinute: { label: 'Sprints/min', color: '#ef4444', unit: ' sprints/min' },
  topSpeedKph: { label: 'Vel. Máxima', color: '#f59e0b', unit: ' km/h' }
};

export default function AthleteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30'); // '7', '30' ou '150' (Tudo)
  const [activeMetric, setActiveMetric] = useState('metresPerMinute');

  useEffect(() => {
    loadAthleteData();
  }, [id, period]);

  const loadAthleteData = async () => {
    setLoading(true);
    try {
      const res = await api.getAthlete(id, { limit: period === '150' ? 150 : period });
      setAthlete(res.data);
    } catch (err) {
      toast.error('Erro ao carregar detalhes do atleta');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="athlete-detail-loading">
        <span className="spinner-lg" />
        <p>Carregando análises de desempenho...</p>
      </div>
    );
  }

  if (!athlete) return null;

  const profile = PROFILE_LABELS[athlete.profile];
  const sessions = athlete.sessions || [];
  const latestSession = sessions[0];
  const baselineSessions = sessions.slice(1);

  // Inverter sessões para ordem cronológica no gráfico
  const chartData = [...sessions].reverse().map(session => {
    const duration = session.durationMins && session.durationMins > 0 ? session.durationMins : 1;
    return {
      date: new Date(session.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      metresPerMinute: Math.round(session.metresPerMinute || 0),
      loadPerMinute: parseFloat(((session.sessionLoad || 0) / duration).toFixed(2)),
      sprintsPerMinute: parseFloat(((session.noOfSprints || 0) / duration).toFixed(2)),
      topSpeedKph: parseFloat((session.topSpeedKph || 0).toFixed(1)),
      rawDate: session.startDate
    };
  });

  // Cálculo das Médias Históricas (Baselines do próprio atleta)
  const calculateBaselines = () => {
    if (!baselineSessions.length) return { metresPerMinute: 0, loadPerMinute: 0, sprintsPerMinute: 0, topSpeedKph: 0 };

    const totalMetres = baselineSessions.reduce((acc, s) => acc + (s.metresPerMinute || 0), 0);
    const totalLoad = baselineSessions.reduce((acc, s) => {
      const d = s.durationMins && s.durationMins > 0 ? s.durationMins : 1;
      return acc + ((s.sessionLoad || 0) / d);
    }, 0);
    const totalSprints = baselineSessions.reduce((acc, s) => {
      const d = s.durationMins && s.durationMins > 0 ? s.durationMins : 1;
      return acc + ((s.noOfSprints || 0) / d);
    }, 0);
    const totalSpeed = baselineSessions.reduce((acc, s) => acc + (s.topSpeedKph || 0), 0);

    return {
      metresPerMinute: Math.round(totalMetres / baselineSessions.length),
      loadPerMinute: parseFloat((totalLoad / baselineSessions.length).toFixed(2)),
      sprintsPerMinute: parseFloat((totalSprints / baselineSessions.length).toFixed(2)),
      topSpeedKph: parseFloat((totalSpeed / baselineSessions.length).toFixed(1))
    };
  };

  const baselines = calculateBaselines();

  // Obter valor atual da última sessão formatado
  const getLatestValue = (metric) => {
    if (!latestSession) return 0;
    const duration = latestSession.durationMins && latestSession.durationMins > 0 ? latestSession.durationMins : 1;
    switch (metric) {
      case 'metresPerMinute': return Math.round(latestSession.metresPerMinute || 0);
      case 'loadPerMinute': return parseFloat(((latestSession.sessionLoad || 0) / duration).toFixed(2));
      case 'sprintsPerMinute': return parseFloat(((latestSession.noOfSprints || 0) / duration).toFixed(2));
      case 'topSpeedKph': return parseFloat((latestSession.topSpeedKph || 0).toFixed(1));
      default: return 0;
    }
  };

  const latestVal = getLatestValue(activeMetric);
  const baselineVal = baselines[activeMetric];
  const diffPct = baselineVal > 0 ? ((latestVal - baselineVal) / baselineVal * 100) : 0;

  return (
    <div className="athlete-detail-layout">
      {/* Topo Navegação */}
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Voltar ao Dashboard
        </button>
        <div className="athlete-meta-title">
          <h2>Atleta #{String(athlete.athleteId).slice(-6)}</h2>
          <span className="athlete-pos-group">
            {athlete.position || 'Posição N/D'} • {athlete.group || 'Sem Grupo'}
          </span>
        </div>
        {profile && (
          <div className="profile-badge-lg" style={{ '--profile-color': profile.color }}>
            {profile.icon} {profile.label}
          </div>
        )}
      </header>

      {/* Conteúdo Principal */}
      <div className="detail-grid">
        {/* Painel Esquerdo: Resumo de Baselines Individuais */}
        <section className="detail-card info-panel">
          <h3>Métricas da Última Sessão</h3>
          {latestSession ? (
            <div className="latest-metrics-vertical">
              <div className={`metric-row ${activeMetric === 'metresPerMinute' ? 'active' : ''}`} onClick={() => setActiveMetric('metresPerMinute')}>
                <span className="label">Ritmo de Corrida</span>
                <span className="value">{Math.round(latestSession.metresPerMinute || 0)} m/min</span>
              </div>
              <div className={`metric-row ${activeMetric === 'loadPerMinute' ? 'active' : ''}`} onClick={() => setActiveMetric('loadPerMinute')}>
                <span className="label">Carga de Trabalho / min</span>
                <span className="value">
                  {((latestSession.sessionLoad || 0) / (latestSession.durationMins || 1)).toFixed(2)} un/min
                </span>
              </div>
              <div className={`metric-row ${activeMetric === 'sprintsPerMinute' ? 'active' : ''}`} onClick={() => setActiveMetric('sprintsPerMinute')}>
                <span className="label">Sprints / min</span>
                <span className="value">
                  {((latestSession.noOfSprints || 0) / (latestSession.durationMins || 1)).toFixed(2)} /min
                </span>
              </div>
              <div className={`metric-row ${activeMetric === 'topSpeedKph' ? 'active' : ''}`} onClick={() => setActiveMetric('topSpeedKph')}>
                <span className="label">Velocidade Máxima</span>
                <span className="value">{(latestSession.topSpeedKph || 0).toFixed(1)} km/h</span>
              </div>
            </div>
          ) : (
            <p className="no-data">Nenhuma sessão registrada.</p>
          )}

          {/* Comparativo de Baselines Pessoais */}
          {sessions.length > 1 && (
            <div className="baseline-compare-box">
              <h4>Comparação com Baseline Pessoal</h4>
              <p className="compare-subtitle">Confronto da última sessão contra a sua própria média histórica</p>
              <div className="compare-result">
                <div className="compare-circle">
                  <span className="val">{baselineVal}</span>
                  <span className="lbl">Média</span>
                </div>
                <div className="compare-stats">
                  <span className="metric-name">{METRICS[activeMetric].label}</span>
                  <span className={`diff-value ${diffPct >= 0 ? 'above' : 'below'}`}>
                    {diffPct >= 0 ? `▲ +${diffPct.toFixed(1)}%` : `▼ ${diffPct.toFixed(1)}%`}
                  </span>
                  <span className="diff-desc">
                    {diffPct >= 0 ? 'Acima da média pessoal' : 'Abaixo da média pessoal'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Painel Direito: Gráficos de Evolução */}
        <section className="detail-card chart-panel">
          <div className="chart-header">
            <h3>Evolução de Condicionamento</h3>
            {/* Controles de Período */}
            <div className="period-tabs">
              <button className={period === '7' ? 'active' : ''} onClick={() => setPeriod('7')}>7 Jogos</button>
              <button className={period === '30' ? 'active' : ''} onClick={() => setPeriod('30')}>30 Jogos</button>
              <button className={period === '150' ? 'active' : ''} onClick={() => setPeriod('150')}>Tudo</button>
            </div>
          </div>

          {/* Seletor de métrica ativa para o gráfico */}
          <div className="chart-metric-selector">
            {Object.keys(METRICS).map(key => (
              <button
                key={key}
                className={`selector-btn ${activeMetric === key ? 'active' : ''}`}
                style={{ '--btn-color': METRICS[key].color }}
                onClick={() => setActiveMetric(key)}
              >
                {METRICS[key].label}
              </button>
            ))}
          </div>

          {/* Gráfico do Recharts */}
          <div className="recharts-wrapper">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="var(--color-text-secondary)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--color-text-secondary)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0.75rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    labelStyle={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={activeMetric}
                    name={METRICS[activeMetric].label}
                    stroke={METRICS[activeMetric].color}
                    strokeWidth={3}
                    dot={{ fill: METRICS[activeMetric].color, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">Dados de sessões insuficientes para plotagem.</p>
            )}
          </div>
        </section>
      </div>

      {/* Tabela do Histórico Completo de Partidas */}
      <section className="detail-card table-panel">
        <h3>Histórico Recente de Sessões</h3>
        <div className="table-wrapper">
          <table className="sessions-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Duração (min)</th>
                <th>Ritmo (m/min)</th>
                <th>Top Speed (km/h)</th>
                <th>Sprints</th>
                <th>Carga</th>
                <th>Atípico?</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => {
                const isAnomaly = s.isAnomaly;
                return (
                  <tr key={s.id} className={isAnomaly ? 'anomaly-row' : ''}>
                    <td>{new Date(s.startDate).toLocaleDateString('pt-BR')}</td>
                    <td>{s.durationMins ? Math.round(s.durationMins) : '—'}</td>
                    <td>{s.metresPerMinute ? Math.round(s.metresPerMinute) : '—'}</td>
                    <td>{s.topSpeedKph ? s.topSpeedKph.toFixed(1) : '—'}</td>
                    <td>{s.noOfSprints ?? '—'}</td>
                    <td>{s.sessionLoad ? Math.round(s.sessionLoad) : '—'}</td>
                    <td>
                      {isAnomaly ? (
                        <span className="anomaly-tag">⚠️ Sim</span>
                      ) : (
                        <span className="normal-tag">Regular</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
