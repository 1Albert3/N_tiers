import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StyledInput from './StyledInput';

const Login: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      await auth.signIn(formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setErrors({ general: err.message || 'Échec de la connexion' });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Bon retour ! 👋</h1>
          <p className="auth-subtitle">Connectez-vous à votre compte TodoPro</p>
        </div>

        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <StyledInput
            type="email"
            label="Adresse email"
            value={formData.email}
            onChange={(value) => updateField('email', value)}
            required
            disabled={loading}
            error={errors.email}
            icon="📧"
          />

          <StyledInput
            type="password"
            label="Mot de passe"
            value={formData.password}
            onChange={(value) => updateField('password', value)}
            required
            disabled={loading}
            error={errors.password}
            icon="🔒"
          />

          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            marginBottom: 'var(--space-4)' 
          }}>
            <Link 
              to="/forgot-password" 
              className="auth-link"
              style={{ fontSize: '0.875rem' }}
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading || !formData.email || !formData.password} 
            className="btn-auth"
          >
            {loading ? (
              <>
                <span style={{ marginRight: '8px' }}>⏳</span>
                Connexion en cours...
              </>
            ) : (
              <>
                <span style={{ marginRight: '8px' }}>🚀</span>
                Se connecter
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          ou
        </div>

        <div className="auth-footer">
          <p>
            Pas encore de compte ?{' '}
            <Link to="/register" className="auth-link">
              Créer un compte
            </Link>
          </p>
          <p style={{ marginTop: 'var(--space-3)' }}>
            <Link to="/" className="auth-link">
              ← Retour à l'accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;