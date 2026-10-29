-- ============================================================
-- Funciones de clientes: me gusta, guardados y reseñas
-- Ejecutar una sola vez en el SQL Editor de Supabase.
-- ============================================================

-- 1. Me gusta de productos -----------------------------------
create table if not exists public.product_likes (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id bigint not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create index if not exists product_likes_product_id_idx
  on public.product_likes (product_id);

-- 2. Productos guardados -------------------------------------
create table if not exists public.saved_products (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id bigint not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create index if not exists saved_products_user_id_idx
  on public.saved_products (user_id);

-- 3. Reseñas con estrellas -----------------------------------
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id bigint not null,
  user_name text not null default 'Cliente',
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists product_reviews_product_id_idx
  on public.product_reviews (product_id, created_at desc);

-- Mantiene updated_at al día cuando el cliente edita su reseña
create or replace function public.set_product_reviews_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists product_reviews_touch_updated_at on public.product_reviews;

create trigger product_reviews_touch_updated_at
  before update on public.product_reviews
  for each row
  execute function public.set_product_reviews_updated_at();

-- 4. Seguridad por filas (RLS) -------------------------------
alter table public.product_likes enable row level security;
alter table public.saved_products enable row level security;
alter table public.product_reviews enable row level security;

-- Me gusta: los conteos son públicos, solo el dueño puede dar/quitar.
drop policy if exists "Likes are publicly readable" on public.product_likes;
create policy "Likes are publicly readable"
  on public.product_likes for select
  using (true);

drop policy if exists "Users can like products" on public.product_likes;
create policy "Users can like products"
  on public.product_likes for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can remove their likes" on public.product_likes;
create policy "Users can remove their likes"
  on public.product_likes for delete
  to authenticated
  using (auth.uid() = user_id);

-- Guardados: cada cliente solo ve y administra los suyos.
drop policy if exists "Users can read their saved products" on public.saved_products;
create policy "Users can read their saved products"
  on public.saved_products for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can save products" on public.saved_products;
create policy "Users can save products"
  on public.saved_products for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can remove their saved products" on public.saved_products;
create policy "Users can remove their saved products"
  on public.saved_products for delete
  to authenticated
  using (auth.uid() = user_id);

-- Reseñas: lectura pública, escritura solo del autor.
drop policy if exists "Reviews are publicly readable" on public.product_reviews;
create policy "Reviews are publicly readable"
  on public.product_reviews for select
  using (true);

drop policy if exists "Users can create their own review" on public.product_reviews;
create policy "Users can create their own review"
  on public.product_reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own review" on public.product_reviews;
create policy "Users can update their own review"
  on public.product_reviews for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own review" on public.product_reviews;
create policy "Users can delete their own review"
  on public.product_reviews for delete
  to authenticated
  using (auth.uid() = user_id);

-- 5. Permisos de API -----------------------------------------
grant select on public.product_likes to anon, authenticated;
grant insert, delete on public.product_likes to authenticated;

grant select, insert, delete on public.saved_products to authenticated;

grant select on public.product_reviews to anon, authenticated;
grant insert, update, delete on public.product_reviews to authenticated;
