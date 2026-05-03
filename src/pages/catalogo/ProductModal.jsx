import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag } from 'lucide-react';
import styles from './ProductModal.module.css';
import toast from 'react-hot-toast';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };



const handleAddToCart = () => {
  if (!selectedSize) {
    toast.error('Por favor selecciona una talla');
    return;
  }
  if (!selectedColor) {
    toast.error('Por favor selecciona un color');
    return;
  }
  onAddToCart(product, selectedSize, selectedColor, quantity);
  setAddedToCart(true);
  setTimeout(() => setAddedToCart(false), 2000);
};

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(prev => prev + 1);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.modalContent}>
          {/* Image Carousel */}
          <div className={styles.carouselSection}>
            <div className={styles.mainImage}>
              <img 
                src={product.images[currentImageIndex]} 
                alt={product.title}
              />
              <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevImage}>
                <ChevronLeft size={24} />
              </button>
              <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextImage}>
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div className={styles.thumbnailStrip}>
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`${styles.thumbnail} ${currentImageIndex === idx ? styles.active : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img src={img} alt={`${product.title} ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className={styles.infoSection}>
            <h2 className={styles.productTitle}>{product.title}</h2>
            <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
            
            <div className={styles.stockInfo}>
              {product.stock > 10 ? (
                <span className={styles.inStock}>✓ En stock</span>
              ) : product.stock > 0 ? (
                <span className={styles.lowStock}>⚠️ Solo {product.stock} unidades disponibles</span>
              ) : (
                <span className={styles.outOfStock}>✗ Agotado</span>
              )}
            </div>

            <div className={styles.description}>
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            <div className={styles.options}>
              <h3>Talla</h3>
              <div className={styles.sizeOptions}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.selected : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className={styles.options}>
              <h3>Color</h3>
              <div className={styles.colorOptions}>
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`${styles.colorBtn} ${selectedColor === color ? styles.selected : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className={styles.quantitySection}>
              <h3>Cantidad</h3>
              <div className={styles.quantitySelector}>
                <button onClick={decreaseQuantity} disabled={quantity <= 1}>
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button onClick={increaseQuantity} disabled={quantity >= product.stock}>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              className={`${styles.addToCartBtn} ${addedToCart ? styles.added : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingBag size={20} />
              {addedToCart ? '¡Agregado!' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;