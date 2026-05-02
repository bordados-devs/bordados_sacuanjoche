import React, { useState } from 'react';
import styles from './Input.module.css';

const Input = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  error,
  success,
  warning,
  info,
  required = false,
  disabled = false,
  readOnly = false,
  icon: Icon,
  iconPosition = 'left',
  size = 'medium',
  fullWidth = true,
  className = '',
  maxLength,
  min,
  max,
  step,
  rows = 4,
  helperText,
  id,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    setIsTouched(true);
    onBlur?.(e);
  };
  
  const handleChange = (e) => {
    onChange?.(e);
  };
  
  // Determine input state class
  const getStateClass = () => {
    if (disabled) return styles.disabled;
    if (error) return styles.error;
    if (success) return styles.success;
    if (warning) return styles.warning;
    if (info) return styles.info;
    if (isFocused) return styles.focused;
    return '';
  };
  
  // Determine if it's a textarea
  const isTextArea = type === 'textarea';
  
  // Common props for input and textarea
  const commonProps = {
    id: inputId,
    name,
    value,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    placeholder,
    disabled,
    readOnly,
    required,
    className: `
      ${styles.input}
      ${getStateClass()}
      ${styles[size]}
      ${Icon && iconPosition === 'left' ? styles.hasIconLeft : ''}
      ${Icon && iconPosition === 'right' ? styles.hasIconRight : ''}
      ${fullWidth ? styles.fullWidth : ''}
    `,
    ...restProps,
  };
  
  // Textarea specific props
  const textareaProps = {
    ...commonProps,
    rows,
  };
  
  // Input specific props
  const inputProps = {
    ...commonProps,
    type: type === 'textarea' ? 'text' : type,
    maxLength,
    min,
    max,
    step,
  };
  
  return (
    <div className={`${styles.inputWrapper} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      
      {/* Input container for icon positioning */}
      <div className={styles.inputContainer}>
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <span className={`${styles.icon} ${styles.iconLeft}`}>
            <Icon />
          </span>
        )}
        
        {/* Input or Textarea */}
        {isTextArea ? (
          <textarea {...textareaProps} />
        ) : (
          <input {...inputProps} />
        )}
        
        {/* Right Icon */}
        {Icon && iconPosition === 'right' && (
          <span className={`${styles.icon} ${styles.iconRight}`}>
            <Icon />
          </span>
        )}
        
        {/* Status indicator */}
        {!disabled && (
          <div className={styles.statusIndicators}>
            {error && <span className={styles.errorIndicator}>⚠️</span>}
            {success && <span className={styles.successIndicator}>✓</span>}
            {warning && <span className={styles.warningIndicator}>!</span>}
          </div>
        )}
      </div>
      
      {/* Helper text or error message */}
      {(helperText || error || warning || info || success) && (
        <div className={styles.helperContainer}>
          {error && <p className={styles.errorText}>{error}</p>}
          {!error && warning && <p className={styles.warningText}>{warning}</p>}
          {!error && !warning && info && <p className={styles.infoText}>{info}</p>}
          {!error && !warning && !info && success && <p className={styles.successText}>{success}</p>}
          {!error && !warning && !info && !success && helperText && (
            <p className={styles.helperText}>{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;