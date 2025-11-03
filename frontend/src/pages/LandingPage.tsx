import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <Link to="/" className="landing-logo">
          TodoPro ✨
        </Link>
        <div className="landing-nav-buttons">
          <Link to="/login" className="btn btn-glass">
            Se connecter
          </Link>
          <Link to="/register" className="btn btn-glass">
            Créer un compte
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Gérez vos tâches comme un pro
          </h1>
          <p className="hero-subtitle">
            Une application moderne et intuitive pour organiser votre travail, 
            suivre vos projets et atteindre vos objectifs avec style.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-hero btn-hero-primary">
              Commencer gratuitement
            </Link>
            <Link to="/login" className="btn btn-hero btn-hero-secondary">
              J'ai déjà un compte
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            color: 'var(--gray-900)',
            marginBottom: 'var(--space-4)'
          }}>
            Pourquoi choisir TodoPro ?
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--gray-600)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Une solution complète pour gérer vos tâches avec style et efficacité
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card float-animation">
            <div className="feature-icon">🚀</div>
            <h3 className="feature-title">Performance Optimale</h3>
            <p className="feature-description">
              Interface ultra-rapide construite avec React et TypeScript 
              pour une expérience utilisateur fluide et réactive.
            </p>
          </div>
          
          <div className="feature-card float-animation" style={{ animationDelay: '0.5s' }}>
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Sécurité Avancée</h3>
            <p className="feature-description">
              Authentification sécurisée et chiffrement des données 
              pour protéger vos informations personnelles.
            </p>
          </div>
          
          <div className="feature-card float-animation" style={{ animationDelay: '1s' }}>
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">Design Responsive</h3>
            <p className="feature-description">
              Interface adaptative qui fonctionne parfaitement sur tous 
              vos appareils : desktop, tablette et mobile.
            </p>
          </div>
          
          <div className="feature-card float-animation" style={{ animationDelay: '1.5s' }}>
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Synchronisation</h3>
            <p className="feature-description">
              Vos tâches sont synchronisées en temps réel 
              pour rester toujours à jour sur tous vos appareils.
            </p>
          </div>
          
          <div className="feature-card float-animation" style={{ animationDelay: '2s' }}>
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Analytics Avancés</h3>
            <p className="feature-description">
              Tableaux de bord détaillés et statistiques pour suivre 
              votre productivité et optimiser votre workflow.
            </p>
          </div>
          
          <div className="feature-card float-animation" style={{ animationDelay: '2.5s' }}>
            <div className="feature-icon">🎨</div>
            <h3 className="feature-title">Interface Moderne</h3>
            <p className="feature-description">
              Design élégant et animations fluides pour une expérience 
              utilisateur premium et professionnelle.
            </p>
          </div>
        </div>
        
        {/* CTA Section */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: 'var(--space-12)',
          padding: 'var(--space-8)',
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <h3 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '700', 
            marginBottom: 'var(--space-4)',
            color: 'var(--gray-900)'
          }}>
            Prêt à booster votre productivité ?
          </h3>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--gray-600)',
            marginBottom: 'var(--space-6)'
          }}>
            Rejoignez des milliers d'utilisateurs qui ont transformé leur façon de travailler
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary" style={{ 
              padding: 'var(--space-4) var(--space-8)',
              fontSize: '1.125rem'
            }}>
              🎯 Commencer maintenant
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ 
              padding: 'var(--space-4) var(--space-8)',
              fontSize: '1.125rem'
            }}>
              🔑 Se connecter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;