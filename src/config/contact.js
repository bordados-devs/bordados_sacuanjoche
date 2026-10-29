// Datos de contacto del negocio.
// El número debe ir en formato internacional, sin "+" ni espacios (ej: 505XXXXXXXX).
export const WHATSAPP_NUMBER = '50558315377';

export const BUSINESS_NAME = 'Bordados Sacuanjoche';

export const BUSINESS_EMAIL = 'sacuanjochepeleteria@gmail.com';

export const buildWhatsAppUrl = (message = '') => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}${encoded ? `?text=${encoded}` : ''}`;
};
