import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, Phone } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('inicio');
  const [cartCount, setCartCount] = useState(0);

  const navLinks = [
    { id: 'inicio', label: 'Inicio', href: '/' },
    { id: 'catalogo', label: 'Catálogo', href: '/catalogo' },
    { id: 'nosotros', label: 'Nosotros', href: '/nosotros' },
    { id: 'personalizaciones', label: 'Personalizaciones', href: '/personalizaciones' },
  ];

  // Get cart count from localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  // Listen for cart updates
  useEffect(() => {
    updateCartCount();
    
    // Listen for storage events (when cart changes in another tab)
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for cart updates within the same tab
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active link based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const active = navLinks.find(link => link.href === currentPath);
    if (active) {
      setActiveLink(active.id);
    }
  }, [location.pathname]);

  // Close menu when clicking on a link and navigate
  const handleLinkClick = (linkId, href) => {
    setActiveLink(linkId);
    setIsMenuOpen(false);
    navigate(href);
  };

  // Handle navigation
  const handleNavigate = (href, linkId) => {
    setActiveLink(linkId);
    navigate(href);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Go to cart page
  const goToCart = () => {
    navigate('/carrito');
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoLink} onClick={() => handleNavigate('/', 'inicio')}>
            <img 
              src="/assets/logo.png" 
              alt="Bordados Sacuanjoche" 
              className={styles.logoImage}
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  className={`${styles.navLink} ${activeLink === link.id ? styles.active : ''}`}
                  onClick={() => handleNavigate(link.href, link.id)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side actions */}
        <div className={styles.actions}>
          <button className={styles.iconButton} aria-label="Mi cuenta">
            <User size={20} />
          </button>
          <button className={styles.iconButton} aria-label="Carrito" onClick={goToCart}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>

          {/* Mobile menu button */}
          <button
            className={`${styles.menuButton} ${isMenuOpen ? styles.open : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menú"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <div className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileNavContent}>
            <ul className={styles.mobileNavList}>
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    className={`${styles.mobileNavLink} ${activeLink === link.id ? styles.active : ''}`}
                    onClick={() => handleLinkClick(link.id, link.href)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;