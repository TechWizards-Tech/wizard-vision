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
  { to: '/athletes', icon: '👥', label: 'Atletas' },
  { to: '/alerts', icon: '🔔', label: 'Alertas' },
  { to: '/import', icon: '📥', label: 'Importar' },
];

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-brand">
        <span className="sidebar-icon">⚽</span>
        <span className="sidebar-name">AtletaTrack</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
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
