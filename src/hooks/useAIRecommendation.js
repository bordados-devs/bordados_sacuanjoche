import { useState } from 'react';
import { recommendationEngine } from '../services/ai/recommendationEngine';
import { deepseekService } from '../services/ai/deepseekService';

export const useAIRecommendation = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [aiAdvice, setAiAdvice] = useState('');
  const [explanation, setExplanation] = useState('');
  const [activatedRules, setActivatedRules] = useState([]);
  const [error, setError] = useState(null);

  const getRecommendations = async (userProfile) => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar motor de inferencia basado en reglas y frames
      const result = recommendationEngine.infer(userProfile);
      setRecommendations(result.recommendations);
      setExplanation(result.explanation);
      setActivatedRules(result.activatedRules);
      
      // Obtener asesoramiento con IA (DeepSeek)
      try {
        const advice = await deepseekService.getRecommendationAdvice(
          userProfile,
          result.recommendations.map(rec => ({
            nombre: recommendationEngine.getProductName(rec.tipo),
            razon: rec.razon
          }))
        );
        setAiAdvice(advice);
      } catch (aiError) {
        console.warn('No se pudo obtener asesoramiento de IA:', aiError);
        setAiAdvice('Las recomendaciones han sido generadas basadas en nuestro conocimiento artesanal y las reglas del sistema experto.');
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setRecommendations([]);
    setAiAdvice('');
    setExplanation('');
    setActivatedRules([]);
    setError(null);
  };

  return {
    loading,
    recommendations,
    aiAdvice,
    explanation,
    activatedRules,
    error,
    getRecommendations,
    reset
  };
};

export default useAIRecommendation;
