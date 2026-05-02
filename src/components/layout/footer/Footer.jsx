import React from 'react';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube,
  FaHeart,
  FaShoppingBag,
  FaQuestionCircle,
  FaShieldAlt,
  FaFileAlt,
  FaEnvelope,
  FaPaperPlane
} from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Productos personalizado', href: '/productos-personalizados', icon: FaShoppingBag },
    { label: 'Nosotros', href: '/nosotros', icon: FaHeart },
    { label: 'Inicio', href: '/', icon: null },
  ];

  const navigationLinks = [
    { label: 'Preguntas frecuentes', href: '/faq', icon: FaQuestionCircle },
    { label: 'Políticas de privacidad', href: '/privacidad', icon: FaShieldAlt },
    { label: 'Términos y condiciones', href: '/terminos', icon: FaFileAlt },
  ];

  const socialLinks = [
    { icon: FaFacebook, label: 'Facebook', href: 'https://facebook.com', color: '#1877f2' },
    { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com', color: '#e4405f' },
    { icon: FaTwitter, label: 'Twitter', href: 'https://twitter.com', color: '#1da1f2' },
    { icon: FaYoutube, label: 'YouTube', href: 'https://youtube.com', color: '#ff0000' },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    console.log('Newsletter subscription:', email);
    alert('¡Gracias por suscribirte! Recibirás nuestras promociones.');
    e.target.reset();
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.footerContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
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
            <p className={styles.brandDescription}>
              Arte tradicional en bordados con tecnología moderna. 
              Creaciones únicas que cuentan historias.
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={styles.socialLink}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linksSection}>
            <h3 className={styles.sectionTitle}>Enlaces rápidos</h3>
            <ul className={styles.linkList}>
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={styles.link}>
                    {link.icon && <link.icon size={16} />}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Links */}
          <div className={styles.linksSection}>
            <h3 className={styles.sectionTitle}>Navegación</h3>
            <ul className={styles.linkList}>
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={styles.link}>
                    <link.icon size={16} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className={styles.newsletterSection}>
            <h3 className={styles.sectionTitle}>Promociones</h3>
            <p className={styles.newsletterText}>
              Suscribite para recibir promociones exclusivas y novedades
            </p>
            <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
              <div className={styles.inputGroup}>
                <FaEnvelope size={18} className={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  placeholder="email@gmail.com"
                  required
                  className={styles.newsletterInput}
                />
                
              </div>
            
            </form>
              <button type="submit" className={styles.subscribeButton}>
                  <FaPaperPlane size={18} />
                  <span>Registrarse</span>
                </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} Bordados Sacuanjoche. Todos los derechos reservados
          </p>
          <div className={styles.paymentMethods}>
            {/* Add payment method icons here if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;