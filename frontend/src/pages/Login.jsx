import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background animado */}
      <div className="login-bg">
        <div className="login-bg-orb orb-1" />
        <div className="login-bg-orb orb-2" />
        <div className="login-bg-orb orb-3" />
      </div>

      <div className="login-container">
        {/* Logo/Marca */}
        <div className="login-brand">
          <div className="login-brand-icon">⚽</div>
          <h1 className="login-brand-name">AtletaTrack</h1>
          <p className="login-brand-subtitle">Sistema de Análise de Desempenho</p>
        </div>

        {/* Card */}
        <div className="login-card">
          <div className="login-card-header">
            <h2>Bem-vindo de volta</h2>
            <p>Entre com suas credenciais para continuar</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              id="btn-login"
              type="submit"
              className={`login-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Não tem uma conta? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Criar conta</Link></p>
            <span style={{ display: 'block', marginTop: '1rem' }}>FATEC Jacareí · 5° DSM · 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
