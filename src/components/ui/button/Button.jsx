import React from 'react';
import styles from './Button.module.css';

const Button = ({
  children,
  type = 'primary',
  state = 'normal',
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  fullWidth = false,
  size = 'medium',
  ...restProps
}) => {
  // Determine if button is disabled
  const isDisabled = disabled || state === 'disabled';
  
  // Map state to CSS class
  const getStateClass = () => {
    if (isDisabled) return styles.disabled;
    switch (state) {
      case 'hover':
        return styles.hover;
      case 'clicked':
        return styles.clicked;
      case 'normal':
      default:
        return styles.normal;
    }
  };
  
  // Map type to CSS class
  const getTypeClass = () => {
    switch (type) {
      case 'secondary':
        return styles.secondary;
      case 'tertiary':
        return styles.tertiary;
      case 'primary':
      default:
        return styles.primary;
    }
  };
  
  // Map size to CSS class
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      case 'medium':
      default:
        return styles.medium;
    }
  };
  
  // Handle click with state simulation (for demo purposes)
  const handleClick = (e) => {
    if (isDisabled) return;
    onClick?.(e);
  };
  
  return (
    <button
      className={`
        ${styles.button}
        ${getTypeClass()}
        ${getStateClass()}
        ${getSizeClass()}
        ${fullWidth ? styles.fullWidth : ''}
        ${className}
      `}
      onClick={handleClick}
      disabled={isDisabled}
      {...restProps}
    >
      {Icon && (
        <span className={styles.icon}>
          <Icon />
        </span>
      )}
      <span className={styles.label}>{children}</span>
    </button>
  );
};

export default Button;