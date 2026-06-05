import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { FiSliders, FiX, FiChevronDown, FiFilter, FiTag, FiDollarSign, FiArrowUp, FiArrowDown, FiType } from 'react-icons/fi';
import { FaChild, FaFemale, FaMale } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import styles from './Catalogo.module.css';

const Catalogo = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Load products from Supabase
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        console.log('No products found');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  // Categories with React Icons
  const categories = [
    { id: 'women', label: 'Mujer', icon: <FaFemale size={16} /> },
    { id: 'men', label: 'Hombre', icon: <FaMale size={16} /> },
    { id: 'kids', label: 'Niños', icon: <FaChild size={16} /> }
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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

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