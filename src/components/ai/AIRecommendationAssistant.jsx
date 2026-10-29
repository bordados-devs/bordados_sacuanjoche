import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  Palette,
  Share2,
  Store,
  Wand2,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import RecommendedProductCard from './RecommendedProductCard';
import ProductModal from '../../pages/catalogo/ProductModal';
import { useAIRecommendation } from '../../hooks/useAIRecommendation';
import { useCatalogProducts } from '../../hooks/useCatalogProducts';
import knowledgeBase from '../../utils/knowledge/knowledgeBase';
import {
  buildQuotation,
  downloadQuotationImage,
  openWhatsAppQuotation,
  shareQuotationImage,
} from '../../services/ai/quotationService';
import styles from './AIRecommendationAssistant.module.css';

const initialProfile = {
  ocasion: '',
  genero: '',
  uso: '',
  presupuesto_min: 0,
  presupuesto_max: 1000,
  colores_preferidos: [],
};

const AIRecommendationAssistant = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState(initialProfile);
  const [showResults, setShowResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sharingImage, setSharingImage] = useState(false);

  const { products, loading: catalogLoading, error: catalogError } = useCatalogProducts();

  const {
    loading,
    recommendations,
    suggestions,
    aiAdvice,
    explanation,
    getRecommendations,
    reset,
  } = useAIRecommendation();

  const questions = knowledgeBase.preguntas;
  const totalSteps = questions.length;

  const handleSelectOption = (campo, value) => {
    setUserProfile((prev) => ({
      ...prev,
      [campo]: value,
    }));
  };

  const handleMultiSelect = (campo, value) => {
    setUserProfile((prev) => {
      const current = prev[campo] || [];
      if (current.includes(value)) {
        return {
          ...prev,
          [campo]: current.filter((item) => item !== value),
        };
      }

      return {
        ...prev,
        [campo]: [...current, value],
      };
    });
  };

  const handleBudgetChange = (type, value) => {
    setUserProfile((prev) => ({
      ...prev,
      [type]: parseInt(value, 10),
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await getRecommendations(userProfile, products);
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
      toast.error('No se pudieron generar las recomendaciones. Intenta de nuevo.');
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setUserProfile(initialProfile);
    setShowResults(false);
    setSelectedProduct(null);
    reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStepComplete = () => {
    const question = questions[currentStep];
    if (question.tipo === 'select') {
      return userProfile[question.campo] !== '';
    }
    if (question.tipo === 'multiselect') {
      return userProfile[question.campo]?.length > 0;
    }
    if (question.tipo === 'range') {
      return true;
    }
    return false;
  };

  const addToCart = (product, size, color, quantity) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = existingCart.findIndex(
      (item) => item.id === product.id && item.size === size && item.color === color
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += quantity;
      toast.success(`Cantidad actualizada: ${product.title}`);
    } else {
      existingCart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        size,
        color,
        quantity,
        image: product.images?.[0],
      });
      toast.success(`¡${product.title} agregado al carrito!`);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const createQuote = (selectedRecommendation = null) =>
    buildQuotation({
      userProfile,
      recommendations,
      selectedRecommendation,
      catalogProducts: products,
    });

  const handleRequestQuotation = (selectedRecommendation = null) => {
    const quote = createQuote(selectedRecommendation);

    // Se abre primero WhatsApp (dentro del gesto del usuario) para que el
    // navegador no bloquee la ventana. Luego generamos la imagen resumen.
    openWhatsAppQuotation(quote);
    toast.success('Abriendo WhatsApp con toda la información de la cotización...');

    downloadQuotationImage(quote)
      .then(() => {
        toast.success(
          'También descargamos una imagen resumen. Adjúntala en el chat de WhatsApp.',
          { duration: 7000, icon: '🖼️' }
        );
      })
      .catch((error) => {
        console.warn('No se pudo generar la imagen de la cotización:', error);
        toast(
          'La cotización se abrió en WhatsApp. No se pudo generar la imagen resumen.',
          { duration: 6000, icon: 'ℹ️' }
        );
      });
  };

  const handleShareQuotationImage = async (selectedRecommendation = null) => {
    const quote = createQuote(selectedRecommendation);
    setSharingImage(true);

    try {
      const result = await shareQuotationImage(quote);
      if (result.shared) {
        toast.success('Selecciona WhatsApp para enviar la imagen y el resumen.');
      } else {
        toast.success('Imagen descargada. Adjúntala en el chat de WhatsApp.', {
          duration: 7000,
          icon: '🖼️',
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error al compartir la imagen de la cotización:', error);
        toast.error('No se pudo compartir la imagen. Intenta de nuevo.');
      }
    } finally {
      setSharingImage(false);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentStep];

    return (
      <div className={styles.questionCard}>
        <span className={styles.questionNumber}>
          Pregunta {currentStep + 1} de {totalSteps}
        </span>
        <h2 className={styles.questionTitle}>{question.pregunta}</h2>

        {question.tipo === 'select' && (
          <div className={styles.optionsGrid}>
            {question.opciones.map((opcion) => (
              <button
                key={opcion.value}
                className={`${styles.optionButton} ${
                  userProfile[question.campo] === opcion.value ? styles.selected : ''
                }`}
                onClick={() => handleSelectOption(question.campo, opcion.value)}
              >
                {opcion.label}
              </button>
            ))}
          </div>
        )}

        {question.tipo === 'range' && (
          <div className={styles.budgetSection}>
            <div className={styles.budgetLabels}>
              <span>Mínimo: C${userProfile.presupuesto_min}</span>
              <span>Máximo: C${userProfile.presupuesto_max}</span>
            </div>
            <input
              type="range"
              min={question.min}
              max={question.max}
              step={question.step}
              value={userProfile.presupuesto_min}
              onChange={(e) => handleBudgetChange('presupuesto_min', e.target.value)}
              className={styles.budgetSlider}
            />
            <input
              type="range"
              min={question.min}
              max={question.max}
              step={question.step}
              value={userProfile.presupuesto_max}
              onChange={(e) => handleBudgetChange('presupuesto_max', e.target.value)}
              className={styles.budgetSlider}
            />
            <div className={styles.rangeDisplay}>
              Rango: C${userProfile.presupuesto_min} - C${userProfile.presupuesto_max}
            </div>
          </div>
        )}

        {question.tipo === 'multiselect' && (
          <div className={styles.multiselectGrid}>
            {question.opciones.map((opcion) => (
              <button
                key={opcion.value}
                className={`${styles.colorChip} ${
                  userProfile[question.campo]?.includes(opcion.value) ? styles.selected : ''
                }`}
                onClick={() => handleMultiSelect(question.campo, opcion.value)}
              >
                {opcion.label}
              </button>
            ))}
          </div>
        )}

        <div className={styles.navigation}>
          <button
            className={styles.navButton}
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={18} />
            Anterior
          </button>
          <button
            className={`${styles.navButton} ${styles.primary}`}
            onClick={nextStep}
            disabled={!isStepComplete() || loading}
          >
            {currentStep === totalSteps - 1 ? (
              <>
                {loading ? 'Analizando...' : 'Obtener Recomendaciones'}
                <Sparkles size={18} />
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderRecommendationDetails = (rec) => {
    const slots = rec.frame?.slots || {};
    const materials = slots.materiales?.value || [];
    const priceRange = slots.rango_precio;

    return (
      <div className={styles.recommendationDetails}>
        <div className={styles.detailItem}>
          <Clock size={16} />
          <span>Tiempo: {slots.tiempo_elaboracion?.value || 'Por confirmar'}</span>
        </div>
        <div className={styles.detailItem}>
          <DollarSign size={16} />
          <span>
            Rango de referencia: C${priceRange?.min || 0} - C${priceRange?.max || 0}
          </span>
        </div>
        <div className={styles.detailItem}>
          <Palette size={16} />
          <span>
            Técnica: {(slots.tecnica?.value || 'Bordado artesanal').replace(/_/g, ' ')}
          </span>
        </div>
        <div className={styles.detailItem}>
          <Wand2 size={16} />
          <span>
            Materiales:{' '}
            {materials.length
              ? materials.map((material) => material.replace(/_/g, ' ')).join(', ')
              : 'Por definir con el cliente'}
          </span>
        </div>
      </div>
    );
  };

  const renderRecommendation = (rec) => {
    const hasProducts = rec.productos?.length > 0;

    return (
      <section key={rec.tipo} className={styles.recommendationSection}>
        <div className={styles.recommendationSectionHeader}>
          <div>
            <span
              className={`${styles.availabilityPill} ${
                hasProducts ? styles.available : styles.custom
              }`}
            >
              {hasProducts ? (
                <>
                  <Store size={14} />
                  Disponible en catálogo
                </>
              ) : (
                <>
                  <Wand2 size={14} />
                  Hecho a medida
                </>
              )}
            </span>
            <h3 className={styles.recommendationTitle}>{rec.tipoLabel}</h3>
            <p className={styles.recommendationDesc}>{rec.descripcion}</p>
          </div>
          <span className={styles.priorityBadge}>Prioridad {rec.prioridad}/10</span>
        </div>

        <div className={styles.recommendationReason}>
          <strong>¿Por qué te lo recomiendo?</strong>
          <br />
          {rec.razon}
        </div>

        {renderRecommendationDetails(rec)}

        {hasProducts ? (
          <>
            <p className={styles.sectionHint}>
              Encontramos estos productos reales de nuestro catálogo. Toca una imagen
              o "Ver detalles completos" para revisar todas las fotos, colores y stock.
            </p>
            <div className={styles.catalogProductsGrid}>
              {rec.productos.map((product) => (
                <RecommendedProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </div>
            <div className={styles.inlineActions}>
              <button
                type="button"
                className={styles.outlineQuoteButton}
                onClick={() => handleRequestQuotation(rec)}
              >
                <FaWhatsapp size={18} />
                Cotizar una personalización de esta línea
              </button>
              <button
                type="button"
                className={styles.imageShareButton}
                onClick={() => handleShareQuotationImage(rec)}
                disabled={sharingImage}
              >
                <Share2 size={18} />
                Compartir resumen como imagen
              </button>
            </div>
          </>
        ) : (
          <div className={styles.customRecommendationCard}>
            <div className={styles.customCardIcon}>
              <Wand2 size={26} />
            </div>
            <div>
              <h4>Este diseño no existe todavía en el catálogo</h4>
              <p>
                Podemos elaborarlo a medida con tus colores, técnica y presupuesto.
                Toda la información de tu perfil y de esta recomendación se enviará
                automáticamente a WhatsApp para que recibas una cotización.
              </p>
            </div>
            <div className={styles.customActions}>
              <button
                type="button"
                className={styles.whatsappQuoteButton}
                onClick={() => handleRequestQuotation(rec)}
              >
                <FaWhatsapp size={20} />
                Solicitar Personalización
              </button>
              <button
                type="button"
                className={styles.imageShareButton}
                onClick={() => handleShareQuotationImage(rec)}
                disabled={sharingImage}
              >
                <Share2 size={18} />
                Compartir resumen como imagen
              </button>
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderResults = () => {
    const totalCatalogProducts = recommendations.reduce(
      (total, rec) => total + (rec.productos?.length || 0),
      0
    );

    return (
      <div className={styles.resultsContainer}>
        <div className={styles.resultsHeader}>
          <div className={styles.resultsIcon}>
            <CheckCircle size={40} />
          </div>
          <h1 className={styles.resultsTitle}>¡Recomendaciones Personalizadas!</h1>
          <p className={styles.resultsSubtitle}>
            {totalCatalogProducts > 0
              ? `Encontramos ${totalCatalogProducts} producto(s) reales del catálogo que coinciden con tu perfil.`
              : 'Preparamos una cotización personalizada porque no hay un producto exacto en el catálogo.'}
          </p>
        </div>

        {catalogError && (
          <div className={styles.catalogWarning}>
            No pudimos consultar el catálogo en este momento. Las recomendaciones se
            pueden enviar como cotización personalizada por WhatsApp.
          </div>
        )}

        <div className={styles.explanationCard}>
          <div className={styles.explanationTitle}>
            <Brain size={24} />
            Explicación del Sistema Inteligente
          </div>
          <div className={styles.explanationText}>{explanation}</div>
        </div>

        <div className={styles.aiAdviceCard}>
          <div className={styles.aiAdviceHeader}>
            <Sparkles size={24} color="#8B5E3C" />
            <h3 className={styles.aiAdviceTitle}>Asesoramiento Inteligente</h3>
          </div>
          <div className={styles.aiAdviceText}>
            {aiAdvice ||
              'Las recomendaciones se generaron con nuestro conocimiento artesanal y las reglas del sistema experto. Nuestro equipo te ayudará a personalizar cada pieza según tus necesidades.'}
          </div>
        </div>

        <div className={styles.recommendationsHeader}>
          <h2>Tu recomendación</h2>
          <p>
            {catalogLoading
              ? 'Consultando disponibilidad en el catálogo...'
              : 'Productos reales y opciones hechas a medida según tu perfil.'}
          </p>
        </div>

        {recommendations.map(renderRecommendation)}

        {suggestions.length > 0 && (
          <section className={styles.suggestionsSection}>
            <div className={styles.recommendationsHeader}>
              <h2>También te pueden interesar</h2>
              <p>Otras piezas del catálogo que combinan con tu perfil.</p>
            </div>
            <div className={styles.catalogProductsGrid}>
              {suggestions.map((product) => (
                <RecommendedProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </div>
          </section>
        )}

        <div className={styles.quoteCard}>
          <div className={styles.quoteCardHeader}>
            <div className={styles.quoteCardIcon}>
              <FaWhatsapp size={28} />
            </div>
            <div>
              <h3>¿Quieres una cotización con toda la información?</h3>
              <p>
                Envía tu perfil, la recomendación de la IA, los productos
                encontrados y los detalles de precio directamente a WhatsApp.
              </p>
            </div>
          </div>

          <div className={styles.quoteActions}>
            <button
              type="button"
              className={styles.whatsappQuoteButton}
              onClick={() => handleRequestQuotation()}
            >
              <FaWhatsapp size={20} />
              Solicitar Personalización
            </button>
            <button
              type="button"
              className={styles.imageShareButton}
              onClick={() => handleShareQuotationImage()}
              disabled={sharingImage}
            >
              <Share2 size={18} />
              {sharingImage ? 'Generando imagen...' : 'Compartir resumen como imagen'}
            </button>
          </div>

          <p className={styles.quoteHint}>
            El botón abre WhatsApp con el mensaje completo, incluyendo la etiqueta
            <strong> “Recomendado por IA”</strong>. También se descarga una imagen
            resumen para que puedas adjuntarla en el chat y facilitar el análisis.
          </p>
        </div>

        <div className={styles.resultsActions}>
          <button className={styles.actionButton} onClick={handleRestart}>
            <ArrowLeft size={18} />
            Nueva Consulta
          </button>
          <Link to="/catalogo" className={styles.actionButton}>
            Ver Catálogo Completo
            <ArrowRight size={18} />
          </Link>
        </div>

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={addToCart}
          />
        )}
      </div>
    );
  };

  return (
    <div className={styles.assistantContainer}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
          success: { style: { background: '#2E7D32' } },
          error: { style: { background: '#D32F2F' } },
        }}
      />

      {!showResults ? (
        <>
          <div className={styles.header}>
            <div className={styles.headerIcon}>
              <Brain size={40} />
            </div>
            <h1 className={styles.title}>Asistente Inteligente de Recomendación</h1>
            <p className={styles.subtitle}>
              Sistema basado en Base de Conocimiento, Frames y Reglas de Inferencia
              <br />
              Conectado al catálogo real y potenciado con IA para asesoramiento
              personalizado
            </p>
          </div>

          <div className={styles.progressBar}>
            {questions.map((_, idx) => (
              <React.Fragment key={idx}>
                <div
                  className={`${styles.progressStep} ${
                    idx <= currentStep ? styles.active : ''
                  } ${idx < currentStep ? styles.completed : ''}`}
                >
                  <div className={styles.stepCircle}>
                    {idx < currentStep ? <CheckCircle size={20} /> : idx + 1}
                  </div>
                  <span className={styles.stepLabel}>Paso {idx + 1}</span>
                </div>
                {idx < questions.length - 1 && <div className={styles.progressLine} />}
              </React.Fragment>
            ))}
          </div>

          {loading && currentStep === totalSteps - 1 ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>
                Analizando tu perfil con el motor de inferencia...
                <br />
                Buscando productos reales en el catálogo...
              </p>
            </div>
          ) : (
            renderQuestion()
          )}
        </>
      ) : (
        renderResults()
      )}
    </div>
  );
};

export default AIRecommendationAssistant;
