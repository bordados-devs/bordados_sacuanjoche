import React, { useState } from 'react';
import { Brain, Sparkles, ArrowRight, ArrowLeft, CheckCircle, Clock, DollarSign, Palette } from 'lucide-react';
import { useAIRecommendation } from '../../hooks/useAIRecommendation';
import knowledgeBase from '../../utils/knowledge/knowledgeBase';
import styles from './AIRecommendationAssistant.module.css';
import { Link } from 'react-router-dom';

const AIRecommendationAssistant = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    ocasion: '',
    genero: '',
    uso: '',
    presupuesto_min: 0,
    presupuesto_max: 1000,
    colores_preferidos: []
  });
  const [showResults, setShowResults] = useState(false);
  
  const { loading, recommendations, aiAdvice, explanation, getRecommendations, reset } = useAIRecommendation();
  
  const questions = knowledgeBase.preguntas;
  const totalSteps = questions.length;

  const handleSelectOption = (campo, value) => {
    setUserProfile(prev => ({
      ...prev,
      [campo]: value
    }));
  };

  const handleMultiSelect = (campo, value) => {
    setUserProfile(prev => {
      const current = prev[campo] || [];
      if (current.includes(value)) {
        return {
          ...prev,
          [campo]: current.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [campo]: [...current, value]
        };
      }
    });
  };

  const handleBudgetChange = (type, value) => {
    setUserProfile(prev => ({
      ...prev,
      [type]: parseInt(value)
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
      await getRecommendations(userProfile);
      setShowResults(true);
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setUserProfile({
      ocasion: '',
      genero: '',
      uso: '',
      presupuesto_min: 0,
      presupuesto_max: 1000,
      colores_preferidos: []
    });
    setShowResults(false);
    reset();
  };

  const isStepComplete = () => {
    const question = questions[currentStep];
    if (question.tipo === 'select') {
      return userProfile[question.campo] !== '';
    } else if (question.tipo === 'multiselect') {
      return userProfile[question.campo]?.length > 0;
    } else if (question.tipo === 'range') {
      return true;
    }
    return false;
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
                className={`${styles.optionButton} ${userProfile[question.campo] === opcion.value ? styles.selected : ''}`}
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
                className={`${styles.colorChip} ${userProfile[question.campo]?.includes(opcion.value) ? styles.selected : ''}`}
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

  const renderResults = () => {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.resultsHeader}>
          <div className={styles.resultsIcon}>
            <CheckCircle size={40} />
          </div>
          <h1 className={styles.resultsTitle}>¡Recomendaciones Personalizadas!</h1>
          <p className={styles.resultsSubtitle}>
            Basadas en tu perfil y en nuestro Sistema Experto con Base de Conocimiento y Frames
          </p>
        </div>
        
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
            <h3 className={styles.aiAdviceTitle}>Asesoramiento con IA - DeepSeek</h3>
          </div>
          <div className={styles.aiAdviceText}>{aiAdvice || 'Las recomendaciones han sido generadas basadas en nuestro conocimiento artesanal y las reglas del sistema experto. Nuestro equipo te ayudará a personalizar cada pieza según tus necesidades.'}</div>
        </div>
        
        <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.75rem', marginBottom: 'var(--space-lg)', color: 'var(--gray-500)' }}>
          Productos Recomendados
        </h2>
        
        <div className={styles.recommendationsGrid}>
          {recommendations.map((rec, idx) => (
            <div key={idx} className={styles.recommendationCard}>
              <div className={styles.recommendationHeader}>
                <h3 className={styles.recommendationTitle}>
                  {rec.tipo === 'blusa_tradicional' && '👗 '}
                  {rec.tipo === 'accesorios' && '👜 '}
                  {rec.tipo === 'articulo_decorativo' && '🖼️ '}
                  {rec.tipo === 'blusa_tradicional' ? 'Blusas Bordadas Tradicionales' :
                   rec.tipo === 'accesorios' ? 'Accesorios Bordados' :
                   'Artículos Decorativos Bordados'}
                </h3>
                <span className={styles.priorityBadge}>
                  Prioridad {rec.prioridad}/10
                </span>
              </div>
              <p className={styles.recommendationDesc}>
                {rec.tipo === 'blusa_tradicional' && 'Hermosas blusas bordadas a mano con diseños tradicionales nicaragüenses'}
                {rec.tipo === 'accesorios' && 'Accesorios únicos bordados a mano, ideales para complementar tu estilo'}
                {rec.tipo === 'articulo_decorativo' && 'Piezas decorativas artesanales con bordados detallados para tu hogar'}
              </p>
              <div className={styles.recommendationDetails}>
                <div className={styles.detailItem}>
                  <Clock size={16} />
                  <span>Tiempo: {rec.frame.slots.tiempo_elaboracion.value}</span>
                </div>
                <div className={styles.detailItem}>
                  <DollarSign size={16} />
                  <span>Precio: C${rec.frame.slots.rango_precio.min} - C${rec.frame.slots.rango_precio.max}</span>
                </div>
                <div className={styles.detailItem}>
                  <Palette size={16} />
                  <span>Técnica: {rec.frame.slots.tecnica.value.replace(/_/g, ' ')}</span>
                </div>
              </div>
              <div className={styles.recommendationReason}>
                <strong>¿Por qué te lo recomiendo?</strong><br />
                {rec.razon}
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.resultsActions}>
          <button className={styles.actionButton} onClick={handleRestart}>
            <ArrowLeft size={18} />
            Nueva Consulta
          </button>
          <Link to="/personalizaciones" className={`${styles.actionButton} ${styles.primary}`}>
            <Sparkles size={18} />
            Solicitar Personalización
          </Link>
          <Link to="/catalogo" className={styles.actionButton}>
            Ver Catálogo Completo
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.assistantContainer}>
      {!showResults ? (
        <>
          <div className={styles.header}>
            <div className={styles.headerIcon}>
              <Brain size={40} />
            </div>
            <h1 className={styles.title}>Asistente Inteligente de Recomendación</h1>
            <p className={styles.subtitle}>
              Sistema basado en Base de Conocimiento, Frames y Reglas de Inferencia<br />
              Potenciado con IA DeepSeek para asesoramiento personalizado
            </p>
          </div>
          
          <div className={styles.progressBar}>
            {questions.map((_, idx) => (
              <React.Fragment key={idx}>
                <div className={`${styles.progressStep} ${idx <= currentStep ? styles.active : ''} ${idx < currentStep ? styles.completed : ''}`}>
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
                Analizando tu perfil con el motor de inferencia...<br />
                Aplicando reglas y frames de conocimiento...
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
