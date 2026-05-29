// components/footer/Footer.jsx
import React, { useState, useEffect } from 'react';
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

  // EmailJS configuration - SOLO PARA NOTIFICACIONES
  const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'SaEkwZYdzopsEF3ao',  
    SERVICE_ID: 'service_x34x32i',     
    NOTIFICATION_TEMPLATE_ID: 'template_g6f153a'  // Tu template de notificación
  };

  // Tu email del negocio donde quieres recibir las notificaciones
  const BUSINESS_EMAIL = 'tubusiness@email.com'; // ← CAMBIA ESTO POR TU EMAIL REAL

  // Inicializar EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log('EmailJS initialized');
  }, []);

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

    // Validar email
    if (!email || !email.includes('@')) {
      setNewsletterMessage({ 
        type: 'error', 
        text: 'Por favor ingresa un correo electrónico válido.' 
      });
      setIsSubmitting(false);
      return;
    }

    // Parámetros para la notificación (solo para el negocio)
    const notificationParams = {
      to_email: BUSINESS_EMAIL,
      subscriber_email: email,
      subscriber_name: name,
      subscription_date: new Date().toLocaleString('es-NI', {
        dateStyle: 'full',
        timeStyle: 'medium'
      }),
      site: 'Bordados Sacuanjoche'
    };

    try {
      // Enviar solo notificación al negocio
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.NOTIFICATION_TEMPLATE_ID,
        notificationParams
      );
      
      console.log('Notificación enviada al negocio:', response);
      
      setNewsletterMessage({ 
        type: 'success', 
        text: '¡Gracias por suscribirte! Pronto recibirás nuestras novedades.' 
      });
      e.target.reset();
      
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        setNewsletterMessage({ type: '', text: '' });
      }, 5000);
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      
      let errorMessage = 'Hubo un error al procesar tu suscripción. ';
      
      if (error.text === 'Network Error') {
        errorMessage += 'Verifica tu conexión a internet.';
      } else if (error.status === 401) {
        errorMessage += 'Error de autenticación. Contacta al administrador.';
      } else if (error.status === 404) {
        errorMessage += 'Servicio no encontrado. Verifica la configuración.';
      } else {
        errorMessage += 'Por favor intenta nuevamente más tarde.';
      }
      
      setNewsletterMessage({ 
        type: 'error', 
        text: errorMessage
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