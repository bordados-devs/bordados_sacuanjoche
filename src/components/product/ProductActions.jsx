import React from 'react';
import { FiHeart, FiBookmark } from 'react-icons/fi';
import { useUserLibrary } from '../../context/UserLibraryContext';
import styles from './ProductActions.module.css';

const ProductActions = ({ product, variant = 'overlay', className = '' }) => {
  const { isLiked, isSaved, getLikeCount, toggleLike, toggleSave } =
    useUserLibrary();

  const liked = isLiked(product.id);
  const saved = isSaved(product.id);
  const likeCount = getLikeCount(product.id);

  const runAction = (event, action) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };

  return (
    <div className={`${styles.actions} ${styles[variant] || ''} ${className}`}>
      <button
        type="button"
        className={`${styles.actionButton} ${liked ? styles.liked : ''}`}
        onClick={(event) => runAction(event, () => toggleLike(product.id))}
        aria-pressed={liked}
        aria-label={liked ? 'Quitar me gusta' : 'Me gusta'}
        title={liked ? 'Quitar me gusta' : 'Me gusta'}
      >
        <FiHeart fill={liked ? 'currentColor' : 'none'} />
        {variant === 'overlay' ? (
          <span className={styles.countBadge}>{likeCount}</span>
        ) : (
          <span>{liked ? 'Te gusta' : 'Me gusta'}</span>
        )}
        {variant !== 'overlay' && likeCount > 0 && (
          <span className={styles.inlineCount}>{likeCount}</span>
        )}
      </button>

      <button
        type="button"
        className={`${styles.actionButton} ${
          saved ? styles.saved : ''
        }`}
        onClick={(event) => runAction(event, () => toggleSave(product.id))}
        aria-pressed={saved}
        aria-label={saved ? 'Quitar de guardados' : 'Guardar producto'}
        title={saved ? 'Quitar de guardados' : 'Guardar producto'}
      >
        <FiBookmark fill={saved ? 'currentColor' : 'none'} />
        {variant !== 'overlay' && (
          <span>{saved ? 'Guardado' : 'Guardar'}</span>
        )}
      </button>
    </div>
  );
};

export default ProductActions;
