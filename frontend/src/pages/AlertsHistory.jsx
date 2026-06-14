import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';
import './AlertsHistory.css';

const SEVERITIES = ['Todos', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const SEVERITY_LABELS = {
  CRITICAL: { label: 'Crítico', color: '#ef4444', emoji: '🚨' },
  HIGH: { label: 'Alto', color: '#f97316', emoji: '⚠️' },
  MEDIUM: { label: 'Médio', color: '#eab308', emoji: '🔔' },
  LOW: { label: 'Baixo', color: '#3b82f6', emoji: '🔵' },
};

export default function AlertsHistory() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusTab, setStatusTab] = useState('pending'); // 'pending', 'archived', 'all'
  const [filterSeverity, setFilterSeverity] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const limit = 10;

  useEffect(() => {
    loadAlerts();
    loadUnreadCount();
  }, [page, statusTab, filterSeverity]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (statusTab === 'pending') params.isRead = 'false';
      if (statusTab === 'archived') params.isRead = 'true';
      if (filterSeverity) params.severity = filterSeverity;

      const res = await api.getAlerts(params);
      setAlerts(res.data.alerts);
      setTotal(res.data.total);
    } catch (err) {
      toast.error('Erro ao carregar histórico de alertas');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const res = await api.getUnreadCount();
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error('Erro ao carregar contador de alertas não lidos:', err);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await api.markAlertRead(alertId);
      toast.success('Alerta marcado como resolvido!');
      loadAlerts();
      loadUnreadCount();
    } catch (err) {
      toast.error('Erro ao marcar alerta como resolvido');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="main-content">
        {/* Header */}
        <header className="alerts-header">
          <div>
            <h1 className="alerts-page-title">⚠️ Central de Alertas</h1>
            <p className="alerts-page-subtitle">
              Histórico de anomalias e quedas de desempenho físico detectadas pela IA
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="unread-banner">
              <span>Você tem <strong>{unreadCount}</strong> alertas pendentes de resolução</span>
            </div>
          )}
        </header>

        {/* Filtros e Abas */}
        <section className="alerts-control-bar">
          <div className="status-tabs">
            <button
              className={`tab-btn ${statusTab === 'pending' ? 'active' : ''}`}
              onClick={() => { setStatusTab('pending'); setPage(1); }}
            >
              Pendentes
            </button>
            <button
              className={`tab-btn ${statusTab === 'archived' ? 'active' : ''}`}
              onClick={() => { setStatusTab('archived'); setPage(1); }}
            >
              Resolvidos
            </button>
            <button
              className={`tab-btn ${statusTab === 'all' ? 'active' : ''}`}
              onClick={() => { setStatusTab('all'); setPage(1); }}
            >
              Todos
            </button>
          </div>

          <div className="severity-filter">
            <label htmlFor="select-severity">Filtrar por Severidade:</label>
            <select
              id="select-severity"
              className="severity-select"
              value={filterSeverity}
              onChange={(e) => { setFilterSeverity(e.target.value === 'Todos' ? '' : e.target.value); setPage(1); }}
            >
              {SEVERITIES.map(s => (
                <option key={s} value={s === 'Todos' ? '' : s}>
                  {s === 'Todos' ? 'Todas' : s}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Lista de Alertas */}
        {loading ? (
          <div className="loading-alerts">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-alert-card" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="alerts-empty-state">
            <span className="empty-icon">🎉</span>
            <h3>Nenhum alerta encontrado</h3>
            <p>Não há registros de anomalias físicas para o filtro selecionado.</p>
          </div>
        ) : (
          <section className="alerts-list-container">
            {alerts.map(alert => {
              const sev = SEVERITY_LABELS[alert.severity] || { label: alert.severity, color: '#94a3b8', emoji: '🔔' };
              const athleteIdFormatted = alert.athlete?.athleteId
                ? String(alert.athlete.athleteId).slice(-6)
                : 'N/D';

              return (
                <div
                  key={alert.id}
                  className={`alert-card-item severity-${alert.severity.toLowerCase()} ${alert.isRead ? 'resolved' : 'pending'}`}
                >
                  <div className="alert-card-header">
                    <div className="athlete-info-badge">
                      <span className="athlete-id-tag">Atleta #{athleteIdFormatted}</span>
                      <span className="athlete-pos-tag">{alert.athlete?.position || 'Posição N/D'}</span>
                      <span className="athlete-group-tag">{alert.athlete?.group || ''}</span>
                    </div>

                    <div className="severity-badge" style={{ backgroundColor: sev.color }}>
                      <span>{sev.emoji} {sev.label}</span>
                    </div>
                  </div>

                  <p className="alert-message-text">{alert.message}</p>

                  <div className="alert-card-footer">
                    <span className="alert-timestamp">
                      📅 Detectado em: {new Date(alert.createdAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>

                    <div className="action-area">
                      {alert.isRead ? (
                        <span className="resolved-status-tag">✔️ Resolvido</span>
                      ) : (
                        <button
                          className="resolve-alert-btn"
                          onClick={() => handleResolveAlert(alert.id)}
                          title="Marcar alerta como resolvido"
                        >
                          ✔️ Resolver Alerta
                        </button>
                      )}
                      <button
                        className="view-athlete-detail-btn"
                        onClick={() => navigate(`/athletes/${alert.athlete?.id}`)}
                        title="Ver ficha do atleta"
                      >
                        👁️ Ver Perfil
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Paginação */}
        {!loading && totalPages > 1 && (
          <div className="pagination">
            <button
              id="btn-prev-page"
              className="page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Anterior
            </button>
            <span className="page-info">Página {page} de {totalPages}</span>
            <button
              id="btn-next-page"
              className="page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Próxima →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
