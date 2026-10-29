import { useEffect, useState } from 'react';
import { getCatalogProducts } from '../services/catalogService';

/**
 * Carga el catálogo real desde Supabase para que el recomendador IA pueda
 * mostrar productos existentes (con imágenes y detalles) en lugar de solo
 * categorías genéricas.
 */
export const useCatalogProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const catalog = await getCatalogProducts();
        if (isMounted) setProducts(catalog);
      } catch (err) {
        console.error('Error al cargar el catálogo para la IA:', err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
};

export default useCatalogProducts;
