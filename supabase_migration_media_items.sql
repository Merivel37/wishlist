-- Create the media_items table
create table public.media_items (
  id uuid not null default gen_random_uuid (),
  title text null,
  type text null, -- 'book', 'movie', 'tv'
  status text null, -- 'queued', 'reading', 'watching', 'finished'
  url text null,
  image text null,
  tags text[] null,
  rating numeric null,
  review text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  user_id uuid null default auth.uid (),
  constraint media_items_pkey primary key (id)
);

-- Turn on Row Level Security
alter table public.media_items enable row level security;

-- Allow read access to everyone (public wishlist style) or authenticated only?
-- Assuming public read, private write based on current Wishlist behavior.
create policy "Enable read access for all users" on public.media_items
  for select using (true);

create policy "Enable insert for authenticated users only" on public.media_items
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for users based on email" on public.media_items
  for update using (auth.role() = 'authenticated');

create policy "Enable delete for users based on email" on public.media_items
  for delete using (auth.role() = 'authenticated');
