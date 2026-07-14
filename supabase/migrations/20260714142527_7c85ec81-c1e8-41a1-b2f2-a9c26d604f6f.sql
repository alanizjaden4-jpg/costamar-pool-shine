ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS preferred_contact text,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS hubspot_contact_id text,
  ADD COLUMN IF NOT EXISTS crm_synced boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS crm_error text;