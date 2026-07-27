-- Row-Level Security: the actual multi-tenant guarantee.
--
-- Everything below is enforced by Postgres itself, independently of any
-- application code. The app connects as `app_user` (see docker/init-roles.sql),
-- a role that owns nothing and has NOBYPASSRLS. Once RLS is enabled on a
-- table, `app_user` can only see/touch rows whose `organization_id` matches
-- the session variable `app.current_org_id` -- no `WHERE organizationId = ...`
-- clause anywhere in application code is doing this; it's a floor underneath
-- all of them.
--
-- The app sets that session variable once per request, inside a transaction,
-- right after authenticating the caller (see src/lib/db.ts::withTenant). A
-- request that never authenticates never sets it, so `current_setting(...)`
-- returns NULL and every policy below evaluates to NULL (i.e. false): no
-- organization_id ever matches NULL, so the default posture is "see nothing",
-- not "see everything."
--
-- Three flows are inherently cross-tenant or pre-tenant (signup, login,
-- invitation acceptance) and cannot run under a tenant-scoped session. Each
-- gets exactly one narrow SECURITY DEFINER function instead of a broad RLS
-- bypass -- see the bottom of this file.

-- gen_random_uuid(), used by the SECURITY DEFINER functions below.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE "organizations"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invitations"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tables"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "menu_categories"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "menu_items"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_items"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "staff_calls"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subscriptions"    ENABLE ROW LEVEL SECURITY;

-- `organizations` is the tenant itself, so it's scoped on `id`, not on an
-- `organization_id` column.
CREATE POLICY tenant_isolation ON "organizations"
  USING (id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_isolation ON "users"
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_isolation ON "invitations"
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_isolation ON "tables"
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_isolation ON "menu_categories"
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_isolation ON "menu_items"
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_isolation ON "orders"
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_isolation ON "order_items"
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_isolation ON "staff_calls"
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_isolation ON "subscriptions"
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

-- ---------------------------------------------------------------------------
-- Narrow escape hatches.
--
-- These three flows are the only places in the whole system where a query
-- legitimately needs to run without (or before) a tenant context. Each is a
-- SECURITY DEFINER function: it executes with the privileges of its owner
-- (`app_migrator`, since that's who runs this migration), and because
-- `app_migrator` owns these tables and none of them have FORCE ROW LEVEL
-- SECURITY set, the owner -- and therefore these functions -- bypass RLS.
-- `app_user` gets EXECUTE on the function only, never direct bypass access
-- to the underlying tables. This keeps the bypass to "exactly this one
-- query, with exactly these arguments" instead of "this role sees
-- everything."
-- ---------------------------------------------------------------------------

-- Signup: creates a brand-new organization plus its first (OWNER) user in
-- one atomic step. There is no tenant context yet -- the organization
-- doesn't exist until this function creates it.
CREATE FUNCTION create_organization_and_owner(
  p_org_name text,
  p_org_slug text,
  p_owner_name text,
  p_owner_email text,
  p_owner_password_hash text,
  p_trial_ends_at timestamptz
) RETURNS TABLE(organization_id uuid, user_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id uuid;
  v_user_id uuid;
BEGIN
  INSERT INTO organizations (id, name, slug, subscription_plan, subscription_status, trial_ends_at, created_at, updated_at)
  VALUES (gen_random_uuid(), p_org_name, p_org_slug, 'trial', 'trialing', p_trial_ends_at, now(), now())
  RETURNING id INTO v_org_id;

  INSERT INTO users (id, organization_id, name, email, password_hash, role, created_at, updated_at)
  VALUES (gen_random_uuid(), v_org_id, p_owner_name, p_owner_email, p_owner_password_hash, 'OWNER', now(), now())
  RETURNING id INTO v_user_id;

  RETURN QUERY SELECT v_org_id, v_user_id;
END;
$$;

-- Login: looks a user up by email before any org context exists (the app
-- doesn't know which organization a caller belongs to until it finds them).
-- Returns only what the login flow needs, nothing else -- it does not read
-- any other table.
CREATE FUNCTION auth_lookup_user(p_email text)
RETURNS TABLE(
  id uuid,
  organization_id uuid,
  role staff_role,
  password_hash text,
  name text,
  is_active boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, organization_id, role, password_hash, name, is_active
  FROM users
  WHERE email = p_email;
$$;

-- Invitation acceptance: the invitee has a token but no session (they aren't
-- staff yet), so there is no organization context to scope a normal insert
-- to. The function itself enforces everything a policy normally would: the
-- token must exist, be unexpired, and unused.
CREATE FUNCTION accept_invitation(
  p_token text,
  p_name text,
  p_password_hash text
) RETURNS TABLE(user_id uuid, organization_id uuid, role staff_role)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation invitations%ROWTYPE;
  v_user_id uuid;
BEGIN
  SELECT * INTO v_invitation
  FROM invitations
  WHERE token = p_token
    AND accepted_at IS NULL
    AND expires_at > now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'invitation_invalid_or_expired';
  END IF;

  INSERT INTO users (id, organization_id, name, email, password_hash, role, created_at, updated_at)
  VALUES (gen_random_uuid(), v_invitation.organization_id, p_name, v_invitation.email, p_password_hash, v_invitation.role, now(), now())
  RETURNING id INTO v_user_id;

  UPDATE invitations SET accepted_at = now() WHERE id = v_invitation.id;

  RETURN QUERY SELECT v_user_id, v_invitation.organization_id, v_invitation.role;
END;
$$;

REVOKE ALL ON FUNCTION create_organization_and_owner(text, text, text, text, text, timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION auth_lookup_user(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION accept_invitation(text, text, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION create_organization_and_owner(text, text, text, text, text, timestamptz) TO app_user;
GRANT EXECUTE ON FUNCTION auth_lookup_user(text) TO app_user;
GRANT EXECUTE ON FUNCTION accept_invitation(text, text, text) TO app_user;
