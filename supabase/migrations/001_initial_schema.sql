-- ============================================================
-- Real Platform — Initial Schema
-- Paste into Supabase SQL Editor and run.
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- ORGANISATIONS
-- One row per agency. The paying entity.
-- ============================================================
create table public.organisations (
  id                      uuid primary key default uuid_generate_v4(),
  name                    text not null,
  trading_as              text,
  licence_no              text,
  licence_holder          text,
  state                   text default 'NSW',
  phone                   text,
  email                   text,
  website                 text,
  logo_url                text,
  -- Stripe
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  plan                    text not null default 'trial',   -- trial | starter | pro
  subscription_status     text not null default 'trialing', -- trialing | active | past_due | canceled
  trial_ends_at           timestamptz default (now() + interval '14 days'),
  -- Timestamps
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.organisations enable row level security;

-- Org members can read their own org
create policy "org_members_read" on public.organisations
  for select using (
    id in (
      select org_id from public.user_profiles where user_id = auth.uid()
    )
  );

-- Super admins can update their own org
create policy "super_admin_update" on public.organisations
  for update using (
    id in (
      select org_id from public.user_profiles
      where user_id = auth.uid() and role = 'super_admin'
    )
  );

-- ============================================================
-- USER PROFILES
-- Extends auth.users. One per user per org.
-- ============================================================
create table public.user_profiles (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  org_id      uuid not null references public.organisations(id) on delete cascade,
  role        text not null default 'agent',  -- super_admin | admin | agent | pm | viewer
  first_name  text,
  last_name   text,
  display_name text generated always as (coalesce(first_name || ' ' || last_name, first_name, last_name, 'Unknown')) stored,
  email       text,
  phone       text,
  avatar_url  text,
  job_title   text,
  licence_no  text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(user_id, org_id)
);

alter table public.user_profiles enable row level security;

-- Users can read profiles in their org
create policy "org_members_read_profiles" on public.user_profiles
  for select using (
    org_id in (
      select org_id from public.user_profiles where user_id = auth.uid()
    )
  );

-- Users can update their own profile
create policy "own_profile_update" on public.user_profiles
  for update using (user_id = auth.uid());

-- Super admins can update any profile in their org
create policy "super_admin_update_profiles" on public.user_profiles
  for update using (
    org_id in (
      select org_id from public.user_profiles
      where user_id = auth.uid() and role in ('super_admin', 'admin')
    )
  );

-- ============================================================
-- INVITATIONS
-- Team member invite tokens
-- ============================================================
create table public.invitations (
  id          uuid primary key default uuid_generate_v4(),
  org_id      uuid not null references public.organisations(id) on delete cascade,
  email       text not null,
  role        text not null default 'agent',
  token       text not null unique default encode(gen_random_bytes(32), 'hex'),
  invited_by  uuid references public.user_profiles(id),
  accepted_at timestamptz,
  expires_at  timestamptz not null default (now() + interval '7 days'),
  created_at  timestamptz not null default now()
);

alter table public.invitations enable row level security;

-- Admins can manage invitations for their org
create policy "admin_manage_invites" on public.invitations
  for all using (
    org_id in (
      select org_id from public.user_profiles
      where user_id = auth.uid() and role in ('super_admin', 'admin')
    )
  );

-- Anyone can read an invite by token (for the accept-invite page — checked in app code)
create policy "read_by_token" on public.invitations
  for select using (true);

-- ============================================================
-- CONTACTS
-- Buyers, sellers, landlords, tenants, leads
-- ============================================================
create table public.contacts (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references public.organisations(id) on delete cascade,
  type          text not null default 'buyer', -- buyer | seller | landlord | tenant | lead | vendor | referrer
  first_name    text not null,
  last_name     text,
  email         text,
  phone         text,
  mobile        text,
  company       text,
  address       text,
  suburb        text,
  state         text,
  postcode      text,
  source        text,  -- referral | website | social | open_home | portal | direct
  status        text not null default 'active',  -- active | inactive | archived
  rating        integer default 0 check (rating between 0 and 5),
  tags          text[] default '{}',
  notes         text,
  assigned_to   uuid references public.user_profiles(id),
  aml_status    text default 'not_started',  -- not_started | pending | verified | flagged | expired
  aml_checked_at timestamptz,
  aml_expiry_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.contacts enable row level security;

create policy "org_members_contacts" on public.contacts
  for all using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

create index contacts_org_id_idx on public.contacts(org_id);
create index contacts_type_idx on public.contacts(org_id, type);
create index contacts_assigned_idx on public.contacts(assigned_to);

-- ============================================================
-- LISTINGS
-- Properties for sale or auction
-- ============================================================
create table public.listings (
  id                      uuid primary key default uuid_generate_v4(),
  org_id                  uuid not null references public.organisations(id) on delete cascade,
  ref                     text,  -- L001, L002 etc — auto-generated in app
  address                 text not null,
  suburb                  text,
  state                   text default 'NSW',
  postcode                text,
  property_type           text default 'house',  -- house | unit | land | commercial | rural
  listing_type            text default 'sale',   -- sale | auction | lease
  price                   numeric(14,2),
  price_display           text,  -- "Price on application" etc
  bedrooms                integer,
  bathrooms               integer,
  car_spaces              integer,
  land_size               numeric(10,2),
  floor_size              numeric(10,2),
  status                  text not null default 'draft',  -- draft | active | under_contract | sold | withdrawn | off_market
  days_on_market          integer generated always as (
    case when status = 'active' then extract(day from now() - listed_at)::integer else null end
  ) stored,
  listed_at               timestamptz,
  sold_at                 timestamptz,
  sold_price              numeric(14,2),
  agent_id                uuid references public.user_profiles(id),
  vendor_id               uuid references public.contacts(id),
  -- Checklist fields
  signed_agency_agreement boolean default false,
  vendor_statement        boolean default false,
  section32               boolean default false,
  marketing_approved      boolean default false,
  photos_uploaded         boolean default false,
  aml_status              text default 'pending',  -- pending | verified | flagged
  -- Portal links
  rea_url                 text,
  domain_url              text,
  -- Meta
  description             text,
  notes                   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.listings enable row level security;

create policy "org_members_listings" on public.listings
  for all using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

create index listings_org_id_idx on public.listings(org_id);
create index listings_status_idx on public.listings(org_id, status);
create index listings_agent_idx on public.listings(agent_id);

-- ============================================================
-- PM PROPERTIES
-- Property management portfolio
-- ============================================================
create table public.pm_properties (
  id                      uuid primary key default uuid_generate_v4(),
  org_id                  uuid not null references public.organisations(id) on delete cascade,
  address                 text not null,
  suburb                  text,
  state                   text default 'NSW',
  postcode                text,
  property_type           text default 'house',
  status                  text not null default 'leased',  -- leased | vacant | notice_given | periodic
  landlord_id             uuid references public.contacts(id),
  tenant_id               uuid references public.contacts(id),
  property_manager_id     uuid references public.user_profiles(id),
  weekly_rent             numeric(10,2),
  lease_start             date,
  lease_end               date,
  next_inspection         date,
  smoke_alarm_date        date,
  pool_compliance_date    date,
  gas_compliance_date     date,
  electrical_safety_date  date,
  water_efficiency_date   date,
  rent_in_arrears         boolean default false,
  maintenance_open        integer default 0,
  aml_status              text default 'pending',
  checklist_pct           integer default 0,
  notes                   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.pm_properties enable row level security;

create policy "org_members_pm_properties" on public.pm_properties
  for all using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

-- ============================================================
-- PIPELINE DEALS
-- Sales pipeline (CRM deals)
-- ============================================================
create table public.pipeline_deals (
  id              uuid primary key default uuid_generate_v4(),
  org_id          uuid not null references public.organisations(id) on delete cascade,
  title           text not null,
  stage           text not null default 'lead',  -- lead | qualified | proposal | negotiation | won | lost
  value           numeric(14,2),
  probability     integer default 20 check (probability between 0 and 100),
  contact_id      uuid references public.contacts(id),
  listing_id      uuid references public.listings(id),
  assigned_to     uuid references public.user_profiles(id),
  source          text,
  expected_close  date,
  closed_at       timestamptz,
  lost_reason     text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.pipeline_deals enable row level security;

create policy "org_members_pipeline" on public.pipeline_deals
  for all using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

create index pipeline_org_stage_idx on public.pipeline_deals(org_id, stage);

-- ============================================================
-- TASKS
-- ============================================================
create table public.tasks (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references public.organisations(id) on delete cascade,
  title         text not null,
  description   text,
  status        text not null default 'todo',  -- todo | in_progress | done | cancelled
  priority      text not null default 'medium',  -- low | medium | high | urgent
  due_date      timestamptz,
  completed_at  timestamptz,
  assigned_to   uuid references public.user_profiles(id),
  created_by    uuid references public.user_profiles(id),
  -- Optional links
  contact_id    uuid references public.contacts(id),
  listing_id    uuid references public.listings(id),
  deal_id       uuid references public.pipeline_deals(id),
  pm_property_id uuid references public.pm_properties(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "org_members_tasks" on public.tasks
  for all using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

create index tasks_org_assigned_idx on public.tasks(org_id, assigned_to);
create index tasks_org_status_idx on public.tasks(org_id, status);

-- ============================================================
-- OPEN HOMES
-- ============================================================
create table public.open_homes (
  id              uuid primary key default uuid_generate_v4(),
  org_id          uuid not null references public.organisations(id) on delete cascade,
  listing_id      uuid references public.listings(id),
  address         text not null,
  suburb          text,
  scheduled_at    timestamptz not null,
  ends_at         timestamptz,
  agent_id        uuid references public.user_profiles(id),
  status          text not null default 'scheduled',  -- scheduled | completed | cancelled
  attendee_count  integer default 0,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.open_homes enable row level security;

create policy "org_members_open_homes" on public.open_homes
  for all using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

-- ============================================================
-- OPEN HOME ATTENDEES
-- ============================================================
create table public.open_home_attendees (
  id              uuid primary key default uuid_generate_v4(),
  org_id          uuid not null references public.organisations(id) on delete cascade,
  open_home_id    uuid not null references public.open_homes(id) on delete cascade,
  contact_id      uuid references public.contacts(id),
  -- If not an existing contact yet
  first_name      text,
  last_name       text,
  email           text,
  phone           text,
  is_buying       boolean,
  finance_approved boolean,
  looking_to_sell boolean,
  notes           text,
  checked_in_at   timestamptz default now(),
  created_at      timestamptz not null default now()
);

alter table public.open_home_attendees enable row level security;

create policy "org_members_attendees" on public.open_home_attendees
  for all using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

-- ============================================================
-- ENQUIRIES
-- Inbound enquiries from portals, website, etc.
-- ============================================================
create table public.enquiries (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references public.organisations(id) on delete cascade,
  contact_id    uuid references public.contacts(id),
  listing_id    uuid references public.listings(id),
  source        text,  -- rea | domain | website | social | referral | walk_in
  message       text,
  status        text not null default 'new',  -- new | contacted | qualified | converted | archived
  assigned_to   uuid references public.user_profiles(id),
  responded_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.enquiries enable row level security;

create policy "org_members_enquiries" on public.enquiries
  for all using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

create index enquiries_org_status_idx on public.enquiries(org_id, status);

-- ============================================================
-- ACTIVITIES
-- Audit trail / activity feed
-- ============================================================
create table public.activities (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references public.organisations(id) on delete cascade,
  user_id       uuid references public.user_profiles(id),
  type          text not null,  -- listing_created | contact_added | aml_verified | task_completed | etc.
  title         text not null,
  description   text,
  -- Optional links
  contact_id    uuid references public.contacts(id),
  listing_id    uuid references public.listings(id),
  deal_id       uuid references public.pipeline_deals(id),
  task_id       uuid references public.tasks(id),
  metadata      jsonb default '{}',
  created_at    timestamptz not null default now()
);

alter table public.activities enable row level security;

create policy "org_members_activities" on public.activities
  for select using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

create policy "org_members_insert_activities" on public.activities
  for insert with check (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

create index activities_org_created_idx on public.activities(org_id, created_at desc);

-- ============================================================
-- AML CHECKS
-- ============================================================
create table public.aml_checks (
  id                uuid primary key default uuid_generate_v4(),
  org_id            uuid not null references public.organisations(id) on delete cascade,
  contact_id        uuid not null references public.contacts(id) on delete cascade,
  listing_id        uuid references public.listings(id),
  pm_property_id    uuid references public.pm_properties(id),
  role              text,  -- buyer | seller | landlord | tenant
  id_type           text,
  pep_check         boolean default false,
  sanctions_check   boolean default false,
  source_of_funds   boolean default false,
  status            text not null default 'pending',  -- pending | verified | flagged | expired
  risk_rating       text default 'low',  -- low | medium | high
  checked_by        uuid references public.user_profiles(id),
  checked_at        timestamptz,
  expiry_date       date,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.aml_checks enable row level security;

create policy "org_members_aml" on public.aml_checks
  for all using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

-- ============================================================
-- TRUST ACCOUNTING
-- ============================================================
create table public.trust_entries (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references public.organisations(id) on delete cascade,
  date          date not null,
  description   text not null,
  reference     text,
  type          text not null,  -- deposit | disbursement | transfer
  amount        numeric(14,2) not null,
  property      text,
  listing_id    uuid references public.listings(id),
  pm_property_id uuid references public.pm_properties(id),
  status        text not null default 'pending',  -- pending | cleared | reconciled
  created_by    uuid references public.user_profiles(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.trust_entries enable row level security;

create policy "org_members_trust" on public.trust_entries
  for all using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

create index trust_entries_org_date_idx on public.trust_entries(org_id, date desc);

-- ============================================================
-- LICENCES & CPD
-- ============================================================
create table public.licences (
  id                    uuid primary key default uuid_generate_v4(),
  org_id                uuid not null references public.organisations(id) on delete cascade,
  user_profile_id       uuid references public.user_profiles(id),
  name                  text not null,
  role                  text,
  licence_type          text,  -- 'Real Estate Agent' | 'Certificate of Registration' | etc.
  licence_no            text,
  issuer                text default 'NSW Fair Trading',
  expiry_date           date,
  status                text not null default 'active',  -- active | expiring_soon | expired | suspended
  cpd_hours_completed   integer default 0,
  cpd_hours_required    integer default 16,
  cpd_due_date          date,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.licences enable row level security;

create policy "org_members_licences" on public.licences
  for all using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

-- ============================================================
-- POLICIES
-- Company policies & procedures
-- ============================================================
create table public.policies (
  id                    uuid primary key default uuid_generate_v4(),
  org_id                uuid not null references public.organisations(id) on delete cascade,
  title                 text not null,
  category              text,
  version               text default '1.0',
  content               text,
  document_url          text,
  last_reviewed         date,
  next_review           date,
  owner_id              uuid references public.user_profiles(id),
  status                text not null default 'draft',  -- draft | current | under_review | overdue_review
  total_staff           integer default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.policies enable row level security;

create policy "org_members_policies" on public.policies
  for all using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

-- Policy acknowledgements (many-to-many)
create table public.policy_acknowledgements (
  id              uuid primary key default uuid_generate_v4(),
  org_id          uuid not null references public.organisations(id) on delete cascade,
  policy_id       uuid not null references public.policies(id) on delete cascade,
  user_profile_id uuid not null references public.user_profiles(id) on delete cascade,
  acknowledged_at timestamptz not null default now(),
  unique(policy_id, user_profile_id)
);

alter table public.policy_acknowledgements enable row level security;

create policy "org_members_policy_acks" on public.policy_acknowledgements
  for all using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

-- ============================================================
-- INTEGRATIONS
-- Connected third-party services
-- ============================================================
create table public.integrations (
  id            uuid primary key default uuid_generate_v4(),
  org_id        uuid not null references public.organisations(id) on delete cascade,
  service       text not null,  -- rea | domain | facebook | instagram | xero | docusign | etc.
  status        text not null default 'disconnected',  -- connected | disconnected | error
  access_token  text,  -- store encrypted in production
  refresh_token text,
  token_expiry  timestamptz,
  config        jsonb default '{}',
  connected_by  uuid references public.user_profiles(id),
  connected_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique(org_id, service)
);

alter table public.integrations enable row level security;

create policy "org_admins_integrations" on public.integrations
  for all using (
    org_id in (
      select org_id from public.user_profiles
      where user_id = auth.uid() and role in ('super_admin', 'admin')
    )
  );

create policy "org_members_read_integrations" on public.integrations
  for select using (
    org_id in (select org_id from public.user_profiles where user_id = auth.uid())
  );

-- ============================================================
-- UPDATED_AT TRIGGER
-- Auto-update updated_at on every table that has it
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.organisations
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.user_profiles
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.contacts
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.listings
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.pm_properties
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.pipeline_deals
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.tasks
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.open_homes
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.enquiries
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.aml_checks
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.trust_entries
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.licences
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.policies
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.integrations
  for each row execute function public.handle_updated_at();

-- ============================================================
-- NEW USER HANDLER
-- When a user signs up, check if they have a pending invitation.
-- If yes → join that org. If no → they'll complete onboarding (create org).
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_invite        public.invitations%rowtype;
  v_org_id        uuid;
begin
  -- Check for a valid invitation matching this email
  select * into v_invite
  from public.invitations
  where email = new.email
    and accepted_at is null
    and expires_at > now()
  order by created_at desc
  limit 1;

  if found then
    -- Mark invitation accepted
    update public.invitations
    set accepted_at = now()
    where id = v_invite.id;

    -- Create user profile in the invited org
    insert into public.user_profiles (user_id, org_id, role, email, first_name, last_name)
    values (
      new.id,
      v_invite.org_id,
      v_invite.role,
      new.email,
      new.raw_user_meta_data->>'first_name',
      new.raw_user_meta_data->>'last_name'
    );
  end if;

  -- Note: if no invite found, user goes through /signup to create an org.
  -- The /signup API route will call handle_new_org() after payment.

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- HELPER: create_organisation_for_user
-- Called from /signup after Stripe checkout.
-- Creates the org and links the super_admin profile.
-- ============================================================
create or replace function public.create_organisation_for_user(
  p_user_id         uuid,
  p_org_name        text,
  p_first_name      text default null,
  p_last_name       text default null,
  p_phone           text default null,
  p_stripe_customer text default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_org_id  uuid;
  v_email   text;
begin
  -- Get email from auth.users
  select email into v_email from auth.users where id = p_user_id;

  -- Create the organisation
  insert into public.organisations (name, stripe_customer_id, phone, email)
  values (p_org_name, p_stripe_customer, p_phone, v_email)
  returning id into v_org_id;

  -- Create the super_admin profile
  insert into public.user_profiles (user_id, org_id, role, email, first_name, last_name, phone)
  values (p_user_id, v_org_id, 'super_admin', v_email, p_first_name, p_last_name, p_phone)
  on conflict (user_id, org_id) do update
    set role = 'super_admin',
        first_name = coalesce(p_first_name, user_profiles.first_name),
        last_name  = coalesce(p_last_name,  user_profiles.last_name);

  return v_org_id;
end;
$$;

-- ============================================================
-- HELPER: get_my_org_id
-- Convenience function for RLS policies
-- ============================================================
create or replace function public.get_my_org_id()
returns uuid language sql security definer as $$
  select org_id from public.user_profiles where user_id = auth.uid() limit 1;
$$;
