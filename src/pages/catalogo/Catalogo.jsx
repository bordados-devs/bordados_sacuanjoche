import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { FiSliders, FiX } from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';
import styles from './Catalogo.module.css';

// Sample product data with categories
const products = [
  {
    id: 1,
    title: 'Bordado Floral Tradicional',
    description: 'Hermoso bordado floral con colores vibrantes, ideal para camisas y vestidos. Diseño tradicional hecho a mano con técnicas ancestrales.',
    shortDescription: 'Bordado floral con colores vibrantes',
    price: 25.99,
    images: ['/assets/imagenes/producto1/product1.jpg', 
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
    images: ['/assets/imagenes/producto2/product-2.jpg', 
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
    images: ['/assets/imagenes/producto3/product3.jpg', 
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
    title: 'Bordado Botas',
    description: 'Elegante diseño de bordados para botas, simbolizando libertad y transformación.',
    shortDescription: 'Borados en botas con detalles brillantes',
    price: 28.99,
    images: ['/assets/imagenes/producto4/product4-1.jpg',
       '/assets/imagenes/producto4/product4-2.jpg', '/assets/imagenes/producto4/product4-3.jpg'],
    category: 'women',
    subcategory: 'Botas',
    sizes: ['38', '40', '41'],
    colors: ['Cafe', 'Negra', 'Ariat'],
    stock: 12,
    gender: 'Mujeres'
  },
  {
    id: 5,
    title: 'Bordado de Flores de Sacuanjoche',
    description: 'Nuestra flor nacional bordada con hilos de seda.',
    shortDescription: 'Flor nacional de Nicaragua bordada con detalles',
    price: 38.99,
    images: ['/assets/product5-1.jpg', '/assets/product5-2.jpg', '/assets/product5-3.jpg'],
    category: 'personalization',
    subcategory: 'Floral',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Amarillo', 'Blanco', 'Naranja'],
    stock: 10,
    gender: 'Personalizado'
  },
  {
    id: 6,
    title: 'Bordado Navideño',
    description: 'Diseños especiales para temporada navideña con motivos tradicionales.',
    shortDescription: 'Diseños navideños tradicionales',
    price: 22.50,
    images: ['/assets/product6-1.jpg', '/assets/product6-2.jpg', '/assets/product6-3.jpg'],
    category: 'kids',
    subcategory: 'Temporada',
    sizes: ['Único'],
    colors: ['Rojo', 'Verde', 'Dorado'],
    stock: 20,
    gender: 'Niños'
  },
  {
    id: 7,
    title: 'Bordado Camisa Formal Hombre',
    description: 'Bordado elegante para camisas formales, ideal para eventos especiales.',
    shortDescription: 'Diseño elegante para ocasiones formales',
    price: 85.00,
    images: ['/assets/product7-1.jpg', '/assets/product7-2.jpg', '/assets/product7-3.jpg'],
    category: 'men',
    subcategory: 'Formal',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Azul marino', 'Gris', 'Negro'],
    stock: 7,
    gender: 'Hombre'
  },
  {
    id: 8,
    title: 'Bordado Personalizado Iniciales',
    description: 'Bordado personalizado con iniciales o nombre, perfecto para regalos únicos.',
    shortDescription: 'Diseño personalizado con iniciales',
    price: 120.00,
    images: ['/assets/product8-1.jpg', '/assets/product8-2.jpg', '/assets/product8-3.jpg'],
    category: 'personalization',
    subcategory: 'Personalizado',
    sizes: ['S', 'M', 'L'],
    colors: ['Oro', 'Plata', 'Negro'],
    stock: 25,
    gender: 'Personalizado'
  },
  {
    id: 9,
    title: 'Bordado Premium Colección',
    description: 'Bordado de lujo con hilos de seda y detalles en oro.',
    shortDescription: 'Colección premium de alta calidad',
    price: 250.00,
    images: ['/assets/product9-1.jpg', '/assets/product9-2.jpg', '/assets/product9-3.jpg'],
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

  const categories = [
    { id: 'women', label: 'Mujer', icon: '' },
    { id: 'men', label: 'Hombre', icon: '' },
    { id: 'kids', label: 'Niños', icon: '' },
    { id: 'personalization', label: 'Personalización', icon: '' }
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

  return (
    <div className={styles.catalogue}>
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
          <h1 className={styles.title}>Nuestro Catálogo</h1>
          <p className={styles.subtitle}>
            Descubre nuestra colección de bordados hechos a mano con amor y dedicación
          </p>
        </div>

        <button 
          className={styles.mobileFilterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiSliders size={20} />
          Filtros y ordenar
        </button>

        <div className={`${styles.filtersSection} ${showFilters ? styles.show : ''}`}>
          <div className={styles.filtersHeader}>
            <h3>Filtros</h3>
            <button onClick={clearFilters} className={styles.clearFilters}>
              <FiX size={16} />
              Limpiar
            </button>
          </div>

          <div className={styles.filterGroup}>
            <h4>Categorías</h4>
            <div className={styles.categories}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`${styles.categoryBtn} ${filter === cat.id ? styles.active : ''}`}
                  onClick={() => setFilter(cat.id)}
                >
                  <span className={styles.categoryIcon}>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h4>Ordenar por</h4>
            <select 
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Relevancia</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name-asc">Nombre: A - Z</option>
            </select>
          </div>
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