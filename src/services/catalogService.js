import { supabase } from '../lib/supabase';

const FALLBACK_IMAGE =
  'https://via.placeholder.com/600x600/8B5E3C/FFFFFF?text=Bordado+Sacuanjoche';

/**
 * Supabase devuelve los productos tal cual están guardados.
 * Aquí normalizamos los campos que usa la UI para evitar errores cuando
 * algún producto viene incompleto (sin imágenes, sin colores, etc.).
 */
export const normalizeProduct = (product = {}) => {
  const rawImages = Array.isArray(product.images) ? product.images.filter(Boolean) : [];

  return {
    ...product,
    id: product.id,
    title: product.title || 'Producto bordado',
    description: product.description || '',
    shortDescription:
      product.shortDescription || product.short_description || product.description || '',
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    images: rawImages.length > 0 ? rawImages : [FALLBACK_IMAGE],
    colors: Array.isArray(product.colors) ? product.colors.filter(Boolean) : [],
    sizes: Array.isArray(product.sizes) ? product.sizes.filter(Boolean) : [],
    category: product.category || '',
    subcategory: product.subcategory || '',
    gender: product.gender || '',
    status: product.status || 'active',
  };
};

export const getCatalogProducts = async () => {
  const { data, error } = await supabase.from('products').select('*').order('id');

  if (error) throw error;

  return (data || []).map(normalizeProduct);
};

export const isProductOutOfStock = (product) =>
  product?.stock === 0 || product?.status === 'agotado';
