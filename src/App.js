import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/layout/Layout';
import HeroSection from './components/sections/hero/HeroSection';
import Catalogo from './pages/catalogo/Catalogo'; 
import Home from './pages/home/Home';
import Personalizaciones from './pages/personalizaciones/Personalizaciones';
import Cart from './pages/carrito/Cart';
import Login from './pages/login/Login';
import Inventory from './pages/admin/Inventory';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext';
import styles from './App.module.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isOwner, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  return isOwner ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} /> 
        <Route path="/personalizaciones" element={<Personalizaciones />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin/inventario" 
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          } 
        />
        <Route path="/nosotros" element={
          <div className={styles.container}>
            <h1>Nosotros</h1>
            <p>Página en construcción...</p>
          </div>
        } />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;