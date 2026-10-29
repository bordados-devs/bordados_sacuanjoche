import knowledgeBase from '../../utils/knowledge/knowledgeBase';
import {
  getCatalogSuggestions,
  matchProductsForType,
} from './productMatcher';

class RecommendationEngine {
  constructor() {
    this.knowledgeBase = knowledgeBase;
  }

  // Motor de inferencia basado en reglas y frames
  infer(userProfile = {}, catalogProducts = []) {
    const products = Array.isArray(catalogProducts) ? catalogProducts : [];
    const normalizedProfile = this.normalizeProfile(userProfile);
    const recommendations = [];
    const activatedRules = [];

    // El rango de presupuesto tiene valores por defecto; para saber si el
    // usuario realmente respondió, miramos las preguntas de perfil.
    const hasInfo = Boolean(
      normalizedProfile.ocasion ||
        normalizedProfile.genero ||
        normalizedProfile.uso ||
        normalizedProfile.colores_preferidos?.length > 0
    );

    if (!hasInfo) {
      Object.keys(this.knowledgeBase.productFrames).forEach((tipoProducto, idx) => {
        const frame = this.knowledgeBase.productFrames[tipoProducto];
        recommendations.push({
          tipo: tipoProducto,
          frame: frame,
          regla: 'Recomendación General',
          razon:
            'Pieza artesanal versátil, perfecta para conocer la calidad de nuestros bordados.',
          prioridad: 5 - idx,
          score: 50,
        });
      });

      const generalRecommendations = this.attachCatalogProducts(
        recommendations.slice(0, 3),
        normalizedProfile,
        products
      );

      return {
        recommendations: generalRecommendations,
        suggestions: this.buildSuggestions(
          products,
          normalizedProfile,
          generalRecommendations
        ),
        activatedRules: [],
        explanation: this.generateExplanation(
          [],
          normalizedProfile,
          generalRecommendations
        ),
      };
    }

    // Evaluar cada regla
    this.knowledgeBase.reglas.forEach((regla) => {
      if (this.evaluateRule(regla, normalizedProfile)) {
        activatedRules.push(regla);
        regla.accion.recomendar.forEach((tipoProducto) => {
          const frame = this.knowledgeBase.productFrames[tipoProducto];
          if (frame) {
            recommendations.push({
              tipo: tipoProducto,
              frame: frame,
              regla: regla.nombre,
              razon: regla.accion.razon,
              prioridad: regla.accion.prioridad,
              score: this.calculateScore(frame, normalizedProfile),
            });
          }
        });
      }
    });

    // Si no hay reglas activadas, dar recomendaciones basadas en presupuesto
    if (recommendations.length === 0) {
      Object.keys(this.knowledgeBase.productFrames).forEach((tipoProducto) => {
        const frame = this.knowledgeBase.productFrames[tipoProducto];
        const userMax = normalizedProfile.presupuesto_max || 2000;
        if (frame.slots.rango_precio.max <= userMax + 200) {
          recommendations.push({
            tipo: tipoProducto,
            frame: frame,
            regla: 'Recomendación por Presupuesto',
            razon:
              'Se ajusta a tu rango de presupuesto y es una excelente opción en nuestro catálogo.',
            prioridad: 6,
            score: this.calculateScore(frame, normalizedProfile),
          });
        }
      });
    }

    // Si aún no hay nada, mostrar las categorías base.
    if (recommendations.length === 0) {
      Object.keys(this.knowledgeBase.productFrames).forEach((tipoProducto, idx) => {
        recommendations.push({
          tipo: tipoProducto,
          frame: this.knowledgeBase.productFrames[tipoProducto],
          regla: 'Recomendación General',
          razon:
            'Nuestro equipo puede ayudarte a elegir la mejor pieza según lo que necesitas.',
          prioridad: 5 - idx,
          score: 40,
        });
      });
    }

    // Eliminar duplicados y ordenar por prioridad y score
    const uniqueRecommendations = this.removeDuplicates(recommendations);
    uniqueRecommendations.sort((a, b) => {
      if (b.prioridad !== a.prioridad) {
        return b.prioridad - a.prioridad;
      }
      return b.score - a.score;
    });

    const finalRecommendations = this.attachCatalogProducts(
      uniqueRecommendations.slice(0, 4),
      normalizedProfile,
      products
    );

    return {
      recommendations: finalRecommendations,
      suggestions: this.buildSuggestions(products, normalizedProfile, finalRecommendations),
      activatedRules: activatedRules,
      explanation: this.generateExplanation(
        activatedRules,
        normalizedProfile,
        finalRecommendations
      ),
    };
  }

  normalizeProfile(userProfile) {
    const min = Number(userProfile?.presupuesto_min) || 0;
    const max = Number(userProfile?.presupuesto_max) || 0;

    return {
      ...userProfile,
      presupuesto_min: Math.min(min, max || min),
      presupuesto_max: Math.max(min, max || min),
      colores_preferidos: Array.isArray(userProfile?.colores_preferidos)
        ? userProfile.colores_preferidos
        : [],
    };
  }

