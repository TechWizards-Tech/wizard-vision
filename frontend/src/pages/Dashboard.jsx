import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import AthleteCard from '../components/AthleteCard';
import StatCard from '../components/StatCard';
import toast from 'react-hot-toast';
import './Dashboard.css';

const POSITIONS = ['Todos', 'Striker', 'Centre Attacking Midfielder', 'Right Wing Back', 'Left Wing Back', 'Centre Back', 'Goalkeeper'];
const PROFILES = ['Todos', 'explosivo', 'alta_resistencia', 'alta_carga_impacto', 'baixa_intensidade'];

export default function Dashboard({ openAlertsDefault = false, openImportDefault = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterPosition, setFilterPosition] = useState('');
  const [filterProfile, setFilterProfile] = useState('');
  const [search, setSearch] = useState('');
  const [importing, setImporting] = useState(false);

  // Estados de Alertas e Notificações (Sprint 2)
  const [isAlertsOpen, setIsAlertsOpen] = useState(openAlertsDefault);
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadStats();
    loadUnreadCount();
  }, []);

  useEffect(() => {
    if (openAlertsDefault) {
      setIsAlertsOpen(true);
    }
  }, [openAlertsDefault]);

  useEffect(() => {
    if (openImportDefault) {
      // Gatilho automático para abrir a seleção de arquivo Excel
      const fileInput = document.getElementById('input-file-import');
      if (fileInput) fileInput.click();
    }
  }, [openImportDefault]);

  useEffect(() => {
    if (isAlertsOpen) {
      loadAlerts();
    }
  }, [isAlertsOpen]);

  useEffect(() => {
    loadAthletes();
  }, [page, filterPosition, filterProfile]);

  const loadStats = async () => {
    try {
      const res = await api.getStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const res = await api.getUnreadCount();
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAlerts = async () => {
    try {
      const res = await api.getAlerts({ isRead: false });
      setAlerts(res.data.alerts);
    } catch (err) {
      console.error('Erro ao carregar alertas:', err);
    }
  };

  const handleMarkAsRead = async (alertId) => {
    try {
      await api.markAlertRead(alertId);
      toast.success('Alerta marcado como resolvido!');
      loadUnreadCount();
      loadAlerts();
      loadStats();
      loadAthletes();
    } catch (err) {
      toast.error('Erro ao arquivar alerta');
    }
  };

  const loadAthletes = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (filterPosition) params.position = filterPosition;
      if (filterProfile) params.profile = filterProfile;

      const res = await api.getAthletes(params);
      setAthletes(res.data.athletes);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      toast.error('Erro ao carregar atletas');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    const toastId = toast.loading('Importando dados...');
    try {
      const res = await api.importXlsx(file);
      toast.success(
        `✅ ${res.data.athletesProcessed} atletas e ${res.data.sessionsImported} sessões importadas!`,
        { id: toastId, duration: 4000 }
      );
      loadStats();
      loadAthletes();
      loadUnreadCount();
      if (isAlertsOpen) loadAlerts();
    } catch (err) {
      toast.error(err.message || 'Erro ao importar arquivo', { id: toastId });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredAthletes = athletes.filter(a => {
    if (!search) return true;
    return (
      String(a.athleteId).includes(search) ||
      (a.position || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="app-layout">
      <Sidebar 
        user={user} 
        onLogout={handleLogout} 
        isAlertsOpen={isAlertsOpen}
        onAlertsClick={() => setIsAlertsOpen(prev => !prev)}
      />

      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Visão geral do desempenho dos atletas</p>
          </div>
          <div className="header-actions">
            <button 
              className="notification-bell-btn" 
              onClick={() => { setIsAlertsOpen(!isAlertsOpen); }}
              title="Notificações e Alertas"
            >
              <span className="bell-emoji">🔔</span>
              {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
            </button>
            <label id="btn-import" className={`import-btn ${importing ? 'loading' : ''}`} title="Importar xlsx">
              {importing ? <span className="spinner-sm" /> : '📥 Importar Dados'}
              <input
                id="input-file-import"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImport}
                disabled={importing}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </header>

        {/* Stats Cards */}
        {stats && (
          <section className="stats-grid">
            <StatCard
              id="stat-athletes"
              icon="👥"
              label="Total de Atletas"
              value={stats.totalAthletes}
              color="green"
            />
            <StatCard
              id="stat-sessions"
              icon="📊"
              label="Sessões Registradas"
              value={stats.totalSessions}
              color="blue"
            />
            <StatCard
              id="stat-alerts"
              icon="🔔"
              label="Alertas Pendentes"
              value={stats.pendingAlerts}
              color={stats.pendingAlerts > 0 ? 'red' : 'green'}
            />
            <StatCard
              id="stat-profiles"
              icon="🧬"
              label="Perfis Identificados"
              value={stats.profileDistribution?.length || 0}
              color="purple"
            />
          </section>
        )}

        {/* Filtros */}
        <section className="filters-bar">
          <input
            id="search-athlete"
            className="filter-input"
            type="text"
            placeholder="🔍 Buscar atleta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            id="filter-position"
            className="filter-select"
            value={filterPosition}
            onChange={(e) => { setFilterPosition(e.target.value === 'Todos' ? '' : e.target.value); setPage(1); }}
          >
            {POSITIONS.map(p => <option key={p} value={p === 'Todos' ? '' : p}>{p}</option>)}
          </select>
          <select
            id="filter-profile"
            className="filter-select"
            value={filterProfile}
            onChange={(e) => { setFilterProfile(e.target.value === 'Todos' ? '' : e.target.value); setPage(1); }}
          >
            {PROFILES.map(p => <option key={p} value={p === 'Todos' ? '' : p}>{p}</option>)}
          </select>
        </section>

        {/* Grid de Atletas */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : filteredAthletes.length === 0 ? (
          <div className="empty-state">
            <span>⚽</span>
            <p>Nenhum atleta encontrado. Importe os dados do xlsx para começar.</p>
          </div>
        ) : (
          <section className="athletes-grid">
            {filteredAthletes.map(athlete => (
              <AthleteCard
                key={athlete.id}
                athlete={athlete}
                onClick={() => navigate(`/athletes/${athlete.id}`)}
              />
            ))}
          </section>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              id="btn-prev-page"
              className="page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >← Anterior</button>
            <span className="page-info">Página {page} de {totalPages}</span>
            <button
              id="btn-next-page"
              className="page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >Próxima →</button>
          </div>
        )}
      </main>

      {/* Drawer de Alertas (Sprint 2) */}
      {isAlertsOpen && (
        <aside className="alerts-drawer">
          <div className="drawer-header">
            <h3>🔔 Central de Alertas</h3>
            <button className="close-drawer-btn" onClick={() => setIsAlertsOpen(false)}>✕</button>
          </div>
          
          <div className="drawer-content">
            {alerts.length === 0 ? (
              <div className="drawer-empty-state">
                <span className="empty-icon">⚽</span>
                <p>Nenhum alerta pendente!</p>
                <span className="empty-sub">Todo o plantel está 100% saudável.</span>
              </div>
            ) : (
              <div className="alerts-list">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`alert-item-card severity-${alert.severity.toLowerCase()}`}>
                    <div className="alert-item-header">
                      <span className={`alert-severity-dot severity-${alert.severity.toLowerCase()}`} />
                      <span className="alert-athlete-name">{alert.athlete?.name || `Atleta #${alert.athleteId}`}</span>
                      <span className="alert-athlete-pos">{alert.athlete?.position || ''}</span>
                    </div>
                    <p className="alert-item-msg">{alert.message}</p>
                    <div className="alert-item-footer">
                      <span className="alert-date">
                        {new Date(alert.createdAt).toLocaleDateString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <button 
                        className="mark-read-btn" 
                        onClick={() => handleMarkAsRead(alert.id)}
                        title="Marcar como resolvido"
                      >
                        ✔️ Resolvido
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
