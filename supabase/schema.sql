-- Run this once in your Supabase project's SQL editor
-- (Project → SQL Editor → New query → paste → Run).

create extension if not exists "pgcrypto";

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- sender = the person paying / placing the order
  sender_name text not null,
  sender_phone text not null,
  sender_email text,

  -- receiver = who the flowers are for (can be the same person)
  receiver_name text not null,
  receiver_phone text not null,
  receiver_email text,

  city text not null,
  address text not null,
  landmark text,
  delivery_date date,
  order_note text,

  items jsonb not null,          -- [{ id, name, price, quantity, note }]
  subtotal numeric not null,
  delivery_charge numeric not null default 200,
  total numeric not null,

  payment_method text not null default 'esewa',  -- 'esewa' | 'fonepay'
  status text not null default 'pending_payment', -- pending_payment | paid | fulfilled | cancelled
  transaction_uuid text unique,
  emailed boolean not null default false
);

-- Row Level Security is enabled with NO policies, meaning the anon/public
-- key cannot read or write this table at all. Every access goes through
-- Next.js API routes using the SERVICE ROLE key, which bypasses RLS and
-- is never exposed to the browser. This keeps orders private without
-- needing a complex policy setup.
alter table orders enable row level security;

create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists orders_status_idx on orders (status);
