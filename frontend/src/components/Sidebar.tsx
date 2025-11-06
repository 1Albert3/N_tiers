import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/tasks', icon: '✅', label: 'Mes Tâches' },
    { path: '/reports', icon: '📈', label: 'Rapports' },
  ];

  return (
    <div className="sidebar">
      <div className="brand">
        Todo<span>Pro</span>
      </div>
      
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-4)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: '500', color: 'var(--white)' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
              {user.email}
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
          TodoPro v1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;