import React, { useState } from 'react';
import { FiEye, FiShoppingBag, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, onImageClick, onQuickAdd }) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Check if product is out of stock
  const isOutOfStock = product.stock === 0 || product.status === 'agotado';
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleQuickAdd = () => {
    if (isOutOfStock) {
      toast.error('Producto agotado. No disponible para la venta');
      return;
    }
    
    if (!selectedSize) {
      toast.error('Por favor selecciona una talla');
      return;
    }
    if (!selectedColor) {
      toast.error('Por favor selecciona un color');
      return;
    }
    if (quantity > product.stock) {
      toast.error(`Solo tenemos ${product.stock} unidades disponibles`);
      return;
    }
    
    onQuickAdd(product, selectedSize, selectedColor, quantity);
    setShowQuickAdd(false);
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
  };

  const handleQuickAddClick = () => {
    if (isOutOfStock) {
      toast.error('Este producto está agotado');
      return;
    }
    setShowQuickAdd(!showQuickAdd);
  };

  return (
    <div className={`${styles.card} ${isOutOfStock ? styles.outOfStock : ''}`}>
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
        
        {/* Stock Status Badges */}
        {isOutOfStock && (
          <div className={styles.agotadoBadge}>
            <FiAlertCircle size={16} />
            <span>Agotado</span>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className={styles.lowStockBadge}>
            <FiAlertCircle size={14} />
            <span>¡Últimas {product.stock} unidades!</span>
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.description}>{product.shortDescription}</p>
        
        <div className={styles.stockInfo}>
          {!isOutOfStock && (
            <span className={styles.stockText}>
              {isLowStock ? (
                <span className={styles.lowStockText}>Stock disponible: {product.stock}</span>
              ) : (
                <span className={styles.inStockText}>En stock</span>
              )}
            </span>
          )}
          {isOutOfStock && (
            <span className={styles.outOfStockText}>No disponible</span>
          )}
        </div>
        
        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <button 
            className={`${styles.quickAddBtn} ${isOutOfStock ? styles.disabledBtn : ''}`}
            onClick={handleQuickAddClick}
            disabled={isOutOfStock}
          >
            <FiShoppingBag size={18} />
          </button>
        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && !isOutOfStock && (
        <div className={styles.quickAddModal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.quickAddContent}>
            <h4>Agregar al carrito</h4>
            <p className={styles.quickAddTitle}>{product.title}</p>
            
            {isLowStock && (
              <div className={styles.warningMessage}>
                <FiAlertCircle size={16} />
                <span>¡Solo quedan {product.stock} unidades! Apresúrate.</span>
              </div>
            )}
            
            <div className={styles.quickAddOptions}>
              <div className={styles.quickAddGroup}>
                <label>Talla <span className={styles.required}>*</span></label>
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
                <label>Color <span className={styles.required}>*</span></label>
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
                  <button 
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button 
                    onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className={styles.maxStockInfo}>Máx. {product.stock} unidades</span>
              </div>
            </div>

            <div className={styles.quickAddActions}>
              <button onClick={() => setShowQuickAdd(false)} className={styles.cancelBtn}>
                Cancelar
              </button>
              <button 
                onClick={handleQuickAdd} 
                className={styles.addBtn}
                disabled={!selectedSize || !selectedColor}
              >
                Agregar - ${(product.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;