import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { FiSliders, FiX, FiChevronDown, FiFilter, FiUser, FiUsers, FiSmile, FiTag, FiDollarSign, FiArrowUp, FiArrowDown, FiType } from 'react-icons/fi';
import { GiPalmTree, GiFamilyHouse, GiBabyFace, GiTeacher, GiCommercialAirplane } from 'react-icons/gi';
import { FaChild, FaFemale, FaMale } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import styles from './Catalogo.module.css';

// Sample product data with categories
const products = [
  {
    id: 1,
    title: 'Bordado Floral Tradicional',
    description: 'Hermoso bordado floral con colores vibrantes, ideal para botas. Diseño tradicional hecho a mano con técnicas ancestrales.',
    shortDescription: 'Bordado floral con colores vibrantes',
    price: 25.99,
    images: ['/assets/imagenes/producto1/product1-1.avif', 
      '/assets/imagenes/producto1/product1-2.jpg', '/assets/imagenes/producto1/product1-3.jpg'],
    category: 'women',
    subcategory: 'Floral',
    sizes: ['Micro', 'Mediana', 'Grande'],
    colors: ['Rojo', 'Azul', 'Verde'],
    stock: 15,
    gender: 'Mujer'
  },
  {
    id: 2,
    title: 'Bordado Geométrico Maya',
    description: 'Inspirado en la cultura maya, este bordado geométrico representa la conexión con nuestras raíces.',
    shortDescription: 'Diseño geométrico inspirado en la cultura maya',
    price: 32.50,
    images: ['/assets/imagenes/producto2/product-2.avif', 
      '/assets/imagenes/producto2/product2-1.jpg', '/assets/imagenes/producto2/product2-3.jpg'],
    category: 'men',
    subcategory: 'Geométrico',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Negro', 'Blanco', 'Gris'],
    stock: 8,
    gender: 'Hombre'
  },
  {
    id: 3,
    title: 'Bordado de Flores',
    description: 'Detallado bordado de Flores de colores.',
    shortDescription: 'Flores con detalles en colores brillantes',
    price: 45.00,
    images: ['/assets/imagenes/producto3/product3.avif', 
      '/assets/imagenes/producto3/product3-2.jpg', '/assets/imagenes/producto3/product3-3.jpg'],
    category: 'women',
    subcategory: 'Animales',
    sizes: ['M', 'L', 'XL'],
    colors: ['Multicolor', 'Azul', 'Verde'],
    stock: 5,
    gender: 'Mujer'
  },
  {
    id: 4,
    title: 'Bordado Hollywood',
    description: 'Diseños especiales.',
    shortDescription: 'Diseños especiales a como el cliente lo solicita',
    price: 22.50,
    images: ['/assets/imagenes/producto7/product7.avif', '/assets/product6-2.jpg', '/assets/product6-3.jpg'],
    category: 'kids',
    subcategory: 'Temporada',
    sizes: ['Único'],
    colors: ['Rojo', 'Verde', 'Dorado'],
    stock: 20,
    gender: 'Niños'
  },
  {
    id: 5,
    title: 'Bordado de Flores de Sacuanjoche',
    description: 'Nuestra flor nacional bordada con hilos de seda.',
    shortDescription: 'Flor nacional de Nicaragua bordada con detalles',
    price: 38.99,
    images: ['/assets/imagenes/producto5/product5.avif', '/assets/product5-2.jpg', '/assets/product5-3.jpg'],
    category: 'women',
    subcategory: 'Floral',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Amarillo', 'Blanco', 'Naranja'],
    stock: 10,
    gender: 'Mujer'
  },
  {
    id: 6,
    title: 'Bordado Botas',
    description: 'Elegante diseño de bordados para botas, simbolizando libertad y transformación.',
    shortDescription: 'Borados en botas con detalles brillantes',
    price: 28.99,
    images: ['/assets/imagenes/producto6/producto6.avif',
       '/assets/imagenes/producto6/product6.avif', '/assets/imagenes/producto4/product4.avif'],
    category: 'women',
    subcategory: 'Botas',
    sizes: ['38', '40', '41'],
    colors: ['Cafe', 'Negra', 'Ariat'],
    stock: 12,
    gender: 'Mujer'
  },
  {
    id: 8,
    title: 'Bordado Personalizado Iniciales',
    description: 'Bordado personalizado con iniciales o nombre, perfecto para regalos únicos.',
    shortDescription: 'Diseño personalizado con iniciales',
    price: 120.00,
    images: ['/assets/imagenes/producto9/product9.avif', '/assets/product8-2.jpg', '/assets/product8-3.jpg'],
    category: 'kids',
    subcategory: 'Personalizado',
    sizes: ['S', 'M', 'L'],
    colors: ['Oro', 'Plata', 'Negro'],
    stock: 25,
    gender: 'Niños'
  },
  {
    id: 9,
    title: 'Bordado Premium Colección',
    description: 'Bordado de lujo con hilos de seda y detalles en oro.',
    shortDescription: 'Colección premium de alta calidad',
    price: 250.00,
    images: ['/assets/imagenes/producto8/product8.avif', '/assets/product9-2.jpg', '/assets/product9-3.jpg'],
    category: 'women',
    subcategory: 'Premium',
    sizes: ['S', 'M', 'L'],
    colors: ['Dorado', 'Plateado', 'Blanco'],
    stock: 3,
    gender: 'Mujer'
  }
];