  attachCatalogProducts(recommendations, userProfile, products) {
    return recommendations.map((recommendation) => ({
      ...recommendation,
      tipoLabel: this.getProductName(recommendation.tipo),
      descripcion: this.getProductDescription(recommendation.tipo),
      productos: matchProductsForType(products, recommendation.tipo, userProfile),
    }));
  }

  buildSuggestions(products, userProfile, recommendations) {
    const matchedIds = recommendations.flatMap((recommendation) =>
      (recommendation.productos || []).map((product) => product.id)
    );

    return getCatalogSuggestions(products, userProfile, matchedIds, 3);
  }

  evaluateRule(regla, userProfile) {
    const condicion = regla.condicion;

    for (let key in condicion) {
      const ruleValue = condicion[key];
      const userValue = userProfile[key];

      if (userValue === undefined || userValue === null || userValue === '') {
        continue; // Skip if user didn't provide this info
      }

      // Evaluar diferentes tipos de condiciones
      if (typeof ruleValue === 'object' && !Array.isArray(ruleValue)) {
        // Condiciones con operadores
        for (let operator in ruleValue) {
          const targetValue = ruleValue[operator];
          if (operator === '<=') {
            if (!(userValue <= targetValue)) return false;
          } else if (operator === '>=') {
            if (!(userValue >= targetValue)) return false;
          } else if (operator === '<') {
            if (!(userValue < targetValue)) return false;
          } else if (operator === '>') {
            if (!(userValue > targetValue)) return false;
          }
        }
      } else if (Array.isArray(ruleValue)) {
        // Condición: el valor del usuario debe estar en la lista
        if (Array.isArray(userValue)) {
          // Si ambos son arrays, verificar intersección
          const hasCommon = userValue.some((v) => ruleValue.includes(v));
          if (!hasCommon) return false;
        } else {
          if (!ruleValue.includes(userValue)) return false;
        }
      } else {
        // Condición exacta
        if (userValue !== ruleValue) return false;
      }
    }

    return true;
  }

  calculateScore(frame, userProfile) {
    let score = 0;

    // Puntuación por presupuesto
    if (
      userProfile.presupuesto_min !== undefined &&
      userProfile.presupuesto_max !== undefined
    ) {
      const frameMin = frame.slots.rango_precio.min;
      const frameMax = frame.slots.rango_precio.max;
      const userMin = userProfile.presupuesto_min;
      const userMax = userProfile.presupuesto_max;

      // Verificar si hay solapamiento
      if (!(frameMax < userMin || frameMin > userMax)) {
        score += 30;
      }
    }

    // Puntuación por personalizable
    if (frame.slots.personalizable.value) {
      score += 10;
    }

    // Puntuación base
    score += 20;

    return score;
  }

  removeDuplicates(recommendations) {
    const seen = new Map();
    recommendations.forEach((rec) => {
      const key = rec.tipo;
      if (!seen.has(key) || seen.get(key).prioridad < rec.prioridad) {
        seen.set(key, rec);
      }
    });
    return Array.from(seen.values());
  }

  generateExplanation(activatedRules, userProfile, recommendations = []) {
    let explanation;

    if (activatedRules.length === 0) {
      explanation =
        'He analizado tu perfil y te ofrezco las mejores recomendaciones basadas en nuestro catálogo de bordados artesanales. Cada pieza ha sido cuidadosamente seleccionada considerando tus preferencias.';
    } else {
      explanation =
        'He analizado tus respuestas utilizando nuestro Sistema Experto con Base de Conocimiento y Frames:\n\n';
      activatedRules.forEach((regla) => {
        explanation += `• ${regla.nombre}: ${regla.accion.razon}\n`;
      });
      explanation +=
        '\nEstas recomendaciones se basan en reglas lógicas y conocimiento artesanal de Bordados Sacuanjoche.';
    }

    const matchedProducts = recommendations.reduce(
      (total, recommendation) => total + (recommendation.productos?.length || 0),
      0
    );

    if (matchedProducts > 0) {
      explanation += `\n\n✅ Encontré ${matchedProducts} producto(s) reales del catálogo que coinciden con tu perfil. Puedes ver imágenes, precios, colores y disponibilidad antes de decidir.`;
    } else {
      explanation +=
        '\n\n🛠️ No encontré un producto exacto en el catálogo para estas preferencias. Por eso preparé una cotización personalizada que puedes enviar directamente por WhatsApp con un solo clic.';
    }

    return explanation;
  }

  getProductName(tipo) {
    const names = {
      blusa_tradicional: 'Bordados Tradicionales y Florales',
      accesorios: 'Accesorios y Botas Bordadas',
      articulo_decorativo: 'Piezas de Colección y Decoración',
    };
    return names[tipo] || tipo;
  }

  getProductDescription(tipo) {
    const descriptions = {
      blusa_tradicional:
        'Diseños bordados a mano inspirados en la tradición nicaragüense, con acabados florales y detalles artesanales.',
      accesorios:
        'Botas, bolsos y complementos bordados a mano. Piezas únicas para regalar o complementar tu estilo.',
      articulo_decorativo:
        'Piezas decorativas y de colección con bordados detallados, ideales para el hogar o para atesorar.',
    };
    return descriptions[tipo] || '';
  }
}

export const recommendationEngine = new RecommendationEngine();
export default recommendationEngine;
