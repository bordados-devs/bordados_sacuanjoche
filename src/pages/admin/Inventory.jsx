import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  FiPlus, 
  FiMinus, 
  FiEdit2, 
  FiSave, 
  FiX, 
  FiPackage, 
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiSearch
} from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';
import styles from './Inventory.module.css';

const Inventory = () => {
  const { user, isOwner, signOut } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    if (!isOwner) {
      navigate('/login');
      return;
    }
    loadProducts();
  }, [isOwner, navigate]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, newStock, action = 'set') => {
    try {
      let finalStock = newStock;
      if (action === 'increment') {
        finalStock = (newStock || 0) + 1;
      } else if (action === 'decrement') {
        if ((newStock || 0) <= 0) {
          toast.error('El stock no puede ser negativo');
          return;
        }
        finalStock = (newStock || 0) - 1;
      }

      const { error } = await supabase
        .from('products')
        .update({ stock: finalStock, updated_at: new Date() })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === productId ? { ...p, stock: finalStock } : p
      ));
      
      toast.success(`Stock actualizado a ${finalStock}`);
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Error al actualizar stock');
    }
  };

  const updateStatus = async (productId, status) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status, updated_at: new Date() })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === productId ? { ...p, status } : p
      ));
      
      toast.success(`Estado actualizado a ${status === 'active' ? 'Activo' : 'Agotado'}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const updateProduct = async (productId, updates) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date() })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === productId ? { ...p, ...updates } : p
      ));
      
      setEditingProduct(null);
      toast.success('Producto actualizado');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar producto');
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const getStatusBadge = (status, stock) => {
    if (status === 'agotado' || stock === 0) {
      return <span className={`${styles.statusBadge} ${styles.statusAgotado}`}>Agotado</span>;
    }
    if (stock <= 5) {
      return <span className={`${styles.statusBadge} ${styles.statusLow}`}>Stock Bajo</span>;
    }
    return <span className={`${styles.statusBadge} ${styles.statusActive}`}>Disponible</span>;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!isOwner) {
    return null;
  }

  return (
    <div className={styles.inventoryPage}>
      <Toaster position="top-right" />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Gestión de Inventario</h1>
            <p className={styles.subtitle}>
              Administra el stock y estado de los productos
            </p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <span className={styles.userEmail}>{user?.email}</span>
              <button onClick={handleSignOut} className={styles.logoutBtn}>
                <FiLogOut size={18} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando productos...</p>
          </div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.productTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock Actual</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map(product => (
                    <tr key={product.id} className={styles.productRow}>
                      <td data-label="ID">#{product.id}</td>
                      <td data-label="Producto">
                        <div className={styles.productInfo}>
                          {product.images && product.images[0] && (
                            <img 
                              src={product.images[0]} 
                              alt={product.title}
                              className={styles.productThumb}
                            />
                          )}
                          <div>
                            <div className={styles.productTitle}>{product.title}</div>
                            <div className={styles.productSku}>{product.sku || `SKU-${product.id}`}</div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Categoría">{product.category}</td>
                      <td data-label="Precio">C${product.price?.toFixed(2)}</td>
                      <td data-label="Stock">
                        {editingProduct === product.id ? (
                          <div className={styles.editStock}>
                            <input
                              type="number"
                              defaultValue={product.stock}
                              className={styles.stockInput}
                              id={`stock-${product.id}`}
                              min="0"
                            />
                            <button 
                              onClick={() => {
                                const newStock = parseInt(document.getElementById(`stock-${product.id}`).value);
                                updateStock(product.id, newStock);
                              }}
                              className={styles.saveStockBtn}
                            >
                              <FiSave size={16} />
                            </button>
                            <button 
                              onClick={() => setEditingProduct(null)}
                              className={styles.cancelStockBtn}
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className={styles.stockDisplay}>
                            <span className={styles.stockValue}>{product.stock}</span>
                            <div className={styles.stockActions}>
                              <button 
                                onClick={() => updateStock(product.id, product.stock, 'increment')}
                                className={styles.stockBtn}
                                title="Incrementar stock"
                              >
                                <FiPlus size={14} />
                              </button>
                              <button 
                                onClick={() => updateStock(product.id, product.stock, 'decrement')}
                                className={styles.stockBtn}
                                title="Disminuir stock"
                                disabled={product.stock <= 0}
                              >
                                <FiMinus size={14} />
                              </button>
                              <button 
                                onClick={() => setEditingProduct(product.id)}
                                className={styles.stockBtn}
                                title="Editar stock"
                              >
                                <FiEdit2 size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                      <td data-label="Estado">
                        <div className={styles.statusActions}>
                          {getStatusBadge(product.status, product.stock)}
                          <select
                            value={product.status === 'agotado' ? 'agotado' : 'active'}
                            onChange={(e) => updateStatus(product.id, e.target.value)}
                            className={styles.statusSelect}
                          >
                            <option value="active">Disponible</option>
                            <option value="agotado">Agotado</option>
                          </select>
                        </div>
                      </td>
                      <td data-label="Acciones">
                        <button 
                          onClick={() => updateStatus(product.id, product.status === 'active' ? 'agotado' : 'active')}
                          className={styles.toggleStatusBtn}
                          title={product.status === 'active' ? 'Marcar como agotado' : 'Marcar como disponible'}
                        >
                          <FiPackage size={16} />
                          {product.status === 'active' ? 'Agotar' : 'Disponible'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className={styles.noResults}>
                <FiPackage size={48} />
                <p>No se encontraron productos</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={styles.pageBtn}
                >
                  <FiChevronLeft />
                </button>
                <span className={styles.pageInfo}>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={styles.pageBtn}
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Inventory;