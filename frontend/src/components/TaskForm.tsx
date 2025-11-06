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
  const [dueDate, setDueDate] = useState(initial?.due_date || '');
  const [category, setCategory] = useState(initial?.category || 'work');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  function validate() {
    const newErrors: {[key: string]: string} = {};
    
    if (!title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (title.length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères';
    } else if (title.length > 100) {
      newErrors.title = 'Le titre ne peut pas dépasser 100 caractères';
    }
    
    if (description && description.length > 500) {
      newErrors.description = 'La description ne peut pas dépasser 500 caractères';
    }
    
    if (dueDate) {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'La date d\'échéance ne peut pas être dans le passé';
      }
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
        priority,
        due_date: dueDate || null,
        category
      });
      
      // Reset form only if not editing
      if (!initial) {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueDate('');
        setCategory('work');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  }

  const priorityOptions = [
    { value: 'low', label: '🟢 Faible', color: '#10b981', desc: 'Peut attendre' },
    { value: 'medium', label: '🟡 Moyenne', color: '#f59e0b', desc: 'Important' },
    { value: 'high', label: '🔴 Élevée', color: '#ef4444', desc: 'Urgent' }
  ];
  
  const categoryOptions = [
    { value: 'work', label: '💼 Travail', color: '#3b82f6' },
    { value: 'personal', label: '🏠 Personnel', color: '#8b5cf6' },
    { value: 'health', label: '🏥 Santé', color: '#10b981' },
    { value: 'finance', label: '💰 Finance', color: '#f59e0b' },
    { value: 'education', label: '📚 Éducation', color: '#06b6d4' },
    { value: 'other', label: '📌 Autre', color: '#6b7280' }
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--space-2)' }}>
          {priorityOptions.map(option => (
            <label 
              key={option.value}
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                gap: 'var(--space-1)',
                cursor: 'pointer',
                padding: 'var(--space-3)',
                border: `2px solid ${priority === option.value ? option.color : '#e5e7eb'}`,
                borderRadius: '12px',
                background: priority === option.value ? `${option.color}15` : 'white',
                transition: 'all 0.2s ease',
                boxShadow: priority === option.value ? `0 4px 12px ${option.color}25` : '0 1px 3px rgba(0,0,0,0.1)'
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
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                {option.label}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
                {option.desc}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="category">
          Catégorie
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 'var(--space-2)' }}>
          {categoryOptions.map(option => (
            <label 
              key={option.value}
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                gap: 'var(--space-1)',
                cursor: 'pointer',
                padding: 'var(--space-2)',
                border: `2px solid ${category === option.value ? option.color : '#e5e7eb'}`,
                borderRadius: '8px',
                background: category === option.value ? `${option.color}15` : 'white',
                transition: 'all 0.2s ease',
                fontSize: '0.75rem'
              }}
            >
              <input 
                type="radio" 
                name="category" 
                value={option.value}
                checked={category === option.value}
                onChange={(e) => setCategory(e.target.value)}
                style={{ display: 'none' }}
                disabled={loading}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="dueDate">
          Date d'échéance (optionnelle)
        </label>
        <input 
          id="dueDate"
          type="date"
          className={`form-input ${errors.dueDate ? 'error' : ''}`}
          value={dueDate} 
          onChange={(e) => {
            setDueDate(e.target.value);
            if (errors.dueDate) setErrors(prev => ({...prev, dueDate: ''}));
          }}
          disabled={loading}
          min={new Date().toISOString().split('T')[0]}
          style={{
            borderColor: errors.dueDate ? '#ef4444' : undefined
          }}
        />
        {errors.dueDate && (
          <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: 'var(--space-1)' }}>
            {errors.dueDate}
          </div>
        )}
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
              {initial ? '✏️ Modifier la tâche' : '✨ Créer la tâche'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
