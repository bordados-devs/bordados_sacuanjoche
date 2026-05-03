import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    updateCartCount(savedCart);
  }, []);

  const updateCartCount = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  const addToCart = (product, size, color, quantity) => {
    const existingCart = [...cart];
    const existingIndex = existingCart.findIndex(
      item => item.id === product.id && item.size === size && item.color === color
    );
    
    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += quantity;
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
    }
    
    setCart(existingCart);
    localStorage.setItem('cart', JSON.stringify(existingCart));
    updateCartCount(existingCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    updateCartCount(newCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (index, newQuantity) => {
    const newCart = [...cart];
    if (newQuantity <= 0) {
      newCart.splice(index, 1);
    } else {
      newCart[index].quantity = newQuantity;
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    updateCartCount(newCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    setCartCount(0);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};