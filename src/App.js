import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/layout/Layout';
import HeroSection from './components/sections/hero/HeroSection';
import Catalogo from './pages/catalogo/Catalogo'; // Changed from Catalogue to Catalogo
import { CartProvider } from './context/CartContext.jsx';
import styles from './App.module.css';

function App() {
  return (
    <Router>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route path="/catalogo" element={<Catalogo />} /> {/* Changed to Catalogo */}
            <Route path="/nosotros" element={
              <div className={styles.container}>
                <h1>Nosotros</h1>
                <p>Página en construcción...</p>
              </div>
            } />
            <Route path="/personalizaciones" element={
              <div className={styles.container}>
                <h1>Personalizaciones</h1>
                <p>Página en construcción...</p>
              </div>
            } />
            <Route path="/carrito" element={
              <div className={styles.container}>
                <h1>Mi Carrito</h1>
                <p>Página del carrito en construcción...</p>
              </div>
            } />
          </Routes>
        </Layout>
      </CartProvider>
    </Router>
  );
}

export default App;