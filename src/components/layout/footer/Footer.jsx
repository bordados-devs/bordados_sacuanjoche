import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
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
  FaPaperPlane,
  FaSpinner
} from 'react-icons/fa';
import Modal from '../../ui/modals/Modal';
import { 
  FAQContent, 
  PrivacyContent, 
  TermsContent, 
  AboutContent,
  CustomProductsContent 
} from '../../ui/modals/ModalContent';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState({ type: '', text: '' });

  // EmailJS configuration - Replace with your actual credentials
  const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY', // Get from EmailJS dashboard
    SERVICE_ID: 'YOUR_SERVICE_ID',
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID'
  };

  const quickLinks = [
    { label: 'Productos personalizados', id: 'custom-products', icon: FaShoppingBag, content: 'custom' },
    { label: 'Nosotros', id: 'about', icon: FaHeart, content: 'about' },
  ];

  const navigationLinks = [
    { label: 'Preguntas frecuentes', id: 'faq', icon: FaQuestionCircle, content: 'faq' },
    { label: 'Políticas de privacidad', id: 'privacy', icon: FaShieldAlt, content: 'privacy' },
    { label: 'Términos y condiciones', id: 'terms', icon: FaFileAlt, content: 'terms' },
  ];

  const socialLinks = [
    { icon: FaFacebook, label: 'Facebook', href: 'https://facebook.com', color: '#1877f2' },
    { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com', color: '#e4405f' },
    { icon: FaTwitter, label: 'Twitter', href: 'https://twitter.com', color: '#1da1f2' },
    { icon: FaYoutube, label: 'YouTube', href: 'https://youtube.com', color: '#ff0000' },
  ];

  const handleLinkClick = (e, id, content) => {
    e.preventDefault();
    setActiveModal({ id, content });
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const getModalContent = (contentType) => {
    switch(contentType) {
      case 'faq':
        return <FAQContent />;
      case 'privacy':
        return <PrivacyContent />;
      case 'terms':
        return <TermsContent />;
      case 'about':
        return <AboutContent />;
      case 'custom':
        return <CustomProductsContent />;
      default:
        return null;
    }
  };

  const getModalTitle = (id) => {
    switch(id) {
      case 'faq':
        return 'Preguntas Frecuentes';
      case 'privacy':
        return 'Políticas de Privacidad';
      case 'terms':
        return 'Términos y Condiciones';
      case 'about':
        return 'Sobre Nosotros';
      case 'custom':
        return 'Productos Personalizados';
      default:
        return '';
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNewsletterMessage({ type: '', text: '' });

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const name = formData.get('name') || 'Cliente';

    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

    const templateParams = {
      to_email: email,
      from_name: 'Bordados Sacuanjoche',
      to_name: name,
      message: `¡Gracias por suscribirte a nuestro newsletter! Recibirás nuestras promociones exclusivas y novedades.`,
      reply_to: email
    };

    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );
      
      setNewsletterMessage({ 
        type: 'success', 
        text: '¡Gracias por suscribirte! Recibirás nuestras promociones.' 
      });
      e.target.reset();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setNewsletterMessage({ type: '', text: '' });
      }, 5000);
    } catch (error) {
      console.error('Error sending email:', error);
      setNewsletterMessage({ 
        type: 'error', 
        text: 'Hubo un error al procesar tu suscripción. Por favor intenta nuevamente.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.footerContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
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
                <li key={link.id}>
                  <a 
                    href={`/${link.id}`} 
                    className={styles.link}
                    onClick={(e) => handleLinkClick(e, link.id, link.content)}
                  >
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
                <li key={link.id}>
                  <a 
                    href={`/${link.id}`} 
                    className={styles.link}
                    onClick={(e) => handleLinkClick(e, link.id, link.content)}
                  >
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
                  placeholder="correo@ejemplo.com"
                  required
                  className={styles.newsletterInput}
                  disabled={isSubmitting}
                />
              </div>
              <button 
                type="submit" 
                className={styles.subscribeButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <FaSpinner size={18} className={styles.spinner} />
                ) : (
                  <FaPaperPlane size={18} />
                )}
                <span>{isSubmitting ? 'Enviando...' : 'Registrarse'}</span>
              </button>
            </form>
            {newsletterMessage.text && (
              <div className={`${styles.newsletterMessage} ${styles[newsletterMessage.type]}`}>
                {newsletterMessage.text}
              </div>
            )}
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} Bordados Sacuanjoche. Todos los derechos reservados
          </p>
          <div className={styles.paymentMethods}>
            {/* Add payment method icons if needed */}
          </div>
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <Modal
          isOpen={!!activeModal}
          onClose={handleCloseModal}
          title={getModalTitle(activeModal.id)}
          size="md"
        >
          {getModalContent(activeModal.content)}
        </Modal>
      )}
    </footer>
  );
};

export default Footer;