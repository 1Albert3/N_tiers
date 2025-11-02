import React, { useEffect, useState } from 'react';
import { fetchTasks } from '../api';
import { useAuth } from '../contexts/AuthContext';

interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: string;
  priority?: 'low' | 'medium' | 'high';
}

const Dashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchTasks(token || undefined);
        setTasks(data.data || data);
      } catch (err) {
        console.error('Erreur chargement dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.is_completed).length,
    active: tasks.filter(t => !t.is_completed).length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.is_completed).length / tasks.length) * 100) : 0
  };

  const recentTasks = tasks
    .filter(t => !t.is_completed)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const priorityStats = {
    high: tasks.filter(t => !t.is_completed && t.priority === 'high').length,
    medium: tasks.filter(t => !t.is_completed && t.priority === 'medium').length,
    low: tasks.filter(t => !t.is_completed && t.priority === 'low').length
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-6)' }}>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>⏳</div>
            <p>Chargement du tableau de bord...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--gray-900)', marginBottom: 'var(--space-2)' }}>
          Bonjour {user?.name || 'Utilisateur'} 👋
        </h1>
        <p style={{ color: 'var(--gray-600)', fontSize: '1.125rem' }}>
          Voici un aperçu de vos tâches aujourd'hui
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white' }}>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{stats.total}</div>
                <div style={{ opacity: 0.9 }}>Tâches totales</div>
              </div>
              <div style={{ fontSize: '2rem', opacity: 0.8 }}>📋</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, var(--warning) 0%, #f97316 100%)', color: 'white' }}>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{stats.active}</div>
                <div style={{ opacity: 0.9 }}>En cours</div>
              </div>
              <div style={{ fontSize: '2rem', opacity: 0.8 }}>⏰</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, var(--success) 0%, #059669 100%)', color: 'white' }}>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{stats.completed}</div>
                <div style={{ opacity: 0.9 }}>Terminées</div>
              </div>
              <div style={{ fontSize: '2rem', opacity: 0.8 }}>✅</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>{stats.completionRate}%</div>
                <div style={{ color: 'var(--gray-600)' }}>Taux de completion</div>
              </div>
              <div style={{ fontSize: '2rem' }}>📊</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        {/* Recent Tasks */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tâches récentes</h3>
          </div>
          <div className="card-body">
            {recentTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--gray-500)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🎉</div>
                <p>Aucune tâche en cours !</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {recentTasks.map(task => (
                  <div key={task.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    background: 'var(--gray-50)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--gray-200)'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: task.priority === 'high' ? 'var(--error)' : 
                                 task.priority === 'medium' ? 'var(--warning)' : 'var(--success)'
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', color: 'var(--gray-900)' }}>{task.title}</div>
                      {task.description && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                          {task.description.length > 60 ? task.description.substring(0, 60) + '...' : task.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Priorités</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--error)' }} />
                  <span>Élevée</span>
                </div>
                <span style={{ fontWeight: '600', color: 'var(--error)' }}>{priorityStats.high}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--warning)' }} />
                  <span>Moyenne</span>
                </div>
                <span style={{ fontWeight: '600', color: 'var(--warning)' }}>{priorityStats.medium}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success)' }} />
                  <span>Faible</span>
                </div>
                <span style={{ fontWeight: '600', color: 'var(--success)' }}>{priorityStats.low}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
