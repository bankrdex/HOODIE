-- Users
create table public.users (
  id uuid primary key default gen_random_uuid(),
  fid bigint unique,
  username text,
  display_name text,
  avatar_url text,
  wallet_address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  base_price numeric(10,2) not null,
  images text[] default '{}',
  category text default 'hoodie',
  is_active boolean default true,
  is_drop boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product variants
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  size text not null,
  color text not null,
  color_hex text default '#000000',
  stock_quantity integer default 0,
  price_modifier numeric(10,2) default 0,
  sku text unique,
  created_at timestamptz default now()
);

-- Drops
create table public.drops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  product_id uuid references public.products(id),
  drop_date timestamptz not null,
  end_date timestamptz,
  total_units integer not null,
  units_sold integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Custom designs
create table public.designs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  name text,
  canvas_data jsonb not null default '{}',
  preview_url text,
  product_id uuid references public.products(id),
  variant_id uuid references public.product_variants(id),
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  status text default 'pending'
    check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  total_amount numeric(10,2) not null,
  currency text default 'USDC',
  tx_hash text,
  wallet_address text,
  shipping_address jsonb,
  tracking_number text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  variant_id uuid references public.product_variants(id),
  design_id uuid references public.designs(id),
  quantity integer not null,
  unit_price numeric(10,2) not null,
  created_at timestamptz default now()
);

-- RLS
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.drops enable row level security;
alter table public.designs enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Users
create policy "users_read_own" on public.users for select using (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);
create policy "users_insert" on public.users for insert with check (true);

-- Products (public read)
create policy "products_public_read" on public.products for select using (is_active = true);

-- Variants (public read)
create policy "variants_public_read" on public.product_variants for select using (true);

-- Drops (public read)
create policy "drops_public_read" on public.drops for select using (is_active = true);

-- Designs
create policy "designs_read" on public.designs
  for select using (auth.uid() = user_id or is_public = true);
create policy "designs_insert" on public.designs
  for insert with check (auth.uid() = user_id);
create policy "designs_update" on public.designs
  for update using (auth.uid() = user_id);

-- Orders
create policy "orders_read_own" on public.orders
  for select using (auth.uid() = user_id);
create policy "orders_insert" on public.orders
  for insert with check (auth.uid() = user_id);

-- Order items
create policy "order_items_read_own" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Indexes
create index on public.products(is_active);
create index on public.product_variants(product_id);
create index on public.orders(user_id, status);
create index on public.designs(user_id);
create index on public.drops(drop_date, is_active);

-- Storage buckets
insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('design-previews', 'design-previews', true),
  ('user-uploads', 'user-uploads', false)
on conflict (id) do nothing;

create policy "product_images_read" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "design_previews_read" on storage.objects
  for select using (bucket_id = 'design-previews');

create policy "auth_users_upload" on storage.objects
  for insert with check (
    bucket_id in ('design-previews', 'user-uploads')
    and auth.uid() is not null
  );
