import emailjs from '@emailjs/browser';

export const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY', 
  SERVICE_ID: 'YOUR_SERVICE_ID', 
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID' 
};

export const sendNewsletterEmail = async (email, name = 'Cliente') => {
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
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    return { success: true, response };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};