-- Товары, заказы, позиции — магазин «Территория любви»
-- Расширения
create extension if not exists "pgcrypto";

-- Товары
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price decimal(10, 2) not null,
  category text,
  image_url text,
  in_stock boolean default true,
  created_at timestamptz default now()
);

-- Заказы
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  delivery_address jsonb,
  delivery_method text not null,
  delivery_cost decimal(10, 2) default 0,
  total_amount decimal(10, 2) not null,
  status text default 'pending',
  discreet_packaging boolean default true,
  customer_comment text,
  pickup_point_label text,
  created_at timestamptz default now()
);

-- Состав заказа
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id),
  quantity integer not null check (quantity > 0),
  price_at_time decimal(10, 2) not null
);

create index order_items_order_id_idx on public.order_items (order_id);
create index orders_user_id_idx on public.orders (user_id);
create index orders_order_number_idx on public.orders (order_number);

-- RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Каталог доступен всем
create policy "products_select_public"
  on public.products for select
  using (true);

-- Свои заказы (авторизованные)
create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() is not null and auth.uid() = user_id);

create policy "order_items_select_own"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

-- Вставка заказов с клиента не используется — только service role через серверные действия

-- Seed: демо-товары (нейтральные названия)
insert into public.products (name, description, price, category, image_url, in_stock) values
  ('Набор «Нежность»', 'Подарочный набор для двоих', 3490.00, 'Наборы', '/images/shop/placeholder.svg', true),
  ('Массажное масло', 'С натуральными маслами, без запаха', 1290.00, 'Уход', '/images/shop/placeholder.svg', true),
  ('Интимная гигиена', 'pH-баланс, деликатная формула', 890.00, 'Уход', '/images/shop/placeholder.svg', true),
  ('Игрушка-классика', 'Бесшумный мотор, несколько режимов', 2490.00, 'Игрушки', '/images/shop/placeholder.svg', true),
  ('Презервативы премиум', 'Набор 12 шт.', 590.00, 'Здоровье', '/images/shop/placeholder.svg', true),
  ('Лубрикант на водной основе', 'Гипоаллергенный, 100 мл', 790.00, 'Уход', '/images/shop/placeholder.svg', true);
