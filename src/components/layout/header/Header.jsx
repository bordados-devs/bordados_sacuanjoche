import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, Phone } from 'lucide-react';
import styles from './Header.module.css';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('inicio');

  const navLinks = [
    { id: 'inicio', label: 'Inicio', href: '/' },
    { id: 'catalogo', label: 'Catálogo', href: '/catalogo' },
    { id: 'nosotros', label: 'Nosotros', href: '/nosotros' },
    { id: 'personalizaciones', label: 'Personalizaciones', href: '/personalizaciones' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking on a link
  const handleLinkClick = (linkId) => {
    setActiveLink(linkId);
    setIsMenuOpen(false);
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

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
       <div className={styles.logo}>
          <a href="/" className={styles.logoLink}>
            <img 
              src="/assets/logo.png" 
              alt="Bordados Sacuanjoche" 
              className={styles.logoImage}
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={`${styles.navLink} ${activeLink === link.id ? styles.active : ''}`}
                  onClick={() => setActiveLink(link.id)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side actions */}
        <div className={styles.actions}>
          <button className={styles.iconButton} aria-label="Mi cuenta">
            <User size={20} />
          </button>
          <button className={styles.iconButton} aria-label="Carrito">
            <ShoppingBag size={20} />
            <span className={styles.cartBadge}>0</span>
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
                  <a
                    href={link.href}
                    className={`${styles.mobileNavLink} ${activeLink === link.id ? styles.active : ''}`}
                    onClick={() => handleLinkClick(link.id)}
                  >
                    {link.label}
                  </a>
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