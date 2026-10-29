import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import styles from './StarRating.module.css';

const STARS = [1, 2, 3, 4, 5];

const StarRating = ({
  value = 0,
  onChange,
  readOnly = false,
  size = 18,
  label,
}) => {
  const [hovered, setHovered] = useState(0);
  const displayValue = hovered || value;

  if (readOnly) {
    return (
      <div
        className={styles.stars}
        role="img"
        aria-label={label || `Calificación: ${Number(value).toFixed(1)} de 5`}
      >
        {STARS.map((star) => (
          <span
            key={star}
            className={`${styles.star} ${
              star <= Math.round(displayValue) ? styles.filled : ''
            }`}
            style={{ fontSize: size }}
          >
            <FiStar />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.stars} role="radiogroup" aria-label={label || 'Calificar producto'}>
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          className={`${styles.starButton} ${
            star <= displayValue ? styles.filled : ''
          }`}
          style={{ fontSize: size }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onFocus={() => setHovered(star)}
          onBlur={() => setHovered(0)}
          onClick={() => onChange?.(star)}
          aria-label={`${star} estrella${star === 1 ? '' : 's'}`}
          aria-pressed={star === value}
        >
          <FiStar />
        </button>
      ))}
    </div>
  );
};

export const RatingSummary = ({
  summary,
  size = 14,
  showCount = true,
  className = '',
}) => {
  const average = summary?.average || 0;
  const count = summary?.count || 0;

  return (
    <div className={`${styles.summary} ${className}`}>
      <StarRating value={average} readOnly size={size} />
      <span className={styles.summaryValue}>
        {count ? average.toFixed(1) : 'Sin reseñas'}
      </span>
      {showCount && count > 0 && (
        <span className={styles.summaryCount}>({count})</span>
      )}
    </div>
  );
};

export default StarRating;
