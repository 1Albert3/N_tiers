import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, toggleTask, deleteTask, updateTask } from '../api';
import { useAuth } from '../contexts/AuthContext';
import TaskForm from './TaskForm';

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

const TaskList: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<'created' | 'priority' | 'due_date'>('created');
  const [searchTerm, setSearchTerm] = useState('');

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
      setEditingTask(null);
    } catch (err: any) {
      setError(err.message || 'Échec de la création');
    }
  }

  async function handleUpdate(payload: any) {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, payload, token || undefined);
      await load();
      setEditingTask(null);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'Échec de la modification');
    }
  }

  function startEdit(task: Task) {
    setEditingTask(task);
    setShowForm(true);
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

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'active') return !task.is_completed;
      if (filter === 'completed') return task.is_completed;
      return true;
    })
    .filter(task => 
      searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority || 'low'] || 1) - (priorityOrder[a.priority || 'low'] || 1);
      }
      if (sortBy === 'due_date') {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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

        {/* Search and Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <input 
              type="text"
              placeholder="🔍 Rechercher une tâche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {(['all', 'active', 'completed'] as const).map(f => (
              <button
                key={f}
                className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(f)}
                style={{ fontSize: '0.875rem' }}
              >
                {f === 'all' ? '📋 Toutes' : f === 'active' ? '⏳ En cours' : '✅ Terminées'}
              </button>
            ))}
          </div>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'created' | 'priority' | 'due_date')}
            style={{
              padding: 'var(--space-2)',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem'
            }}
          >
            <option value="created">📅 Date de création</option>
            <option value="priority">🔥 Priorité</option>
            <option value="due_date">⏰ Échéance</option>
          </select>
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
        <div className="card" style={{ marginBottom: 'var(--space-6)', border: '2px solid #3b82f6' }}>
          <div className="card-header" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white' }}>
            <h3 className="card-title" style={{ margin: 0 }}>
              {editingTask ? '✏️ Modifier la tâche' : '✨ Nouvelle tâche'}
            </h3>
          </div>
          <div className="card-body">
            <TaskForm 
              onSave={editingTask ? handleUpdate : handleCreate} 
              initial={editingTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="card">
        <div className="card-body">
          {filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--gray-500)' }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>
                {filter === 'completed' ? '🎉' : filter === 'active' ? '🔍' : '📝'}
              </div>
              <h3 style={{ marginBottom: 'var(--space-2)', fontSize: '1.5rem' }}>
                {filter === 'completed' ? 'Aucune tâche terminée' : 
                 filter === 'active' ? 'Aucune tâche en cours' : 'Aucune tâche'}
              </h3>
              <p style={{ marginBottom: 'var(--space-4)' }}>
                {filter === 'completed' ? 'Terminez des tâches pour les voir ici !' :
                 filter === 'active' ? 'Toutes vos tâches sont terminées ! 🎉' :
                 'Commencez par créer votre première tâche !'}
              </p>
              {filter === 'all' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}
                  style={{ marginTop: 'var(--space-2)' }}
                >
                  ✨ Créer ma première tâche
                </button>
              )}
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
                  
                  {task.priority && (
                    <div style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      background: task.priority === 'high' ? '#fee2e2' : 
                                 task.priority === 'medium' ? '#fef3c7' : '#dcfce7',
                      color: task.priority === 'high' ? '#dc2626' : 
                             task.priority === 'medium' ? '#d97706' : '#16a34a',
                      border: `1px solid ${task.priority === 'high' ? '#fca5a5' : 
                                           task.priority === 'medium' ? '#fcd34d' : '#86efac'}`
                    }}>
                      {task.priority === 'high' ? '🔥 Urgent' : 
                       task.priority === 'medium' ? '⚠️ Important' : '🟢 Normal'}
                    </div>
                  )}
                  
                  {task.due_date && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: new Date(task.due_date) < new Date() ? '#dc2626' : '#6b7280',
                      fontWeight: new Date(task.due_date) < new Date() ? '600' : '400'
                    }}>
                      📅 {new Date(task.due_date).toLocaleDateString('fr-FR')}
                      {new Date(task.due_date) < new Date() && ' (⚠️ En retard)'}
                    </div>
                  )}
                  
                  <div className="task-actions" style={{ display: 'flex', gap: 'var(--space-1)' }}>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleToggle(task.id)}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {task.is_completed ? '↶ Réouvrir' : '✓ Terminer'}
                    </button>
                    <button 
                      className="btn btn-sm"
                      onClick={() => startEdit(task)}
                      style={{ 
                        fontSize: '0.75rem',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db'
                      }}
                    >
                      ✏️ Modifier
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(task.id)}
                      style={{ fontSize: '0.75rem' }}
                    >
                      🗑️
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
