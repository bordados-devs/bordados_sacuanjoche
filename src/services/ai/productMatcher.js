import { isProductOutOfStock } from '../catalogService';

// Palabras que relacionan cada frame de conocimiento con productos reales
// del catálogo. No usamos "bordado" porque aparece en casi todos los títulos.
const TYPE_KEYWORDS = {
  blusa_tradicional: [
    'blusa',
    'camisa',
    'vestido',
    'prenda',
    'floral',
    'tradicional',
    'dama',
    'mujer',
    'saquanjoche',
    'sacuanjoche',
  ],
  accesorios: [
    'accesorio',
    'bolso',
    'bolsa',
    'cartera',
    'panuelo',
    'bufanda',
    'gorra',
    'sombrero',
    'bota',
    'botas',
    'cinturon',
    'iniciales',
  ],
  articulo_decorativo: [
    'decorativo',
    'decoracion',
    'hogar',
    'cuadro',
    'cojin',
    'mantel',
    'camino',
    'florero',
    'adorno',
    'premium',
    'coleccion',
  ],
};

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const productHaystack = (product) =>
  normalize(
    [
      product.title,
      product.description,
      product.shortDescription,
      product.short_description,
      product.category,
      product.subcategory,
      product.gender,
      ...(Array.isArray(product.colors) ? product.colors : []),
    ]
      .filter(Boolean)
      .join(' ')
  );

const getBudget = (userProfile) => {
  const rawMin = Number(userProfile?.presupuesto_min) || 0;
  const rawMax = Number(userProfile?.presupuesto_max) || 0;
  const min = Math.min(rawMin, rawMax || rawMin);
  const max = Math.max(rawMin, rawMax || rawMin);
  return { min, max };
};

const genderMatches = (product, userProfile) => {
  const userGender = normalize(userProfile?.genero);
  const category = normalize(product.category);
  const gender = normalize(product.gender);

  if (!userGender) return 0;

  if (userGender === 'femenino') {
    return category === 'women' || gender.includes('mujer') ? 15 : 0;
  }
  if (userGender === 'masculino') {
    return category === 'men' || gender.includes('hombre') ? 15 : 0;
  }
  if (userGender === 'infantil') {
    return category === 'kids' || gender.includes('nino') || gender.includes('nina') ? 15 : 0;
  }
  // Unisex: cualquier categoría puede servir, pero priorizamos las neutrales.
  return category === 'unisex' ? 8 : 2;
};

const budgetScore = (product, userProfile) => {
  const price = Number(product.price) || 0;
  const { min, max } = getBudget(userProfile);

  if (max === 0) return 0;
  if (price >= min && price <= max) return 25;
  if (price < min) return 5;

  const overBudget = price - max;
  if (overBudget <= max * 0.2) return 5;
  if (overBudget <= max * 0.5) return -10;
  return -30;
};

const colorScore = (product, userProfile) => {
  const preferred = (userProfile?.colores_preferidos || []).map(normalize).filter(Boolean);
  if (preferred.length === 0) return 0;

  const productColors = (product.colors || []).map(normalize);
  const matches = preferred.filter((color) =>
    productColors.some((productColor) => productColor.includes(color) || color.includes(productColor))
  );

  return matches.length * 8;
};

const availabilityScore = (product) => {
  if (isProductOutOfStock(product)) return -50;

  let score = 5;
  if (normalize(product.status) === 'active') score += 5;
  return score;
};

const baseScore = (product, userProfile) =>
  genderMatches(product, userProfile) +
  budgetScore(product, userProfile) +
  colorScore(product, userProfile) +
  availabilityScore(product);

/**
 * Puntúa un producto real frente a un frame de recomendación.
 * Devuelve 0 cuando el producto no tiene relación con ese tipo.
 */
export const scoreProductForType = (product, tipo, userProfile) => {
  const haystack = productHaystack(product);
  const keywords = TYPE_KEYWORDS[tipo] || [];
  const matchedKeywords = keywords.filter((keyword) => haystack.includes(normalize(keyword)));

  if (matchedKeywords.length === 0) {
    return { score: 0, matchedKeywords };
  }

  const score =
    matchedKeywords.length * 12 + baseScore(product, userProfile);

  return { score, matchedKeywords };
};

/**
 * Devuelve los productos del catálogo que mejor encajan con un tipo
 * recomendado por el motor de inferencia.
 */
export const matchProductsForType = (products = [], tipo, userProfile, limit = 3) =>
  products
    .map((product) => {
      const { score, matchedKeywords } = scoreProductForType(product, tipo, userProfile);
      return { product, score, matchedKeywords };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ product }) => product);

/**
 * Sugerencias generales del catálogo (sin atarlas a un frame concreto).
 * Sirven como "también te puede interesar" cuando el perfil tiene datos.
 */
export const getCatalogSuggestions = (products = [], userProfile, excludeIds = [], limit = 3) => {
  const excluded = new Set(excludeIds.map((id) => String(id)));

  return products
    .filter((product) => !excluded.has(String(product.id)))
    .map((product) => ({
      product,
      score: baseScore(product, userProfile),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ product }) => product);
};

export const getTypeKeywords = (tipo) => TYPE_KEYWORDS[tipo] || [];
