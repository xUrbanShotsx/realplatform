-- Add metadata jsonb column to contacts for rich CRM fields
-- (family, commStyle, lifeEvent, aiMemory, properties, score, timeline)
alter table public.contacts
  add column if not exists metadata jsonb default '{}';

-- Add metadata jsonb column to listings for AI suggestions and buyer interest data
alter table public.listings
  add column if not exists metadata jsonb default '{}';

-- Add metadata jsonb column to tasks for extra context
alter table public.tasks
  add column if not exists metadata jsonb default '{}';
