import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './App.css';

const Nav: React.FC = () => {
  const auth = useAuth();
  const [apiOk, setApiOk] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const base = (await import('./api')).default;
        const res = await fetch(`${base}/health`);
        if (!cancelled) setApiOk(res.ok);
      } catch (e) {
        if (!cancelled) setApiOk(false);
      }
    }
    check();
    const id = setInterval(check, 20000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <nav className="nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <Link to="/" style={{ fontWeight: '600' }}>Dashboard</Link>
        <Link to="/tasks">Tâches</Link>
      </div>
      
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
        {/* API Status */}
        <div className="status-indicator" style={{
          color: apiOk ? 'var(--success)' : apiOk === false ? 'var(--error)' : 'var(--gray-500)'
        }}>
          <div className={`status-dot ${apiOk ? 'status-success' : apiOk === false ? 'status-error' : 'status-warning'}`} />
          API {apiOk ? 'Connectée' : apiOk === false ? 'Déconnectée' : 'Vérification...'}
        </div>
        
        {auth.user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--gray-100)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {auth.user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: '500' }}>{auth.user.name}</span>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={auth.signOut}
            >
              🚪 Déconnexion
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Link to="/login" className="btn btn-secondary btn-sm">Connexion</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Inscription</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const Home: React.FC = () => (
  <div style={{ 
    padding: 'var(--space-8)', 
    maxWidth: '800px', 
    margin: '0 auto',
    textAlign: 'center'
  }}>
    <div className="fade-in">
      <h1 style={{ 
        fontSize: '3rem', 
        fontWeight: '800', 
        marginBottom: 'var(--space-4)',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Bienvenue sur TodoPro
      </h1>
      <p style={{ 
        fontSize: '1.25rem', 
        color: 'var(--gray-600)',
        marginBottom: 'var(--space-8)'
      }}>
        Votre gestionnaire de tâches professionnel
      </p>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
        marginTop: 'var(--space-8)'
      }}>
        <div className="card hover-lift">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>⚙️</div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Architecture 3-Tiers</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              React + Laravel + PostgreSQL
            </p>
          </div>
        </div>
        <div className="card hover-lift">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🚀</div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>DevOps Ready</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              Docker + CI/CD + Kubernetes
            </p>
          </div>
        </div>
        <div className="card hover-lift">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🎨</div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Design Moderne</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              Interface professionnelle et responsive
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-grid">
          <Sidebar />
          <main className="main-content">
            <Nav />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/reports" element={<div style={{ padding: 20 }}>Reporting coming soon</div>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
