import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const getStrengthLabel = (score: number) => {
    if (score < 2) return { label: 'Faible', class: 'strength-weak' };
    if (score < 4) return { label: 'Moyen', class: 'strength-medium' };
    return { label: 'Fort', class: 'strength-strong' };
  };

  const score = getStrength(password);
  const strength = getStrengthLabel(score);

  if (!password) return null;

  return (
    <div className="password-strength">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--space-1)'
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
          Force du mot de passe
        </span>
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: '600',
          color: strength.class === 'strength-weak' ? 'var(--error)' :
                 strength.class === 'strength-medium' ? 'var(--warning)' : 'var(--success)'
        }}>
          {strength.label}
        </span>
      </div>
      <div className={`strength-bar ${strength.class}`}>
        <div className="strength-fill"></div>
      </div>
      <div style={{ 
        fontSize: '0.75rem', 
        color: 'var(--gray-500)', 
        marginTop: 'var(--space-1)' 
      }}>
        {score < 2 && 'Utilisez au moins 8 caractères avec majuscules, chiffres et symboles'}
        {score >= 2 && score < 4 && 'Bon début ! Ajoutez des caractères spéciaux pour plus de sécurité'}
        {score >= 4 && 'Excellent ! Votre mot de passe est sécurisé'}
      </div>
    </div>
  );
};

export default PasswordStrength;