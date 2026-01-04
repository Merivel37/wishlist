-- Create the restaurants table
create table public.restaurants (
  id uuid not null default gen_random_uuid (),
  name text not null,
  location text null,
  cuisine text null,
  price_range text null, -- '$', '$$', '$$$', '$$$$'
  rating numeric null, -- 1-10 or 1-5
  review text null,
  booking_url text null,
  status text not null default 'wishlist', -- 'wishlist', 'visited', 'favorite'
  tags text[] null,
  image_url text null,
  created_at timestamp with time zone not null default now(),
  user_id uuid null default auth.uid (),
  constraint restaurants_pkey primary key (id)
);

-- Create the recipes table
create table public.recipes (
  id uuid not null default gen_random_uuid (),
  title text not null,
  ingredients jsonb null, -- Structured list of ingredients
  method text null, -- Full text or structured steps
  image_url text null,
  source_url text null,
  rating numeric null,
  difficulty text null, -- 'Easy', 'Medium', 'Hard'
  created_at timestamp with time zone not null default now(),
  user_id uuid null default auth.uid (),
  constraint recipes_pkey primary key (id)
);

-- RLS Policies
alter table public.restaurants enable row level security;
alter table public.recipes enable row level security;

-- Policies for Restaurants
create policy "Enable read access for all users" on public.restaurants for select using (true);
create policy "Enable insert for authenticated users only" on public.restaurants for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on public.restaurants for update using (auth.role() = 'authenticated');
create policy "Enable delete for authenticated users only" on public.restaurants for delete using (auth.role() = 'authenticated');

-- Policies for Recipes
create policy "Enable read access for all users" on public.recipes for select using (true);
create policy "Enable insert for authenticated users only" on public.recipes for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on public.recipes for update using (auth.role() = 'authenticated');
create policy "Enable delete for authenticated users only" on public.recipes for delete using (auth.role() = 'authenticated');
