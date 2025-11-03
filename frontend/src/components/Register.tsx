import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StyledInput from './StyledInput';
import PasswordStrength from './PasswordStrength';

const Register: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      await auth.signUp(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setErrors({ general: err.message || 'Échec de l\'inscription' });
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
          <h1 className="auth-title">Créer un compte ✨</h1>
          <p className="auth-subtitle">Rejoignez TodoPro et organisez votre vie</p>
        </div>

        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <StyledInput
            type="text"
            label="Nom complet"
            value={formData.name}
            onChange={(value) => updateField('name', value)}
            required
            disabled={loading}
            error={errors.name}
            icon="👤"
          />

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

          <div>
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
            <PasswordStrength password={formData.password} />
          </div>

          <StyledInput
            type="password"
            label="Confirmer le mot de passe"
            value={formData.confirmPassword}
            onChange={(value) => updateField('confirmPassword', value)}
            required
            disabled={loading}
            error={errors.confirmPassword}
            icon="🔐"
          />

          <button 
            type="submit" 
            disabled={loading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword} 
            className="btn-auth"
          >
            {loading ? (
              <>
                <span style={{ marginRight: '8px' }}>⏳</span>
                Création du compte...
              </>
            ) : (
              <>
                <span style={{ marginRight: '8px' }}>🎉</span>
                Créer mon compte
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          ou
        </div>

        <div className="auth-footer">
          <p>
            Déjà un compte ?{' '}
            <Link to="/login" className="auth-link">
              Se connecter
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

export default Register;