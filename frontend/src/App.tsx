import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
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
        {auth.user && <Link to="/tasks">Tâches</Link>}
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

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  if (!auth.user) {
    return <LandingPage />;
  }

  return (
    <div className="app-grid">
      <Sidebar />
      <main className="main-content">
        <Nav />
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                <h2>📊 Rapports</h2>
                <p>Fonctionnalité en cours de développement...</p>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;