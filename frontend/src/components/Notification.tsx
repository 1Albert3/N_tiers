import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return 'var(--success)';
      case 'error': return 'var(--error)';
      case 'warning': return 'var(--warning)';
      case 'info': return 'var(--primary)';
      default: return 'var(--primary)';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 'var(--space-4)',
        right: 'var(--space-4)',
        background: 'white',
        border: `1px solid ${getColor()}`,
        borderRadius: 'var(--radius)',
        padding: 'var(--space-4)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        maxWidth: '400px',
        zIndex: 1000,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ fontSize: '1.2rem' }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontWeight: '500', 
          color: 'var(--gray-900)',
          marginBottom: 'var(--space-1)'
        }}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </div>
        <div style={{ 
          fontSize: '0.875rem', 
          color: 'var(--gray-600)' 
        }}>
          {message}
        </div>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--gray-400)',
          fontSize: '1.2rem',
          padding: 'var(--space-1)',
        }}
      >
        ×
      </button>
    </div>
  );
};

// Hook pour gérer les notifications
export const useNotification = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>>([]);

  const addNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotificationContainer = () => (
    <>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );

  return {
    addNotification,
    NotificationContainer,
    success: (message: string) => addNotification(message, 'success'),
    error: (message: string) => addNotification(message, 'error'),
    warning: (message: string) => addNotification(message, 'warning'),
    info: (message: string) => addNotification(message, 'info'),
  };
};

export default Notification;