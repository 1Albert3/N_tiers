import React, { useState } from 'react';

interface StyledInputProps {
  type: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  icon?: string;
}

const StyledInput: React.FC<StyledInputProps> = ({
  type,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  placeholder = " ",
  icon
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="form-group">
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: 'var(--space-3)',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.2rem',
            color: focused ? 'var(--primary)' : 'var(--gray-400)',
            transition: 'color 0.3s ease',
            zIndex: 1
          }}>
            {icon}
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          disabled={disabled}
          className={`form-input ${error ? 'error' : ''}`}
          placeholder={placeholder}
          style={{
            paddingLeft: icon ? 'calc(var(--space-3) * 2 + 1.2rem)' : 'var(--space-4)',
            paddingRight: type === 'password' ? 'calc(var(--space-3) * 2 + 1.2rem)' : 'var(--space-4)'
          }}
        />
        
        <label 
          className="form-label"
          style={{
            left: icon ? 'calc(var(--space-3) * 2 + 1.2rem)' : 'var(--space-4)',
            color: focused || value ? 'var(--primary)' : 'var(--gray-500)',
            transform: focused || value ? 'translateY(-50%) scale(0.85)' : 'translateY(-50%)',
            top: focused || value ? '0' : '50%'
          }}
        >
          {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
        </label>

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 'var(--space-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              color: 'var(--gray-400)',
              padding: 'var(--space-1)'
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      
      {error && (
        <div style={{
          color: 'var(--error)',
          fontSize: '0.875rem',
          marginTop: 'var(--space-1)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)'
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default StyledInput;