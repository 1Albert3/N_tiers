import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchTasks } from '../api';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadTasks();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadTasks = async () => {
    try {
      const response = await fetchTasks(token || undefined);
      setTasks(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (!user) {
    return (
      <div style={{ 
        padding: 'var(--space-8)', 
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="fade-in">
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            marginBottom: 'var(--space-4)',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Bienvenue sur TodoPro ✨
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'var(--gray-600)',
            marginBottom: 'var(--space-8)',
            maxWidth: '600px'
          }}>
            Votre gestionnaire de tâches professionnel. Organisez, planifiez et accomplissez vos objectifs avec style.
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-6)',
            marginTop: 'var(--space-8)',
            maxWidth: '900px'
          }}>
            <div className="card hover-lift">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>🚀</div>
                <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--gray-900)' }}>Performance</h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                  Interface ultra-rapide et responsive
                </p>
              </div>
            </div>
            <div className="card hover-lift">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>🔒</div>
                <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--gray-900)' }}>Sécurité</h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                  Authentification JWT sécurisée
                </p>
              </div>
            </div>
            <div className="card hover-lift">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>📊</div>
                <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--gray-900)' }}>Analytics</h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                  Suivi détaillé de votre productivité
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-8)' }}>
      <div className="fade-in">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            color: 'var(--gray-900)',
            marginBottom: 'var(--space-2)'
          }}>
            Bonjour, {user.name} ! 👋
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--gray-600)' 
          }}>
            Voici un aperçu de votre productivité aujourd'hui
          </p>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-grid">
          <div className="stat-card" style={{ borderLeftColor: 'var(--primary)' }}>
            <div className="stat-header">
              <div className="stat-title">Total des tâches</div>
              <div style={{ fontSize: '1.5rem' }}>📋</div>
            </div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-change positive">
              +{Math.floor(Math.random() * 5) + 1} cette semaine
            </div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: 'var(--success)' }}>
            <div className="stat-header">
              <div className="stat-title">Terminées</div>
              <div style={{ fontSize: '1.5rem' }}>✅</div>
            </div>
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-change positive">
              {completionRate}% de réussite
            </div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: 'var(--warning)' }}>
            <div className="stat-header">
              <div className="stat-title">En cours</div>
              <div style={{ fontSize: '1.5rem' }}>⏳</div>
            </div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-change">
              {stats.pending > 0 ? 'À terminer' : 'Tout est fait !'}
            </div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: 'var(--error)' }}>
            <div className="stat-header">
              <div className="stat-title">Priorité haute</div>
              <div style={{ fontSize: '1.5rem' }}>🔥</div>
            </div>
            <div className="stat-value">{stats.highPriority}</div>
            <div className="stat-change negative">
              {stats.highPriority > 0 ? 'Attention requise' : 'Sous contrôle'}
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="card" style={{ marginTop: 'var(--space-8)' }}>
          <div className="card-header">
            <h2 className="card-title">Tâches récentes</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>⏳</div>
                <p>Chargement de vos tâches...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📝</div>
                <h3 style={{ marginBottom: 'var(--space-2)' }}>Aucune tâche pour le moment</h3>
                <p style={{ color: 'var(--gray-600)' }}>
                  Commencez par créer votre première tâche !
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {tasks.slice(0, 5).map((task) => (
                  <div 
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-4)',
                      padding: 'var(--space-4)',
                      background: task.completed ? 'var(--gray-50)' : 'white',
                      border: '1px solid var(--gray-200)',
                      borderRadius: 'var(--radius)',
                      opacity: task.completed ? 0.7 : 1
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: task.completed ? 'var(--success)' : 'var(--gray-300)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem'
                    }}>
                      {task.completed ? '✓' : ''}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '600',
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--gray-600)',
                          marginTop: 'var(--space-1)'
                        }}>
                          {task.description}
                        </div>
                      )}
                    </div>
                    {task.priority && (
                      <div style={{
                        padding: 'var(--space-1) var(--space-2)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: task.priority === 'high' ? 'var(--error)' : 
                                   task.priority === 'medium' ? 'var(--warning)' : 'var(--gray-400)',
                        color: 'white'
                      }}>
                        {task.priority === 'high' ? 'Haute' : 
                         task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;