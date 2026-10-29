import axios from 'axios';

const DEEPSEEK_API_URL = process.env.REACT_APP_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.REACT_APP_DEEPSEEK_API_KEY;

class DeepSeekService {
  constructor() {
    this.apiKey = DEEPSEEK_API_KEY;
    this.baseURL = DEEPSEEK_API_URL;
  }

  async generateResponse(messages, options = {}) {
    if (!this.apiKey) {
      throw new Error('API key de DeepSeek no configurada. Verifica las variables de entorno.');
    }

    try {
      const response = await axios.post(
        this.baseURL,
        {
          model: options.model || 'deepseek-chat',
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1000,
          stream: false,
          ...options
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error en DeepSeek API:', error.response?.data || error.message);
      throw error;
    }
  }

  async getRecommendationAdvice(userProfile, recommendations) {
    const systemPrompt = `Eres un asesor experto en bordados artesanales de Nicaragua, específicamente de Bordados Sacuanjoche.
    
    Tu función es dar recomendaciones personalizadas basadas en:
    - Conocimiento tradicional de bordados nicaragüenses
    - Técnicas artesanales
    - Materiales adecuados
    - Ocasiones y usos
    - Presupuesto del cliente
    
    Siempre responde de manera amable, profesional y con conocimiento artesanal.
    Explica el porqué de cada recomendación de forma clara.`;

    const userMessage = `
      Perfil del cliente:
      - Ocasión: ${userProfile.ocasion || 'No especificada'}
      - Género: ${userProfile.genero || 'No especificado'}
      - Uso: ${userProfile.uso || 'No especificado'}
      - Presupuesto: C$${userProfile.presupuesto_min || 0} - C$${userProfile.presupuesto_max || 0}
      - Colores preferidos: ${userProfile.colores_preferidos?.join(', ') || 'Cualquiera'}
      
      Productos recomendados:
      ${recommendations.map((rec, idx) => `${idx + 1}. ${rec.nombre} - ${rec.razon}`).join('\n')}
      
      Por favor, proporciona un asesoramiento detallado y personalizado explicando cada recomendación,
      sugerencias de colores, tiempo de elaboración y consejos para el cliente.
    `;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await this.generateResponse(messages, { temperature: 0.8, max_tokens: 1200 });
      return response.choices[0].message.content;
    } catch (error) {
      throw new Error('Error al obtener asesoramiento de IA');
    }
  }

  async answerQuestion(question, context = '') {
    const systemPrompt = `Eres un experto en bordados artesanales de Bordados Sacuanjoche en Nicaragua.
    Responde preguntas sobre técnicas de bordado, materiales, cuidados, precios aproximados y personalización.
    Sé preciso, útil y amigable.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: context ? `Contexto: ${context}\n\nPregunta: ${question}` : question }
    ];

    try {
      const response = await this.generateResponse(messages, { temperature: 0.7, max_tokens: 800 });
      return response.choices[0].message.content;
    } catch (error) {
      throw new Error('Error al responder la pregunta');
    }
  }
}

export const deepseekService = new DeepSeekService();
export default deepseekService;
