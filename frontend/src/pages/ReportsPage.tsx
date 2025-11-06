import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchTasks } from '../api';

interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  category?: string;
}

const ReportsPage: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadTasks();
  }, [token]);

  async function loadTasks() {
    try {
      const data = await fetchTasks(token || undefined);
      setTasks(data.data || data);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
    } finally {
      setLoading(false);
    }
  }

  const now = new Date();
  const getDateRange = () => {
    const end = new Date(now);
    const start = new Date(now);
    
    if (selectedPeriod === 'week') {
      start.setDate(now.getDate() - 7);
    } else if (selectedPeriod === 'month') {
      start.setMonth(now.getMonth() - 1);
    } else {
      start.setFullYear(now.getFullYear() - 1);
    }
    
    return { start, end };
  };

  const { start, end } = getDateRange();
  const periodTasks = tasks.filter(task => {
    const taskDate = new Date(task.created_at);
    return taskDate >= start && taskDate <= end;
  });

  const stats = {
    total: periodTasks.length,
    completed: periodTasks.filter(t => t.is_completed).length,
    pending: periodTasks.filter(t => !t.is_completed).length,
    overdue: periodTasks.filter(t => 
      t.due_date && 
      new Date(t.due_date) < now && 
      !t.is_completed
    ).length,
    byPriority: {
      high: periodTasks.filter(t => t.priority === 'high').length,
      medium: periodTasks.filter(t => t.priority === 'medium').length,
      low: periodTasks.filter(t => t.priority === 'low').length,
    },
    byCategory: periodTasks.reduce((acc, task) => {
      const cat = task.category || 'other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const productivityScore = Math.max(0, Math.min(100, 
    (completionRate * 0.6) + 
    (Math.max(0, 100 - (stats.overdue / Math.max(1, stats.total)) * 100) * 0.4)
  ));

  const categoryLabels: Record<string, string> = {
    work: '💼 Travail',
    personal: '🏠 Personnel', 
    health: '🏥 Santé',
    finance: '💰 Finance',
    education: '📚 Éducation',
    other: '📌 Autre'
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>📊</div>
        <p>Génération de vos rapports...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '800', 
          color: 'var(--gray-900)',
          marginBottom: 'var(--space-2)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)'
        }}>
          📊 Rapports & Analytics
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)' }}>
          Analysez votre productivité et suivez vos progrès
        </p>
      </div>

      {/* Period Selector */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {(['week', 'month', 'year'] as const).map(period => (
            <button
              key={period}
              className={`btn ${selectedPeriod === period ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period === 'week' ? '📅 7 derniers jours' : 
               period === 'month' ? '📆 30 derniers jours' : 
               '🗓️ 12 derniers mois'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 'var(--space-4)', 
        marginBottom: 'var(--space-8)' 
      }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>🎯</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: 'var(--space-1)' }}>
              {productivityScore}%
            </div>
            <div style={{ opacity: 0.9 }}>Score de Productivité</div>
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>✅</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: 'var(--space-1)' }}>
              {completionRate}%
            </div>
            <div style={{ opacity: 0.9 }}>Taux de Réussite</div>
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>⏳</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: 'var(--space-1)' }}>
              {stats.pending}
            </div>
            <div style={{ opacity: 0.9 }}>Tâches en Cours</div>
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>🚨</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: 'var(--space-1)' }}>
              {stats.overdue}
            </div>
            <div style={{ opacity: 0.9 }}>Tâches en Retard</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)' }}>
        
        {/* Priority Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🔥 Répartition par Priorité</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {Object.entries(stats.byPriority).map(([priority, count]) => {
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                const colors = {
                  high: '#ef4444',
                  medium: '#f59e0b', 
                  low: '#10b981'
                };
                
                return (
                  <div key={priority} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ minWidth: '80px', fontSize: '0.875rem', fontWeight: '500' }}>
                      {priority === 'high' ? '🔴 Élevée' : 
                       priority === 'medium' ? '🟡 Moyenne' : '🟢 Faible'}
                    </div>
                    <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '8px', height: '24px', position: 'relative' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: colors[priority as keyof typeof colors],
                        borderRadius: '8px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <div style={{ minWidth: '60px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600' }}>
                      {count} ({Math.round(percentage)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📊 Répartition par Catégorie</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {Object.entries(stats.byCategory).map(([category, count]) => {
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#6b7280'];
                const colorIndex = Object.keys(stats.byCategory).indexOf(category) % colors.length;
                
                return (
                  <div key={category} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ minWidth: '100px', fontSize: '0.875rem', fontWeight: '500' }}>
                      {categoryLabels[category] || category}
                    </div>
                    <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '8px', height: '24px' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: colors[colorIndex],
                        borderRadius: '8px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <div style={{ minWidth: '60px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600' }}>
                      {count} ({Math.round(percentage)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="card" style={{ marginTop: 'var(--space-8)' }}>
        <div className="card-header">
          <h3 className="card-title">💡 Insights & Recommandations</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            
            {completionRate >= 80 && (
              <div style={{ 
                padding: 'var(--space-4)', 
                background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', 
                borderRadius: '12px',
                border: '1px solid #86efac'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>🎉</div>
                <h4 style={{ color: '#16a34a', marginBottom: 'var(--space-1)' }}>Excellente Performance !</h4>
                <p style={{ color: '#15803d', fontSize: '0.875rem' }}>
                  Votre taux de réussite de {completionRate}% est remarquable. Continuez sur cette lancée !
                </p>
              </div>
            )}

            {stats.overdue > 0 && (
              <div style={{ 
                padding: 'var(--space-4)', 
                background: 'linear-gradient(135deg, #fee2e2, #fecaca)', 
                borderRadius: '12px',
                border: '1px solid #fca5a5'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>⚠️</div>
                <h4 style={{ color: '#dc2626', marginBottom: 'var(--space-1)' }}>Attention aux Retards</h4>
                <p style={{ color: '#b91c1c', fontSize: '0.875rem' }}>
                  Vous avez {stats.overdue} tâche(s) en retard. Priorisez-les pour améliorer votre productivité.
                </p>
              </div>
            )}

            {stats.byPriority.high > stats.byPriority.low + stats.byPriority.medium && (
              <div style={{ 
                padding: 'var(--space-4)', 
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)', 
                borderRadius: '12px',
                border: '1px solid #fcd34d'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>🔥</div>
                <h4 style={{ color: '#d97706', marginBottom: 'var(--space-1)' }}>Beaucoup de Priorités Élevées</h4>
                <p style={{ color: '#b45309', fontSize: '0.875rem' }}>
                  Essayez de mieux équilibrer vos priorités pour réduire le stress et améliorer l'efficacité.
                </p>
              </div>
            )}

            {stats.total === 0 && (
              <div style={{ 
                padding: 'var(--space-4)', 
                background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)', 
                borderRadius: '12px',
                border: '1px solid #a5b4fc'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>🚀</div>
                <h4 style={{ color: '#4338ca', marginBottom: 'var(--space-1)' }}>Commencez Votre Journey !</h4>
                <p style={{ color: '#3730a3', fontSize: '0.875rem' }}>
                  Créez vos premières tâches pour commencer à suivre votre productivité.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;