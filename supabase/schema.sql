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
  id text primary key, -- Changed to text to support slugs like 'zabal'
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
  id text primary key, -- Changed to text to support slugs like 'zabal-midnight-black-M'
  product_id text references public.products(id) on delete cascade,
  size text not null,
  color text not null,
  color_hex text default '#000000',
  stock_quantity integer default 0,
  price_modifier numeric(10,2) default 0,
  sku text unique,
  created_at timestamptz default now()
);

-- Coupons
create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text default 'fixed' check (discount_type in ('fixed', 'percentage', 'free_hoodie')),
  discount_value numeric(10,2) default 0,
  shipping_fee numeric(10,2) default 0,
  max_uses integer default 100,
  times_used integer default 0,
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  reference text unique,
  status text default 'pending'
    check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  total_amount numeric(10,2) not null,
  currency text default 'USDC',
  tx_hash text,
  wallet_address text,
  fid bigint,
  
  -- Coupon info
  coupon_code text,
  coupon_discount numeric(10,2) default 0,
  
  -- Customization
  front_text text,
  back_text text,
  chest_logo_url text,
  
  -- Shipping
  shipping_name text,
  shipping_email text,
  shipping_phone text,
  shipping_address text,
  shipping_city text,
  shipping_state text,
  shipping_country text,
  
  tracking_number text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id text references public.products(id),
  variant_id text references public.product_variants(id),
  quantity integer not null,
  unit_price numeric(10,2) not null,
  created_at timestamptz default now()
);

-- Coupon uses
create table public.coupon_uses (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid references public.coupons(id),
  order_id uuid references public.orders(id),
  wallet_address text,
  created_at timestamptz default now()
);

-- RPC: Decrement Stock
create or replace function public.decrement_stock(p_variant_id text, p_qty integer)
returns void as $$
begin
  update public.product_variants
  set stock_quantity = stock_quantity - p_qty
  where id = p_variant_id;
end;
$$ language plpgsql;

-- RPC: Increment Coupon Uses
create or replace function public.increment_coupon_uses(p_coupon_id uuid)
returns void as $$
begin
  update public.coupons
  set times_used = times_used + 1
  where id = p_coupon_id;
end;
$$ language plpgsql;

-- RLS
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.coupon_uses enable row level security;

-- Policies
create policy "users_read_own" on public.users for select using (auth.uid() = id);
create policy "users_insert" on public.users for insert with check (true);
create policy "products_public_read" on public.products for select using (is_active = true);
create policy "variants_public_read" on public.product_variants for select using (true);
create policy "coupons_public_read" on public.coupons for select using (is_active = true);
create policy "orders_insert" on public.orders for insert with check (true);
create policy "order_items_insert" on public.order_items for insert with check (true);
create policy "coupon_uses_insert" on public.coupon_uses for insert with check (true);

-- Indexes
create index on public.products(is_active);
create index on public.product_variants(product_id);
create index on public.orders(wallet_address, status);
create index on public.orders(reference);
