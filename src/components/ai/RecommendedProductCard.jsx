import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldCheck,
  AlertTriangle,
  Palette,
} from 'lucide-react';
import ProductActions from '../product/ProductActions';
import { RatingSummary } from '../product/StarRating';
import { useUserLibrary } from '../../context/UserLibraryContext';
import styles from './RecommendedProductCard.module.css';

const formatPrice = (value) => `C$${(Number(value) || 0).toFixed(2)}`;

const RecommendedProductCard = ({ product, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images?.length ? product.images : [];
  const isOutOfStock = product.stock === 0 || product.status === 'agotado';
  const { getRatingSummary } = useUserLibrary();
  const ratingSummary = getRatingSummary(product.id);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product.id]);

  const goToPrevious = (event) => {
    event.stopPropagation();
    if (images.length < 2) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = (event) => {
    event.stopPropagation();
    if (images.length < 2) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <article className={styles.productCard}>
      <div className={styles.imageWrapper}>
        <img
          src={images[currentImageIndex]}
          alt={product.title}
          className={styles.productImage}
          onError={(event) => {
            event.target.src =
              'https://via.placeholder.com/600x600/8B5E3C/FFFFFF?text=Bordado+Sacuanjoche';
          }}
        />

        <span className={styles.aiBadge}>🤖 Recomendado por IA</span>

        {isOutOfStock ? (
          <span className={`${styles.stockBadge} ${styles.outOfStock}`}>Agotado</span>
        ) : product.stock <= 5 ? (
          <span className={`${styles.stockBadge} ${styles.lowStock}`}>
            ¡Últimas {product.stock} unidades!
          </span>
        ) : (
          <span className={`${styles.stockBadge} ${styles.inStock}`}>En stock</span>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.imageNav} ${styles.imageNavLeft}`}
              onClick={goToPrevious}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className={`${styles.imageNav} ${styles.imageNavRight}`}
              onClick={goToNext}
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      <div className={styles.content}>
        <h4 className={styles.productTitle}>{product.title}</h4>

        <RatingSummary summary={ratingSummary} size={13} />

        {product.shortDescription && (
          <p className={styles.productDescription}>{product.shortDescription}</p>
        )}

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.subcategory && (
            <span className={styles.category}>{product.subcategory}</span>
          )}
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            {isOutOfStock ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
            <span>
              {isOutOfStock
                ? 'No disponible por ahora'
                : `${product.stock} unidad(es) disponibles`}
            </span>
          </div>

          <div className={styles.metaItem}>
            <Palette size={16} />
            <span>
              {product.colors?.length
                ? product.colors.join(', ')
                : 'Colores por consultar'}
            </span>
          </div>
        </div>

        {images.length > 1 && (
          <div className={styles.thumbnailRow}>
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`${styles.thumbnail} ${
                  index === currentImageIndex ? styles.thumbnailActive : ''
                }`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Ver imagen ${index + 1} de ${product.title}`}
              >
                <img src={image} alt={`${product.title} ${index + 1}`} />
              </button>
            ))}
          </div>
        )}

        <ProductActions product={product} variant="inline" />

        <button
          type="button"
          className={styles.detailsButton}
          onClick={() => onViewDetails(product)}
        >
          <Eye size={18} />
          Ver detalles completos
        </button>
      </div>
    </article>
  );
};

export default RecommendedProductCard;
