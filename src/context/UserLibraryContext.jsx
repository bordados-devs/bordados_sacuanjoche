import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import {
  deleteProductReview,
  getUserLibrary,
  isLibrarySetupError,
  setProductLike,
  setSavedProduct,
  upsertProductReview,
} from '../services/userLibraryService';

const UserLibraryContext = createContext(null);

const EMPTY_SUMMARY = { count: 0, average: 0, distribution: {} };

const buildRatingSummary = (reviews) => {
  const summary = {};

  reviews.forEach((review) => {
    const key = String(review.product_id);
    if (!summary[key]) {
      summary[key] = {
        count: 0,
        total: 0,
        average: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const rating = Number(review.rating) || 0;
    summary[key].count += 1;
    summary[key].total += rating;
    if (rating >= 1 && rating <= 5) {
      summary[key].distribution[rating] += 1;
    }
  });

  Object.values(summary).forEach((item) => {
    item.average = item.count ? item.total / item.count : 0;
  });

  return summary;
};

export const useUserLibrary = () => useContext(UserLibraryContext);

export const UserLibraryProvider = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [likedIds, setLikedIds] = useState(() => new Set());
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [likeCounts, setLikeCounts] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setupError, setSetupError] = useState(false);

  const promptLogin = useCallback(
    (message = 'Inicia sesión para usar esta función.') => {
      toast.error(message);
      const redirect = encodeURIComponent(
        `${location.pathname}${location.search || ''}`
      );
      navigate(`/cuenta?redirect=${redirect}`);
    },
    [location.pathname, location.search, navigate]
  );

  const applyLibrary = useCallback((library) => {
    setLikedIds(library.likedIds);
    setLikeCounts({ ...library.likeCounts });
    setSavedIds(library.savedIds);
    setReviews(library.reviews);
  }, []);

  useEffect(() => {
    let isCurrent = true;

    const load = async () => {
      setLoading(true);
      try {
        const library = await getUserLibrary(user?.id || null);
        if (!isCurrent) return;
        applyLibrary(library);
        setSetupError(false);
      } catch (error) {
        if (!isCurrent) return;
        console.warn('No se pudieron cargar los datos de la comunidad:', error);
        setSetupError(isLibrarySetupError(error));
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    load();

    return () => {
      isCurrent = false;
    };
  }, [user?.id, applyLibrary]);

  const handleError = useCallback((error, fallbackMessage) => {
    if (isLibrarySetupError(error)) {
      setSetupError(true);
      toast.error(
        'Las funciones de la comunidad aún no están instaladas. Aplica la migración SQL de Supabase.'
      );
      return;
    }
    toast.error(fallbackMessage);
  }, []);

  const toggleLike = useCallback(
    async (productId) => {
      if (!user) {
        promptLogin('Inicia sesión para dar "me gusta" a los productos.');
        return;
      }

      const key = String(productId);
      const wasLiked = likedIds.has(key);

      // Actualización optimista para una respuesta inmediata.
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (wasLiked) next.delete(key);
        else next.add(key);
        return next;
      });
      setLikeCounts((prev) => ({
        ...prev,
        [key]: Math.max(0, (prev[key] || 0) + (wasLiked ? -1 : 1)),
      }));

      try {
        await setProductLike({
          userId: user.id,
          productId: Number(productId),
          liked: wasLiked,
        });
      } catch (error) {
        // Revertimos si Supabase rechazó el cambio.
        setLikedIds((prev) => {
          const next = new Set(prev);
          if (wasLiked) next.add(key);
          else next.delete(key);
          return next;
        });
        setLikeCounts((prev) => ({
          ...prev,
          [key]: Math.max(0, (prev[key] || 0) + (wasLiked ? 1 : -1)),
        }));
        handleError(error, 'No se pudo actualizar tu "me gusta".');
      }
    },
    [user, likedIds, promptLogin, handleError]
  );

  const toggleSave = useCallback(
    async (productId) => {
      if (!user) {
        promptLogin('Inicia sesión para guardar productos en tu cuenta.');
        return;
      }

      const key = String(productId);
      const wasSaved = savedIds.has(key);

      setSavedIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.delete(key);
        else next.add(key);
        return next;
      });

      try {
        await setSavedProduct({
          userId: user.id,
          productId: Number(productId),
          saved: wasSaved,
        });
        toast.success(
          wasSaved ? 'Producto eliminado de guardados' : 'Producto guardado en tu cuenta'
        );
      } catch (error) {
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.add(key);
          else next.delete(key);
          return next;
        });
        handleError(error, 'No se pudo actualizar tus guardados.');
      }
    },
    [user, savedIds, promptLogin, handleError]
  );

  const submitReview = useCallback(
    async ({ productId, rating, comment }) => {
      if (!user) {
        promptLogin('Inicia sesión para calificar y comentar este producto.');
        return { success: false };
      }

      const userName =
        user.user_metadata?.full_name?.trim() ||
        user.email?.split('@')[0] ||
        'Cliente';

      try {
        const savedReview = await upsertProductReview({
          userId: user.id,
          productId: Number(productId),
          userName,
          rating,
          comment,
        });

        setReviews((prev) => {
          const withoutCurrent = prev.filter(
            (review) =>
              !(
                review.user_id === user.id &&
                String(review.product_id) === String(productId)
              )
          );
          return [savedReview, ...withoutCurrent];
        });

        toast.success('¡Gracias por compartir tu opinión!');
        return { success: true, review: savedReview };
      } catch (error) {
        handleError(error, 'No se pudo publicar tu reseña.');
        return { success: false };
      }
    },
    [user, promptLogin, handleError]
  );

  const removeReview = useCallback(
    async (productId) => {
      if (!user) {
        promptLogin('Inicia sesión para administrar tus reseñas.');
        return { success: false };
      }

      try {
        await deleteProductReview({
          userId: user.id,
          productId: Number(productId),
        });
        setReviews((prev) =>
          prev.filter(
            (review) =>
              !(
                review.user_id === user.id &&
                String(review.product_id) === String(productId)
              )
          )
        );
        toast.success('Tu reseña fue eliminada.');
        return { success: true };
      } catch (error) {
        handleError(error, 'No se pudo eliminar tu reseña.');
        return { success: false };
      }
    },
    [user, promptLogin, handleError]
  );

  const reviewsByProduct = useMemo(() => {
    const grouped = {};
    reviews.forEach((review) => {
      const key = String(review.product_id);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(review);
    });

    Object.values(grouped).forEach((list) => {
      list.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
    });

    return grouped;
  }, [reviews]);

  const ratingSummary = useMemo(() => buildRatingSummary(reviews), [reviews]);

  const userReviews = useMemo(
    () => reviews.filter((review) => review.user_id === user?.id),
    [reviews, user?.id]
  );

  const getProductReviews = useCallback(
    (productId) => reviewsByProduct[String(productId)] || [],
    [reviewsByProduct]
  );

  const getRatingSummary = useCallback(
    (productId) => ratingSummary[String(productId)] || EMPTY_SUMMARY,
    [ratingSummary]
  );

  const getUserReview = useCallback(
    (productId) =>
      reviews.find(
        (review) =>
          review.user_id === user?.id &&
          String(review.product_id) === String(productId)
      ) || null,
    [reviews, user?.id]
  );

  const isLiked = useCallback(
    (productId) => likedIds.has(String(productId)),
    [likedIds]
  );

  const isSaved = useCallback(
    (productId) => savedIds.has(String(productId)),
    [savedIds]
  );

  const getLikeCount = useCallback(
    (productId) => likeCounts[String(productId)] || 0,
    [likeCounts]
  );

  const value = useMemo(
    () => ({
      likedIds,
      savedIds,
      loading,
      setupError,
      promptLogin,
      toggleLike,
      toggleSave,
      submitReview,
      removeReview,
      getProductReviews,
      getRatingSummary,
      getUserReview,
      userReviews,
      isLiked,
      isSaved,
      getLikeCount,
    }),
    [
      likedIds,
      savedIds,
      loading,
      setupError,
      promptLogin,
      toggleLike,
      toggleSave,
      submitReview,
      removeReview,
      getProductReviews,
      getRatingSummary,
      getUserReview,
      userReviews,
      isLiked,
      isSaved,
      getLikeCount,
    ]
  );

  return (
    <UserLibraryContext.Provider value={value}>
      {children}
    </UserLibraryContext.Provider>
  );
};
