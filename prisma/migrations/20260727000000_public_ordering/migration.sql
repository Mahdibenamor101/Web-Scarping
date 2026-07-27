-- Public ordering: the QR code on a physical table encodes only its
-- `qr_token`. A customer's browser has no session and no organization
-- context -- the same category of problem as signup/login/invite
-- acceptance (see the first RLS migration), solved the same way: one
-- narrow SECURITY DEFINER lookup to resolve which tenant we're even
-- talking about.
--
-- That's the *only* new bypass this migration adds. Once organization_id
-- is known, reading the menu and inserting the order are ordinary
-- RLS-scoped operations through withTenant() like any staff-side write --
-- see src/app/api/public/*. There is no SECURITY DEFINER function for
-- placing an order: RLS's WITH CHECK already guarantees an order can only
-- be inserted into the organization that owns the resolved table.
CREATE FUNCTION resolve_table_by_qr_token(p_qr_token text)
RETURNS TABLE(
  table_id uuid,
  organization_id uuid,
  table_label text,
  organization_name text,
  default_language text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT t.id, t.organization_id, t.label, o.name, o.default_language
  FROM tables t
  JOIN organizations o ON o.id = t.organization_id
  WHERE t.qr_token = p_qr_token;
$$;

REVOKE ALL ON FUNCTION resolve_table_by_qr_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION resolve_table_by_qr_token(text) TO app_user;
