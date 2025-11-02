import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await auth.signIn(email, password);
      navigate('/tasks');
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--gray-50) 100%)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', margin: 'var(--space-4)' }}>
        <div className="card-body" style={{ padding: 'var(--space-8)' }}>
          {/* Logo/Brand */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: '800', 
              color: 'var(--primary)',
              marginBottom: 'var(--space-2)'
            }}>
              Todo<span style={{ color: 'var(--gray-700)' }}>Pro</span>
            </div>
            <p style={{ color: 'var(--gray-600)' }}>Connectez-vous à votre compte</p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ 
              background: 'var(--error)', 
              color: 'white', 
              padding: 'var(--space-3)', 
              borderRadius: 'var(--radius)',
              marginBottom: 'var(--space-4)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Adresse email
              </label>
              <input 
                id="email"
                className="form-input"
                type="email" 
                placeholder="votre@email.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Mot de passe
              </label>
              <input 
                id="password"
                className="form-input"
                type="password" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !email || !password}
              style={{ 
                width: '100%', 
                marginTop: 'var(--space-4)',
                opacity: loading || !email || !password ? 0.6 : 1
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                  Connexion...
                </>
              ) : (
                '🔐 Se connecter'
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: 'var(--space-6)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--gray-200)'
          }}>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              Pas encore de compte ?{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: 'var(--primary)', 
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
