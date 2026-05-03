import React from 'react';
import { Eye, ShoppingBag } from 'lucide-react';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, onImageClick }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer} onClick={onImageClick}>
        <img 
          src={product.images[0]} 
          alt={product.title}
          className={styles.image}
        />
        <div className={styles.overlay}>
          <Eye size={24} />
          <span>Ver detalles</span>
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.description}>{product.shortDescription}</p>
        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <button className={styles.quickAddBtn}>
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;