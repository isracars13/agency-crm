
-- Run in Supabase SQL Editor
alter table clients add column if not exists address text;
alter table clients add column if not exists lat double precision;
alter table clients add column if not exists lng double precision;
