import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const PROFILE_COLORS = {
  explosivo: '#f59e0b',
  alta_resistencia: '#10b981',
  alta_carga_impacto: '#ef4444',
  baixa_intensidade: '#6366f1',
};

const NAV_ITEMS = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/athletes', icon: '👥', label: 'Atletas', disabled: true },
  { to: '/alerts', icon: '🔔', label: 'Alertas' },
  { to: '/import', icon: '📥', label: 'Importar', disabled: true },
];

export default function Sidebar({ user, onLogout, isAlertsOpen, onAlertsClick }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-brand">
        <span className="sidebar-icon">⚽</span>
        <span className="sidebar-name">WizardVision</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => {
          if (item.disabled) {
            return (
              <div
                key={item.to}
                className="nav-item disabled"
                title="Disponível na Sprint 3"
                style={{ opacity: 0.4, cursor: 'not-allowed' }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </div>
            );
          }

          if (item.to === '/alerts' && onAlertsClick) {
            return (
              <button
                key={item.to}
                onClick={(e) => {
                  e.preventDefault();
                  onAlertsClick();
                }}
                className={`nav-item ${isAlertsOpen ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', font: 'inherit', color: 'inherit', cursor: 'pointer' }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Usuário'}</span>
            <span className="user-role">{user?.role === 'ADMIN' ? 'Administrador' : 'Staff'}</span>
          </div>
        </div>
        <button id="btn-logout" className="logout-btn" onClick={onLogout} title="Sair">
          🚪
        </button>
      </div>
    </aside>
  );
}