const Catalogo = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [floatingElements, setFloatingElements] = useState([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Generate random floating elements
  useEffect(() => {
    const flowers = ['🌸', '🌼', '🌺', '🌻', '🪷', '🌷', '🌸', '🌼'];
    const elements = [];
    for (let i = 0; i < 24; i++) {
      elements.push({
        id: i,
        icon: flowers[Math.floor(Math.random() * flowers.length)],
        left: Math.random() * 100,
        animationDuration: 8 + Math.random() * 10,
        animationDelay: Math.random() * 15,
        size: 0.8 + Math.random() * 0.7
      });
    }
    setFloatingElements(elements);
  }, []);

  // Categories with React Icons
  const categories = [
    { id: 'women', label: 'Mujer', icon: <FaFemale size={16} />, emojiIcon: '👩' },
    { id: 'men', label: 'Hombre', icon: <FaMale size={16} />, emojiIcon: '👨' },
    { id: 'kids', label: 'Niños', icon: <FaChild size={16} />, emojiIcon: '👶' }
  ];

  // Filter products
  const filteredProducts = products.filter(product => {
    if (filter !== 'all' && product.category !== filter) return false;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
    return 0;
  });

  // Add to cart with localStorage
  const addToCart = (product, size, color, quantity) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingIndex = existingCart.findIndex(
      item => item.id === product.id && item.size === size && item.color === color
    );
    
    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += quantity;
      toast.success(`Cantidad actualizada: ${product.title}`);
    } else {
      existingCart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        size,
        color,
        quantity,
        image: product.images[0]
      });
      toast.success(`¡${product.title} agregado al carrito!`);
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearFilters = () => {
    setFilter('all');
    setSortBy('default');
    toast('Filtros restablecidos', { icon: '🔄' });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filter !== 'all') count++;
    if (sortBy !== 'default') count++;
    return count;
  };

  return (
    <div className={styles.catalogue}>
      {/* Floating Background Elements */}
      <div className={styles.floatingContainer}>
        {floatingElements.map((el) => (
          <div
            key={el.id}
            className={styles.floatingElement}
            style={{
              left: `${el.left}%`,
              animationDuration: `${el.animationDuration}s`,
              animationDelay: `${el.animationDelay}s`,
              fontSize: `${el.size}rem`,
              opacity: 0.15
            }}
          >
            {el.icon}
          </div>
        ))}
      </div>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            style: {
              background: '#2E7D32',
            },
          },
          error: {
            style: {
              background: '#D32F2F',
            },
          },
        }}
      />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerDecoration}>
            <span className={styles.decorationLeft}>🌺</span>
            <h1 className={styles.title}>Nuestro Catálogo</h1>
            <span className={styles.decorationRight}>🌻</span>
          </div>
          <p className={styles.subtitle}>
            Descubre nuestra colección de bordados hechos a mano con amor y dedicación
          </p>
        </div>

        {/* Dynamic Filter Bar - Compact */}
        <div className={styles.filterBar}>
          <div className={styles.filterBarHeader}>
            <button 
              className={styles.filterToggleBtn}
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            >
              <FiFilter size={18} />
              <span>Filtrar</span>
              {getActiveFilterCount() > 0 && (
                <span className={styles.filterBadge}>{getActiveFilterCount()}</span>
              )}
              <FiChevronDown className={`${styles.filterArrow} ${isFilterExpanded ? styles.rotated : ''}`} />
            </button>
            
            <div className={styles.activeFilters}>
              {filter !== 'all' && (
                <span className={styles.activeFilter}>
                  {categories.find(c => c.id === filter)?.icon}
                  {categories.find(c => c.id === filter)?.label}
                  <button onClick={() => setFilter('all')}>×</button>
                </span>
              )}
              {sortBy !== 'default' && (
                <span className={styles.activeFilter}>
                  {sortBy === 'price-asc' ? <><FiDollarSign size={12} /> Menor precio</> : 
                   sortBy === 'price-desc' ? <><FiDollarSign size={12} /> Mayor precio</> :
                   <><FiType size={12} /> A - Z</>}
                  <button onClick={() => setSortBy('default')}>×</button>
                </span>
              )}
            </div>
            
            {(filter !== 'all' || sortBy !== 'default') && (
              <button onClick={clearFilters} className={styles.clearAllBtn}>
                Limpiar todo
              </button>
            )}
          </div>

          {isFilterExpanded && (
            <div className={styles.filterExpanded}>
              <div className={styles.filterRow}>
                <span className={styles.filterLabel}>Categoría</span>
                <div className={styles.categoryChips}>
                  <button
                    className={`${styles.chip} ${filter === 'all' ? styles.activeChip : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    <FiTag size={14} />
                    <span>Todos</span>
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className={`${styles.chip} ${filter === cat.id ? styles.activeChip : ''}`}
                      onClick={() => setFilter(cat.id)}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterRow}>
                <span className={styles.filterLabel}>Ordenar por</span>
                <div className={styles.sortOptions}>
                  <button
                    className={`${styles.sortChip} ${sortBy === 'default' ? styles.activeSort : ''}`}
                    onClick={() => setSortBy('default')}
                  >
                    Relevancia
                  </button>
                  <button
                    className={`${styles.sortChip} ${sortBy === 'price-asc' ? styles.activeSort : ''}`}
                    onClick={() => setSortBy('price-asc')}
                  >
                    <FiArrowUp size={12} />
                    Menor precio
                  </button>
                  <button
                    className={`${styles.sortChip} ${sortBy === 'price-desc' ? styles.activeSort : ''}`}
                    onClick={() => setSortBy('price-desc')}
                  >
                    <FiArrowDown size={12} />
                    Mayor precio
                  </button>
                  <button
                    className={`${styles.sortChip} ${sortBy === 'name-asc' ? styles.activeSort : ''}`}
                    onClick={() => setSortBy('name-asc')}
                  >
                    <FiType size={12} />
                    A - Z
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.resultsCount}>
          <p>{sortedProducts.length} productos encontrados</p>
        </div>

        <div className={styles.productsGrid}>
          {sortedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onImageClick={() => setSelectedProduct(product)}
              onQuickAdd={addToCart}
            />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className={styles.noResults}>
            <p>No se encontraron productos con los filtros seleccionados</p>
            <button onClick={clearFilters} className={styles.resetBtn}>
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default Catalogo;