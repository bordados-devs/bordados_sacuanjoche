import { supabase } from '../lib/supabase';

const isMissingTableError = (error) =>
  error?.code === 'PGRST205' ||
  error?.code === '42P01' ||
  /could not find the table/i.test(error?.message || '');

const enhanceError = (error) => {
  const enhanced = new Error(error?.message || 'No se pudo completar la acción.');
  enhanced.code = error?.code;
  enhanced.details = error?.details;
  enhanced.isSetupError = isMissingTableError(error);
  return enhanced;
};

export const isLibrarySetupError = isMissingTableError;

export const getUserLibrary = async (userId) => {
  const [likesResult, savedResult, reviewsResult] = await Promise.all([
    supabase.from('product_likes').select('user_id, product_id'),
    userId
      ? supabase
          .from('saved_products')
          .select('product_id, created_at')
          .eq('user_id', userId)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from('product_reviews')
      .select('*')
      .order('created_at', { ascending: false }),
  ]);

  const error = likesResult.error || savedResult.error || reviewsResult.error;
  if (error) throw enhanceError(error);

  const likedIds = new Set();
  const likeCounts = {};

  (likesResult.data || []).forEach((row) => {
    const key = String(row.product_id);
    likeCounts[key] = (likeCounts[key] || 0) + 1;
    if (row.user_id === userId) likedIds.add(key);
  });

  return {
    likedIds,
    savedIds: new Set((savedResult.data || []).map((row) => String(row.product_id))),
    likeCounts,
    reviews: reviewsResult.data || [],
  };
};

export const setProductLike = async ({ userId, productId, liked }) => {
  if (liked) {
    const { error } = await supabase
      .from('product_likes')
      .delete()
      .match({ user_id: userId, product_id: productId });

    if (error) throw enhanceError(error);
    return;
  }

  const { error } = await supabase
    .from('product_likes')
    .insert({ user_id: userId, product_id: productId });

  // 23505 = ya existía; el resultado final es el mismo.
  if (error && error.code !== '23505') throw enhanceError(error);
};

export const setSavedProduct = async ({ userId, productId, saved }) => {
  if (saved) {
    const { error } = await supabase
      .from('saved_products')
      .delete()
      .match({ user_id: userId, product_id: productId });

    if (error) throw enhanceError(error);
    return;
  }

  const { error } = await supabase
    .from('saved_products')
    .insert({ user_id: userId, product_id: productId });

  if (error && error.code !== '23505') throw enhanceError(error);
};

export const upsertProductReview = async ({
  userId,
  productId,
  userName,
  rating,
  comment,
}) => {
  const { data, error } = await supabase
    .from('product_reviews')
    .upsert(
      {
        user_id: userId,
        product_id: productId,
        user_name: userName || 'Cliente',
        rating,
        comment: comment?.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,product_id' }
    )
    .select('*')
    .single();

  if (error) throw enhanceError(error);
  return data;
};

export const deleteProductReview = async ({ userId, productId }) => {
  const { error } = await supabase
    .from('product_reviews')
    .delete()
    .match({ user_id: userId, product_id: productId });

  if (error) throw enhanceError(error);
};
