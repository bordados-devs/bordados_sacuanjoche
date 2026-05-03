import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa'; // Changed from FiWhatsApp to FaWhatsapp
import { toast, Toaster } from 'react-hot-toast';
import styles from './Cart.module.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  };

  // Update quantity
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success('Cantidad actualizada');
  };

  // Remove item
  const removeItem = (index, itemTitle) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(`${itemTitle} eliminado del carrito`);
  };

  // Clear all cart
  const clearCart = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      setCartItems([]);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Carrito vaciado');
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 0;
  const tax = subtotal * 0.15;
  const total = subtotal - discount + tax;

  // WhatsApp order message
  const sendWhatsAppOrder = () => {
    if (cartItems.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    let message = '🛍️ *NUEVO PEDIDO - BORDADOS SACUANJOCHE* 🛍️\n\n';
    message += '*DETALLES DEL PEDIDO:*\n';
    message += '─'.repeat(30) + '\n\n';
    
    cartItems.forEach((item, idx) => {
      message += `*${idx + 1}. ${item.title}*\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Talla: ${item.size}\n`;
      message += `   Color: ${item.color}\n`;
      message += `   Precio unitario: C$${item.price.toFixed(2)}\n`;
      message += `   Subtotal: C$${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += '─'.repeat(30) + '\n\n';
    message += `*RESUMEN:*\n`;
    message += `Subtotal: C$${subtotal.toFixed(2)}\n`;
    message += `Descuento: C$${discount.toFixed(2)}\n`;
    message += `Impuesto (15%): C$${tax.toFixed(2)}\n`;
    message += `*TOTAL: C$${total.toFixed(2)}*\n\n`;
    message += '─'.repeat(30) + '\n\n';
    message += '📞 *Datos de contacto:*\n';
    message += 'Nombre: [Ingrese su nombre]\n';
    message += 'Teléfono: [Ingrese su teléfono]\n';
    message += 'Dirección: [Ingrese su dirección]\n\n';
    message += '✨ *Gracias por su compra!* ✨';

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '50512345678';
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `C$${amount.toFixed(2)}`;
  };

  return (
    <div className={styles.cartPage}>
      <Toaster 
        position="top-right"
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
          <h1 className={styles.title}>Tu Carrito</h1>
          <p className={styles.subtitle}>
            Revisa los productos que has seleccionado. Puedes ajustar cantidades o eliminar productos.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <FiShoppingBag size={80} />
            <h2>Tu carrito está vacío</h2>
            <p>¡Explora nuestro catálogo y encuentra los bordados perfectos!</p>
            <Link to="/catalogo" className={styles.shopBtn}>
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className={styles.cartContent}>
            <div className={styles.cartItemsSection}>
              <div className={styles.cartHeader}>
                <h3>Productos ({cartItems.length})</h3>
                <button onClick={clearCart} className={styles.clearCartBtn}>
                  <FiTrash2 size={16} />
                  Vaciar Carrito
                </button>
              </div>

              <div className={styles.cartItemsList}>
                {cartItems.map((item, index) => (
                  <div key={index} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <img 
                        src={item.image || '/assets/placeholder.jpg'} 
                        alt={item.title}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100/8B5E3C/FFFFFF?text=Bordado';
                        }}
                      />
                    </div>
                    
                    <div className={styles.itemDetails}>
                      <h4 className={styles.itemTitle}>{item.title}</h4>
                      <div className={styles.itemAttributes}>
                        <span className={styles.itemSize}>Talla: {item.size}</span>
                        <span className={styles.itemColor}>Color: {item.color}</span>
                      </div>
                      <div className={styles.itemPrice}>
                        {formatCurrency(item.price)}
                      </div>
                    </div>
                    
                    <div className={styles.itemActions}>
                      <div className={styles.quantitySelector}>
                        <button 
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className={styles.qtyBtn}
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className={styles.qtyBtn}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(index, item.title)}
                        className={styles.removeBtn}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    
                    <div className={styles.itemSubtotal}>
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.cartActions}>
                <Link to="/catalogo" className={styles.continueShopping}>
                  <FiArrowLeft size={16} />
                  Seguir comprando
                </Link>
                <button onClick={clearCart} className={styles.clearCartMobile}>
                  Vaciar Carrito
                </button>
              </div>
            </div>

            <div className={styles.orderSummary}>
              <h3>Resumen del pedido</h3>
              
              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Descuento</span>
                  <span>{formatCurrency(discount)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Impuesto (15%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button 
                onClick={sendWhatsAppOrder}
                className={styles.whatsappBtn}
                disabled={cartItems.length === 0}
              >
                <FaWhatsapp size={20} />
                Completar Compra por WhatsApp
              </button>
              
              <p className={styles.shippingNote}>
                * Los gastos de envío se calcularán al confirmar tu pedido por WhatsApp
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;