import knowledgeBase from '../../utils/knowledge/knowledgeBase';

class RecommendationEngine {
  constructor() {
    this.knowledgeBase = knowledgeBase;
  }

  // Motor de inferencia basado en reglas y frames
  infer(userProfile) {
    const recommendations = [];
    const activatedRules = [];

    // Evaluar cada regla
    this.knowledgeBase.reglas.forEach(regla => {
      if (this.evaluateRule(regla, userProfile)) {
        activatedRules.push(regla);
        regla.accion.recomendar.forEach(tipoProducto => {
          const frame = this.knowledgeBase.productFrames[tipoProducto];
          if (frame) {
            recommendations.push({
              tipo: tipoProducto,
              frame: frame,
              regla: regla.nombre,
              razon: regla.accion.razon,
              prioridad: regla.accion.prioridad,
              score: this.calculateScore(frame, userProfile)
            });
          }
        });
      }
    });

    // Eliminar duplicados y ordenar por prioridad y score
    const uniqueRecommendations = this.removeDuplicates(recommendations);
    uniqueRecommendations.sort((a, b) => {
      if (b.prioridad !== a.prioridad) {
        return b.prioridad - a.prioridad;
      }
      return b.score - a.score;
    });

    return {
      recommendations: uniqueRecommendations.slice(0, 4),
      activatedRules: activatedRules,
      explanation: this.generateExplanation(activatedRules, userProfile)
    };
  }

  evaluateRule(regla, userProfile) {
    const condicion = regla.condicion;
    
    for (let key in condicion) {
      const ruleValue = condicion[key];
      const userValue = userProfile[key];
      
      if (userValue === undefined || userValue === null) {
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
          const hasCommon = userValue.some(v => ruleValue.includes(v));
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
    if (userProfile.presupuesto_min !== undefined && userProfile.presupuesto_max !== undefined) {
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
    recommendations.forEach(rec => {
      const key = rec.tipo;
      if (!seen.has(key) || seen.get(key).prioridad < rec.prioridad) {
        seen.set(key, rec);
      }
    });
    return Array.from(seen.values());
  }

  generateExplanation(activatedRules, userProfile) {
    if (activatedRules.length === 0) {
      return 'Basado en la información proporcionada, te recomiendo explorar nuestro catálogo completo para encontrar el bordado perfecto para ti.';
    }
    
    let explanation = 'He analizado tus respuestas y he activado las siguientes reglas de conocimiento:\n\n';
    activatedRules.forEach((regla, idx) => {
      explanation += `${idx + 1}. ${regla.nombre}: ${regla.accion.razon}\n`;
    });
    
    return explanation;
  }

  getProductName(tipo) {
    const names = {
      blusa_tradicional: 'Blusas Bordadas Tradicionales',
      accesorios: 'Accesorios Bordados',
      articulo_decorativo: 'Artículos Decorativos Bordados'
    };
    return names[tipo] || tipo;
  }

  getProductDescription(tipo) {
    const descriptions = {
      blusa_tradicional: 'Hermosas blusas bordadas a mano con diseños tradicionales nicaragüenses, perfectas para ocasiones especiales.',
      accesorios: 'Accesorios únicos como bolsos, pañuelos y complementos bordados a mano, ideales para regalar.',
      articulo_decorativo: 'Piezas decorativas artesanales con bordados detallados, perfectas para embellecer tu hogar o colección.'
    };
    return descriptions[tipo] || '';
  }
}

export const recommendationEngine = new RecommendationEngine();
export default recommendationEngine;
