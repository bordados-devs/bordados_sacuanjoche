import React, { useEffect, useState } from 'react';
import { FiTrash2, FiLock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useUserLibrary } from '../../context/UserLibraryContext';
import StarRating from './StarRating';
import styles from './ProductReviews.module.css';

const formatDate = (value) => {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('es-NI', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  } catch {
    return '';
  }
};

const ProductReviews = ({ product }) => {
  const { user } = useAuth();
  const {
    setupError,
    getUserReview,
    getProductReviews,
    getRatingSummary,
    promptLogin,
    removeReview,
    submitReview,
  } = useUserLibrary();

  const reviews = getProductReviews(product.id);
  const summary = getRatingSummary(product.id);
  const userReview = getUserReview(product.id);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setRating(userReview?.rating || 0);
    setComment(userReview?.comment || '');
  }, [userReview?.id, userReview?.rating, userReview?.comment, product.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      promptLogin('Inicia sesión para calificar y comentar este producto.');
      return;
    }

    if (!rating) {
      toast.error('Selecciona una calificación de 1 a 5 estrellas.');
      return;
    }

    setSubmitting(true);
    await submitReview({ productId: product.id, rating, comment });
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar tu reseña de este producto?')) return;
    setSubmitting(true);
    await removeReview(product.id);
    setRating(0);
    setComment('');
    setSubmitting(false);
  };

  return (
    <section className={styles.section} aria-labelledby={`reviews-title-${product.id}`}>
      <div className={styles.header}>
        <div>
          <h3 id={`reviews-title-${product.id}`}>Opiniones de clientes</h3>
          <p className={styles.subtitle}>
            Calificaciones reales de quienes ya conocen nuestros bordados.
          </p>
        </div>
      </div>

      {setupError && (
        <p className={styles.notice}>
          Las reseñas todavía no están disponibles. Aplica la migración SQL de
          Supabase para activarlas.
        </p>
      )}

      <div className={styles.summaryGrid}>
        <div className={styles.averageBox}>
          <span className={styles.average}>
            {summary.count ? summary.average.toFixed(1) : '—'}
          </span>
          <StarRating value={summary.average} readOnly size={18} />
          <span className={styles.averageCount}>
            {summary.count === 1
              ? '1 reseña'
              : `${summary.count} reseñas`}
          </span>
        </div>

        <div className={styles.distribution}>
          {[5, 4, 3, 2, 1].map((star) => {
            const total = summary.count || 0;
            const amount = summary.distribution?.[star] || 0;
            const percentage = total ? (amount / total) * 100 : 0;

            return (
              <div key={star} className={styles.distributionRow}>
                <span className={styles.distributionLabel}>{star} ★</span>
                <div className={styles.distributionTrack}>
                  <div
                    className={styles.distributionFill}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className={styles.distributionAmount}>{amount}</span>
              </div>
            );
          })}
        </div>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formHeading}>
          <h4>{userReview ? 'Tu reseña' : 'Deja tu reseña'}</h4>
          {userReview && (
            <span className={styles.editedBadge}>Puedes editarla cuando quieras</span>
          )}
        </div>

        {!user ? (
          <div className={styles.loginPrompt}>
            <FiLock size={18} />
            <p>Inicia sesión para calificar y comentar este producto.</p>
            <button
              type="button"
              className={styles.loginButton}
              onClick={() =>
                promptLogin('Inicia sesión para calificar y comentar este producto.')
              }
            >
              Iniciar sesión
            </button>
          </div>
        ) : (
          <>
            <div className={styles.ratingInput}>
              <span>Tu calificación</span>
              <StarRating
                value={rating}
                onChange={setRating}
                size={26}
                label="Selecciona tu calificación"
              />
              <span className={styles.ratingHint}>
                {rating ? `${rating} de 5 estrellas` : 'Toca las estrellas'}
              </span>
            </div>

            <textarea
              className={styles.textarea}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Cuéntanos cómo te quedó tu bordado, la calidad, el envío..."
              maxLength={500}
              rows={3}
              disabled={submitting}
            />

            <div className={styles.formActions}>
              {userReview && (
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={handleDelete}
                  disabled={submitting}
                >
                  <FiTrash2 size={16} />
                  Eliminar
                </button>
              )}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={submitting || !rating}
              >
                {submitting
                  ? 'Guardando...'
                  : userReview
                  ? 'Actualizar reseña'
                  : 'Publicar reseña'}
              </button>
            </div>
          </>
        )}
      </form>

      <div className={styles.list}>
        {reviews.length === 0 ? (
          <p className={styles.empty}>
            Aún no hay reseñas de este producto. ¡Sé el primero en opinar!
          </p>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.avatar}>
                  {(review.user_name || 'C').charAt(0).toUpperCase()}
                </div>
                <div className={styles.reviewMeta}>
                  <span className={styles.reviewAuthor}>
                    {review.user_name || 'Cliente'}
                    {review.user_id === user?.id && (
                      <span className={styles.ownBadge}>Tu reseña</span>
                    )}
                  </span>
                  <span className={styles.reviewDate}>
                    {formatDate(review.updated_at || review.created_at)}
                  </span>
                </div>
                <StarRating value={Number(review.rating)} readOnly size={15} />
              </div>
              {review.comment && (
                <p className={styles.reviewComment}>{review.comment}</p>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
