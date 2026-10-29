import { useState } from 'react';
import { recommendationEngine } from '../services/ai/recommendationEngine';
import { deepseekService } from '../services/ai/deepseekService';

const buildLocalAdvice = (result, userProfile) => {
  const matchedProducts = result.recommendations.flatMap(
    (recommendation) => recommendation.productos || []
  );
  const profileParts = [];

  if (userProfile.ocasion) profileParts.push(`ocasión "${userProfile.ocasion}"`);
  if (userProfile.genero) profileParts.push(`para "${userProfile.genero}"`);
  if (userProfile.uso) profileParts.push(`uso "${userProfile.uso}"`);
  if (userProfile.colores_preferidos?.length) {
    profileParts.push(`colores ${userProfile.colores_preferidos.join(', ')}`);
  }

  let advice = `Analicé tu perfil${
    profileParts.length ? ` (${profileParts.join(', ')})` : ''
  } y preparé estas recomendaciones artesanales.`;

  if (matchedProducts.length > 0) {
    advice += ` Encontré ${matchedProducts.length} producto(s) disponible(s) en el catálogo: ${matchedProducts
      .map((product) => product.title)
      .join(', ')}. Puedes revisar sus imágenes y detalles directamente en esta página.`;
  } else {
    advice +=
      ' No hay un producto exacto en el catálogo para este perfil, así que la mejor opción es una pieza personalizada. Usa el botón "Solicitar Personalización" para enviar toda la información por WhatsApp y recibir una cotización.';
  }

  advice +=
    ' Recomiendo confirmar colores y disponibilidad antes de iniciar la elaboración.';

  return advice;
};

export const useAIRecommendation = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [aiAdvice, setAiAdvice] = useState('');
  const [explanation, setExplanation] = useState('');
  const [activatedRules, setActivatedRules] = useState([]);
  const [error, setError] = useState(null);

  const getRecommendations = async (userProfile, catalogProducts = []) => {
    setLoading(true);
    setError(null);

    try {
      // Motor de inferencia basado en reglas, frames y catálogo real
      const result = recommendationEngine.infer(userProfile, catalogProducts);
      setRecommendations(result.recommendations);
      setSuggestions(result.suggestions || []);
      setExplanation(result.explanation);
      setActivatedRules(result.activatedRules);

      // Asesoramiento con IA (DeepSeek). Si falla, usamos un texto local
      // construido con las recomendaciones y los productos encontrados.
      try {
        const advice = await deepseekService.getRecommendationAdvice(
          userProfile,
          result.recommendations.map((rec) => ({
            nombre: rec.tipoLabel,
            razon: rec.razon,
            productos: (rec.productos || []).map((product) => product.title),
          }))
        );
        setAiAdvice(advice || buildLocalAdvice(result, userProfile));
      } catch (aiError) {
        console.warn('No se pudo obtener asesoramiento de IA:', aiError);
        setAiAdvice(buildLocalAdvice(result, userProfile));
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
    setSuggestions([]);
    setAiAdvice('');
    setExplanation('');
    setActivatedRules([]);
    setError(null);
  };

  return {
    loading,
    recommendations,
    suggestions,
    aiAdvice,
    explanation,
    activatedRules,
    error,
    getRecommendations,
    reset,
  };
};

export default useAIRecommendation;
