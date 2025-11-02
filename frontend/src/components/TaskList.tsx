import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, toggleTask, deleteTask } from '../api';
import { useAuth } from '../contexts/AuthContext';
import TaskForm from './TaskForm';

interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: string;
  priority?: 'low' | 'medium' | 'high';
}

const TaskList: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchTasks(token || undefined);
      setTasks(data.data || data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Échec du chargement des tâches');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [token]);

  async function handleCreate(payload: any) {
    try {
      await createTask(payload, token || undefined);
      await load();
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'Échec de la création');
    }
  }

  async function handleToggle(id: number) {
    try {
      await toggleTask(id, token || undefined);
      await load();
    } catch (err: any) {
      setError(err.message || 'Échec de la mise à jour');
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;
    try {
      await deleteTask(id, token || undefined);
      await load();
    } catch (err: any) {
      setError(err.message || 'Échec de la suppression');
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.is_completed;
    if (filter === 'completed') return task.is_completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.is_completed).length,
    active: tasks.filter(t => !t.is_completed).length
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-6)' }}>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>⏳</div>
            <p>Chargement de vos tâches...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--gray-900)' }}>Mes Tâches</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Annuler' : '+ Nouvelle tâche'}
          </button>
        </div>
        
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>{stats.total}</div>
              <div style={{ color: 'var(--gray-600)' }}>Total</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning)' }}>{stats.active}</div>
              <div style={{ color: 'var(--gray-600)' }}>En cours</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>{stats.completed}</div>
              <div style={{ color: 'var(--gray-600)' }}>Terminées</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Toutes' : f === 'active' ? 'En cours' : 'Terminées'}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="card" style={{ marginBottom: 'var(--space-6)', border: '1px solid var(--error)' }}>
          <div className="card-body" style={{ color: 'var(--error)' }}>
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* Task Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-header">
            <h3 className="card-title">Nouvelle tâche</h3>
          </div>
          <div className="card-body">
            <TaskForm onSave={handleCreate} />
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="card">
        <div className="card-body">
          {filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--gray-500)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📝</div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Aucune tâche</h3>
              <p>Commencez par créer votre première tâche !</p>
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <div key={task.id} className={`task-item ${task.is_completed ? 'completed' : ''}`}>
                  <div 
                    className={`task-checkbox ${task.is_completed ? 'checked' : ''}`}
                    onClick={() => handleToggle(task.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  >
                    {task.is_completed && '✓'}
                  </div>
                  
                  <div className="task-content">
                    <div className="task-title" style={{ textDecoration: task.is_completed ? 'line-through' : 'none' }}>
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="task-description">
                        {task.description}
                      </div>
                    )}
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 'var(--space-1)' }}>
                      {new Date(task.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  <div className="task-actions">
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleToggle(task.id)}
                    >
                      {task.is_completed ? '↶ Réouvrir' : '✓ Terminer'}
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(task.id)}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
