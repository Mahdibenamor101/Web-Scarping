-- White-label: an owner can upload their own logo and a background image
-- for the public menu (/menu/[qrToken]) so a scanning customer lands on
-- something that reads as "this restaurant's site," not "a third-party
-- product." `logo_url` already existed in the schema since Phase 0 but was
-- never wired up; `background_url` is new. Both nullable -- most
-- restaurants will never set either, and the public menu page already has
-- a sensible unbranded default (see src/app/menu/[qrToken]/page.tsx).
ALTER TABLE "organizations" ADD COLUMN "background_url" TEXT;

-- resolve_table_by_qr_token (see *_public_ordering) needs to hand back the
-- branding fields too: the public menu page has no session, so this
-- SECURITY DEFINER lookup is the only way it can know an org's logo/
-- background, same as it already does for organization_name.
-- Postgres won't let CREATE OR REPLACE change a function's return type
-- (RETURNS TABLE gained two columns here), so the old signature has to go
-- first.
DROP FUNCTION resolve_table_by_qr_token(text);

CREATE FUNCTION resolve_table_by_qr_token(p_qr_token text)
RETURNS TABLE(
  table_id uuid,
  organization_id uuid,
  table_label text,
  organization_name text,
  default_language text,
  logo_url text,
  background_url text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT t.id, t.organization_id, t.label, o.name, o.default_language, o.logo_url, o.background_url
  FROM tables t
  JOIN organizations o ON o.id = t.organization_id
  WHERE t.qr_token = p_qr_token;
$$;

REVOKE ALL ON FUNCTION resolve_table_by_qr_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION resolve_table_by_qr_token(text) TO app_user;
