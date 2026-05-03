import React, { useState } from 'react';
import { FiEye, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, onImageClick, onQuickAdd }) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleQuickAdd = () => {
    if (!selectedSize) {
      toast.error('Por favor selecciona una talla');
      return;
    }
    if (!selectedColor) {
      toast.error('Por favor selecciona un color');
      return;
    }
    onQuickAdd(product, selectedSize, selectedColor, quantity);
    setShowQuickAdd(false);
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer} onClick={onImageClick}>
        <img 
          src={product.images[0]} 
          alt={product.title}
          className={styles.image}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400/8B5E3C/FFFFFF?text=Bordado';
          }}
        />
        <div className={styles.overlay}>
          <FiEye size={24} />
          <span>Ver detalles</span>
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.description}>{product.shortDescription}</p>
        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <button 
            className={styles.quickAddBtn}
            onClick={() => setShowQuickAdd(!showQuickAdd)}
          >
            <FiShoppingBag size={18} />
          </button>
        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className={styles.quickAddModal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.quickAddContent}>
            <h4>Agregar al carrito</h4>
            <p className={styles.quickAddTitle}>{product.title}</p>
            
            <div className={styles.quickAddOptions}>
              <div className={styles.quickAddGroup}>
                <label>Talla</label>
                <div className={styles.quickAddSizes}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`${styles.quickAddSizeBtn} ${selectedSize === size ? styles.selected : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.quickAddGroup}>
                <label>Color</label>
                <div className={styles.quickAddColors}>
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`${styles.quickAddColorBtn} ${selectedColor === color ? styles.selected : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                      {selectedColor === color && <span className={styles.checkmark}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.quickAddGroup}>
                <label>Cantidad</label>
                <div className={styles.quickAddQuantity}>
                  <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => quantity < product.stock && setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
            </div>

            <div className={styles.quickAddActions}>
              <button onClick={() => setShowQuickAdd(false)} className={styles.cancelBtn}>
                Cancelar
              </button>
              <button onClick={handleQuickAdd} className={styles.addBtn}>
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;