// components/ui/modals/ModalContent.jsx
import React from 'react';
import styles from './ModalContent.module.css';

export const FAQContent = () => {
  const faqs = [
    {
      question: '¿Cómo puedo realizar un pedido personalizado?',
      answer: 'Puedes contactarnos a través de WhatsApp o visitar nuestra página de Personalizaciones. Te guiaremos en todo el proceso de diseño.'
    },
    {
      question: '¿Cuál es el tiempo de entrega?',
      answer: 'El tiempo de entrega varía según la complejidad del diseño, generalmente entre 7-15 días hábiles.'
    },
    {
      question: '¿Realizan envíos a toda Nicaragua?',
      answer: 'Sí, realizamos envíos a todo el país a través de servicios de mensajería confiables.'
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos transferencias bancarias, depósitos en cuenta y pagos móviles.'
    },
    {
      question: '¿Puedo ver una muestra antes de realizar el pedido?',
      answer: 'Sí, podemos compartir muestras digitales de bordados anteriores y discutir las opciones disponibles.'
    }
  ];

  return (
    <div className={styles.faqContainer}>
      {faqs.map((faq, index) => (
        <div key={index} className={styles.faqItem}>
          <h4 className={styles.faqQuestion}>{faq.question}</h4>
          <p className={styles.faqAnswer}>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export const PrivacyContent = () => {
  return (
    <div className={styles.policyContainer}>
      <h3>Política de Privacidad</h3>
      <p>Última actualización: {new Date().getFullYear()}</p>
      
      <h4>1. Información que Recopilamos</h4>
      <p>Recopilamos información personal como nombre, correo electrónico, teléfono y dirección para procesar tus pedidos y brindarte un mejor servicio.</p>
      
      <h4>2. Uso de la Información</h4>
      <p>Usamos tu información para procesar pedidos, enviar actualizaciones, mejorar nuestros servicios y comunicarnos contigo sobre promociones.</p>
      
      <h4>3. Protección de Datos</h4>
      <p>Implementamos medidas de seguridad para proteger tu información personal contra acceso no autorizado.</p>
      
      <h4>4. Cookies</h4>
      <p>Usamos cookies para mejorar tu experiencia de navegación y analizar el tráfico del sitio.</p>
      
      <h4>5. Tus Derechos</h4>
      <p>Tienes derecho a acceder, corregir o eliminar tus datos personales. Contáctanos para ejercer estos derechos.</p>
    </div>
  );
};

export const TermsContent = () => {
  return (
    <div className={styles.policyContainer}>
      <h3>Términos y Condiciones</h3>
      <p>Última actualización: {new Date().getFullYear()}</p>
      
      <h4>1. Aceptación de Términos</h4>
      <p>Al usar nuestro sitio web y servicios, aceptas estos términos y condiciones en su totalidad.</p>
      
      <h4>2. Productos y Precios</h4>
      <p>Los precios están sujetos a cambios sin previo aviso. Nos reservamos el derecho de modificar o descontinuar productos.</p>
      
      <h4>3. Pedidos Personalizados</h4>
      <p>Los diseños personalizados requieren aprobación previa. Una vez aprobados, no se aceptan cambios significativos.</p>
      
      <h4>4. Envíos y Entregas</h4>
      <p>Los tiempos de entrega son estimados. No somos responsables por retrasos causados por servicios de mensajería.</p>
      
      <h4>5. Devoluciones y Reembolsos</h4>
      <p>Aceptamos devoluciones dentro de los 7 días posteriores a la entrega para productos estándar. Los productos personalizados no son reembolsables.</p>
      
      <h4>6. Propiedad Intelectual</h4>
      <p>Todos los diseños y contenidos del sitio son propiedad de Bordados Sacuanjoche y están protegidos por derechos de autor.</p>
    </div>
  );
};

export const AboutContent = () => {
  return (
    <div className={styles.aboutContainer}>
      <h3>Sobre Nosotros</h3>
      <p>
        Bordados Sacuanjoche nace del amor por el arte tradicional del bordado y la cultura nicaragüense.
        Nuestro nombre honra la flor nacional de Nicaragua, la Sacuanjoche, símbolo de belleza y tradición.
      </p>
      
      <h4>Nuestra Historia</h4>
      <p>
        Desde nuestros inicios, nos hemos dedicado a preservar las técnicas tradicionales de bordado mientras
        incorporamos tecnología moderna para crear piezas únicas que cuentan historias.
      </p>
      
      <h4>Nuestra Misión</h4>
      <p>
        Ofrecer productos bordados de alta calidad que combinan arte tradicional con diseño contemporáneo,
        apoyando a artesanos locales y preservando nuestro patrimonio cultural.
      </p>
      
      <h4>Nuestros Valores</h4>
      <ul>
        <li>✨ Calidad artesanal en cada pieza</li>
        <li>🌿 Compromiso con la tradición y la innovación</li>
        <li>❤️ Atención personalizada a cada cliente</li>
        <li>🤝 Apoyo a artesanos locales</li>
      </ul>
    </div>
  );
};

export const CustomProductsContent = () => {
  return (
    <div className={styles.customContainer}>
      <h3>Productos Personalizados</h3>
      <p>
        Creamos bordados únicos para todo tipo de prendas y accesorios. 
        Tu imaginación es el límite.
      </p>
      
      <h4>¿Qué podemos bordar?</h4>
      <ul>
        <li>👕 Camisas y blusas</li>
        <li>👔 Uniformes corporativos</li>
        <li>🎒 Mochilas y bolsos</li>
        <li>🧣 Bufandas y accesorios</li>
        <li>👶 Ropa de bebé</li>
        <li>🏠 Toallas y textiles para el hogar</li>
      </ul>
      
      <h4>Proceso de personalización</h4>
      <ol>
        <li>Contáctanos con tu idea o diseño</li>
        <li>Recibes asesoría personalizada</li>
        <li>Aprobamos diseño y cotización</li>
        <li>Producimos tu pedido con calidad garantizada</li>
        <li>Recibes tu producto único</li>
      </ol>
      
      <div className={styles.contactCTA}>
        <p>¿Listo para crear algo único?</p>
        <a href="https://wa.me/505XXXXXXXX" className={styles.whatsappButton}>
          Contáctanos por WhatsApp
        </a>
      </div>
    </div>
  );
};