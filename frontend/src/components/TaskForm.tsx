import React, { useState } from 'react';

type Props = { 
  onSave: (payload: any) => void; 
  initial?: any;
  onCancel?: () => void;
};

const TaskForm: React.FC<Props> = ({ onSave, initial, onCancel }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initial?.priority || 'medium');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  function validate() {
    const newErrors: {[key: string]: string} = {};
    
    if (!title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (title.length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères';
    }
    
    if (description && description.length > 500) {
      newErrors.description = 'La description ne peut pas dépasser 500 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      await onSave({ 
        title: title.trim(), 
        description: description.trim(), 
        priority 
      });
      
      // Reset form only if not editing
      if (!initial) {
        setTitle('');
        setDescription('');
        setPriority('medium');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  }

  const priorityOptions = [
    { value: 'low', label: '🟢 Faible', color: 'var(--success)' },
    { value: 'medium', label: '🟡 Moyenne', color: 'var(--warning)' },
    { value: 'high', label: '🔴 Élevée', color: 'var(--error)' }
  ];

  return (
    <form onSubmit={submit}>
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Titre de la tâche *
        </label>
        <input 
          id="title"
          className={`form-input ${errors.title ? 'error' : ''}`}
          placeholder="Ex: Finaliser le rapport mensuel"
          value={title} 
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors(prev => ({...prev, title: ''}));
          }}
          disabled={loading}
          style={{
            borderColor: errors.title ? 'var(--error)' : undefined
          }}
        />
        {errors.title && (
          <div style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: 'var(--space-1)' }}>
            {errors.title}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Description (optionnelle)
        </label>
        <textarea 
          id="description"
          className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
          placeholder="Détails supplémentaires sur cette tâche..."
          value={description} 
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors(prev => ({...prev, description: ''}));
          }}
          disabled={loading}
          rows={3}
          style={{
            borderColor: errors.description ? 'var(--error)' : undefined
          }}
        />
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'var(--gray-500)', 
          marginTop: 'var(--space-1)',
          textAlign: 'right'
        }}>
          {description.length}/500 caractères
        </div>
        {errors.description && (
          <div style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: 'var(--space-1)' }}>
            {errors.description}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Priorité
        </label>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {priorityOptions.map(option => (
            <label 
              key={option.value}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)',
                cursor: 'pointer',
                padding: 'var(--space-2) var(--space-3)',
                border: `2px solid ${priority === option.value ? option.color : 'var(--gray-200)'}`,
                borderRadius: 'var(--radius)',
                background: priority === option.value ? `${option.color}10` : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <input 
                type="radio" 
                name="priority" 
                value={option.value}
                checked={priority === option.value}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                style={{ display: 'none' }}
                disabled={loading}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
        {onCancel && (
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </button>
        )}
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !title.trim()}
          style={{
            opacity: loading || !title.trim() ? 0.6 : 1,
            cursor: loading || !title.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
              Enregistrement...
            </>
          ) : (
            <>
              💾 {initial ? 'Modifier' : 'Créer la tâche'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
