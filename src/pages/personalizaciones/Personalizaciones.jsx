import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiUpload, FiSend, FiFile, FiTrash2 } from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import styles from './Personalizaciones.module.css';


const EMAILJS_CONFIG = {
  publicKey: 'SaEkwZYdzopsEF3ao', 
  serviceId: 'service_x34x32i',
  templateId: 'template_u3elyaf' 
};

const Personalizaciones = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    productType: '',
    quantity: '',
    requiredDate: '',
    description: '',
    attachments: [],
    name: '',
    phone: '',
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const productTypes = [
    'Camisas bordadas',
    'Vestidos bordados',
    'Toallas personalizadas',
    'Ropa deportiva',
    'Uniformes empresariales',
    'Accesorios',
    'Artesanías',
    'Otro'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== files.length) {
      toast.error('Solo se permiten archivos PNG, JPG o PDF');
    }

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Convert file to base64 for email attachment
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.productType) {
      toast.error('Por favor selecciona un tipo de producto');
      return;
    }
    if (!formData.quantity) {
      toast.error('Por favor ingresa la cantidad requerida');
      return;
    }
    if (!formData.requiredDate) {
      toast.error('Por favor selecciona una fecha requerida');
      return;
    }
    if (!formData.description) {
      toast.error('Por favor describe tu solicitud');
      return;
    }
    if (!formData.name) {
      toast.error('Por favor ingresa tu nombre');
      return;
    }
    if (!formData.phone) {
      toast.error('Por favor ingresa tu número de teléfono');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Initialize EmailJS
      emailjs.init(EMAILJS_CONFIG.publicKey);
      
      // Prepare attachments info (without actual files to avoid size limits)
      const attachmentsInfo = formData.attachments.length > 0 
        ? formData.attachments.map(file => `${file.name} (${(file.size / 1024).toFixed(2)} KB)`).join('\n')
        : 'No se adjuntaron archivos';
      
      // Prepare template parameters
      const templateParams = {
        to_name: 'Admin Bordados Personalizados',
        from_name: formData.name,
        from_email: `${formData.name}@cliente.com`, // EmailJS requires an email field
        phone: formData.phone,
        product_type: formData.productType,
        quantity: formData.quantity,
        required_date: formData.requiredDate,
        description: formData.description,
        additional_notes: formData.additionalNotes || 'Ninguna',
        attachments: attachmentsInfo,
        submission_date: new Date().toLocaleString('es-ES'),
        message_id: `CUST-${Date.now()}`
      };
      
      // Send email
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );
      
      console.log('Email sent successfully:', response);
      toast.success('¡Solicitud enviada con éxito! Nos contactaremos contigo pronto.');
      
      // Clear form after successful submission
      setFormData({
        productType: '',
        quantity: '',
        requiredDate: '',
        description: '',
        attachments: [],
        name: '',
        phone: '',
        additionalNotes: ''
      });
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error al enviar la solicitud. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar? Los cambios no se guardarán.')) {
      navigate('/');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            style: {
              background: '#2E7D32',
            },
          },
          error: {
            style: {
              background: '#D32F2F',
            },
          },
        }}
      />
      
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Solicitar Producto Personalizado</h2>
          <button className={styles.closeBtn} onClick={handleCancel}>
            <FiX size={24} />
          </button>
        </div>

        <p className={styles.modalSubtitle}>
          Cuéntanos como lo necesitas y te ayudamos a hacerlo realidad
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Tipo de Producto */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Tipo de Producto <span className={styles.required}>*</span>
            </label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Selecciona los productos que deseas...</option>
              {productTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Cantidad Requerida */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Cantidad Requerida <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Ej: 10, 5, 20..."
              className={styles.input}
              required
            />
          </div>

          {/* Fecha Requerida */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Fecha Requerida <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              name="requiredDate"
              value={formData.requiredDate}
              onChange={handleChange}
              className={styles.input}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Descripción de tu solicitud */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Descripción de tu solicitud <span className={styles.required}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe en detalle, las características, estilos que deseas"
              className={styles.textarea}
              maxLength={500}
              rows={5}
              required
            />
            <div className={styles.charCount}>
              {formData.description.length}/500 caracteres
            </div>
          </div>

          {/* Adjunta Referencias */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Adjunta Referencias <span className={styles.optional}>(Opcional)</span>
            </label>
            <div className={styles.fileUpload}>
              <input
                type="file"
                id="fileUpload"
                multiple
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="fileUpload" className={styles.uploadLabel}>
                <FiUpload size={20} />
                Subir Archivo PNG, JPG o PDF
              </label>
              <p className={styles.uploadHint}>
                Puedes subir múltiples archivos
              </p>
            </div>
            
            {/* Attachments List */}
            {formData.attachments.length > 0 && (
              <div className={styles.attachmentsList}>
                {formData.attachments.map((file, index) => (
                  <div key={index} className={styles.attachmentItem}>
                    <FiFile size={16} />
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className={styles.removeAttachment}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tu Nombre */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Tu Nombre <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre completo"
              className={styles.input}
              required
            />
          </div>

          {/* Tu número de teléfono */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Tu número de teléfono <span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ej: 8888-8888"
              className={styles.input}
              required
            />
          </div>

          {/* Notas adicionales */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Notas adicionales <span className={styles.optional}>(Opcional)</span>
            </label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Algo más que querías agregar"
              className={styles.textarea}
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Enviando...
                </>
              ) : (
                <>
                  <FiSend size={18} />
                  Enviar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Personalizaciones;