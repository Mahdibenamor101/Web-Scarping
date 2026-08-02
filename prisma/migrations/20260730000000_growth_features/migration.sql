-- Growth feature wave (30 juillet 2026, see CONTEXT.md): Google/Apple
-- sign-in, email verification, extra QR/ordering modes (counter, pickup,
-- display-only), restaurant analytics, automatic menu translation, and
-- customer online payment. One consolidated migration rather than one per
-- feature, since several of these share the same new tenant tables.

-- ---------------------------------------------------------------------------
-- New enums
-- ---------------------------------------------------------------------------

CREATE TYPE "ordering_mode" AS ENUM ('TABLE', 'COUNTER', 'PICKUP', 'DISPLAY_ONLY');
CREATE TYPE "oauth_provider" AS ENUM ('GOOGLE', 'APPLE');
CREATE TYPE "payment_status" AS ENUM ('UNPAID', 'PAID');

-- ---------------------------------------------------------------------------
-- users: nullable password (OAuth-only accounts never set one) + verification
-- ---------------------------------------------------------------------------

ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;
ALTER TABLE "users" ADD COLUMN "email_verified_at" timestamptz;

-- ---------------------------------------------------------------------------
-- tables: which ordering mode this QR/link uses
-- ---------------------------------------------------------------------------

ALTER TABLE "tables" ADD COLUMN "ordering_mode" "ordering_mode" NOT NULL DEFAULT 'TABLE';

-- ---------------------------------------------------------------------------
-- orders: mode snapshot, pickup name, sequential order number, payment
-- ---------------------------------------------------------------------------

ALTER TABLE "orders" ADD COLUMN "ordering_mode" "ordering_mode" NOT NULL DEFAULT 'TABLE';
ALTER TABLE "orders" ADD COLUMN "pickup_name" text;
ALTER TABLE "orders" ADD COLUMN "order_number" SERIAL;
ALTER TABLE "orders" ADD COLUMN "payment_status" "payment_status" NOT NULL DEFAULT 'UNPAID';
ALTER TABLE "orders" ADD COLUMN "stripe_checkout_session_id" text;
ALTER TABLE "orders" ADD CONSTRAINT "orders_stripe_checkout_session_id_key" UNIQUE ("stripe_checkout_session_id");

-- ---------------------------------------------------------------------------
-- New tenant tables
-- ---------------------------------------------------------------------------

CREATE TABLE "oauth_accounts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "organization_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "provider" "oauth_provider" NOT NULL,
  "provider_account_id" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("provider", "provider_account_id")
);
CREATE INDEX "oauth_accounts_organization_id_idx" ON "oauth_accounts" ("organization_id");
CREATE INDEX "oauth_accounts_user_id_idx" ON "oauth_accounts" ("user_id");

CREATE TABLE "email_verification_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "organization_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token" text NOT NULL UNIQUE,
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "email_verification_tokens_organization_id_idx" ON "email_verification_tokens" ("organization_id");
CREATE INDEX "email_verification_tokens_user_id_idx" ON "email_verification_tokens" ("user_id");

CREATE TABLE "menu_item_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "organization_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "menu_item_id" uuid NOT NULL,
  "language_code" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("menu_item_id", "language_code"),
  FOREIGN KEY ("menu_item_id", "organization_id") REFERENCES "menu_items" ("id", "organization_id") ON DELETE CASCADE
);
CREATE INDEX "menu_item_translations_organization_id_idx" ON "menu_item_translations" ("organization_id");

CREATE TABLE "menu_views" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "organization_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "table_id" uuid,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY ("table_id", "organization_id") REFERENCES "tables" ("id", "organization_id") ON DELETE SET NULL
);
CREATE INDEX "menu_views_organization_id_created_at_idx" ON "menu_views" ("organization_id", "created_at");

-- ---------------------------------------------------------------------------
-- RLS: same tenant_isolation policy shape as every other tenant table (see
-- the original row_level_security migration for the full rationale).
-- ---------------------------------------------------------------------------

ALTER TABLE "oauth_accounts"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "email_verification_tokens" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "menu_item_translations"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "menu_views"               ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON "oauth_accounts"
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_isolation ON "email_verification_tokens"
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_isolation ON "menu_item_translations"
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_isolation ON "menu_views"
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

-- ---------------------------------------------------------------------------
-- SECURITY DEFINER functions: two more pre-tenant-context flows, same
-- narrow-escape-hatch reasoning as create_organization_and_owner /
-- auth_lookup_user / accept_invitation in the original RLS migration.
-- ---------------------------------------------------------------------------

-- OAuth sign-in (Google or Apple), one function covering all three
-- outcomes atomically: (1) already linked -> just return the user, (2) an
-- existing password account shares this email -> link the new identity to
-- it (account linking, e.g. an owner who signed up with a password later
-- clicking "Sign in with Google"), (3) brand new -> create an organization
-- + OWNER user exactly like create_organization_and_owner, then link.
-- Email is trusted as already-verified in cases 2 and 3 because the OAuth
-- provider vouches for it, not this app.
CREATE FUNCTION oauth_authenticate(
  p_provider oauth_provider,
  p_provider_account_id text,
  p_email text,
  p_name text,
  p_org_name text,
  p_org_slug text,
  p_trial_ends_at timestamptz
) RETURNS TABLE(user_id uuid, organization_id uuid, role staff_role, name text, is_new_user boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user users%ROWTYPE;
  v_org_id uuid;
  v_user_id uuid;
BEGIN
  SELECT u.* INTO v_user
  FROM oauth_accounts oa
  JOIN users u ON u.id = oa.user_id
  WHERE oa.provider = p_provider AND oa.provider_account_id = p_provider_account_id;

  IF FOUND THEN
    RETURN QUERY SELECT v_user.id, v_user.organization_id, v_user.role, v_user.name, false;
    RETURN;
  END IF;

  SELECT * INTO v_user FROM users WHERE email = p_email;

  IF FOUND THEN
    INSERT INTO oauth_accounts (id, organization_id, user_id, provider, provider_account_id, created_at)
    VALUES (gen_random_uuid(), v_user.organization_id, v_user.id, p_provider, p_provider_account_id, now());

    UPDATE users SET email_verified_at = COALESCE(email_verified_at, now()) WHERE id = v_user.id;

    RETURN QUERY SELECT v_user.id, v_user.organization_id, v_user.role, v_user.name, false;
    RETURN;
  END IF;

  INSERT INTO organizations (id, name, slug, subscription_plan, subscription_status, trial_ends_at, created_at, updated_at)
  VALUES (gen_random_uuid(), p_org_name, p_org_slug, 'trial', 'trialing', p_trial_ends_at, now(), now())
  RETURNING id INTO v_org_id;

  INSERT INTO users (id, organization_id, name, email, password_hash, role, email_verified_at, created_at, updated_at)
  VALUES (gen_random_uuid(), v_org_id, p_name, p_email, NULL, 'OWNER', now(), now(), now())
  RETURNING id INTO v_user_id;

  INSERT INTO oauth_accounts (id, organization_id, user_id, provider, provider_account_id, created_at)
  VALUES (gen_random_uuid(), v_org_id, v_user_id, p_provider, p_provider_account_id, now());

  RETURN QUERY SELECT v_user_id, v_org_id, 'OWNER'::staff_role, p_name, true;
END;
$$;

-- Email verification: consumes a token with no session/org context
-- available (the link can be opened in a browser that never logged in).
-- Deletes the token on success so it can't be replayed, and only reports
-- success for a token that existed, was unused, and unexpired.
CREATE FUNCTION verify_email_token(p_token text)
RETURNS TABLE(user_id uuid, organization_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token email_verification_tokens%ROWTYPE;
BEGIN
  SELECT * INTO v_token
  FROM email_verification_tokens
  WHERE token = p_token AND expires_at > now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'verification_token_invalid_or_expired';
  END IF;

  UPDATE users SET email_verified_at = now() WHERE id = v_token.user_id;
  DELETE FROM email_verification_tokens WHERE id = v_token.id;

  RETURN QUERY SELECT v_token.user_id, v_token.organization_id;
END;
$$;

REVOKE ALL ON FUNCTION oauth_authenticate(oauth_provider, text, text, text, text, text, timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION verify_email_token(text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION oauth_authenticate(oauth_provider, text, text, text, text, text, timestamptz) TO app_user;
GRANT EXECUTE ON FUNCTION verify_email_token(text) TO app_user;

-- ---------------------------------------------------------------------------
-- resolve_table_by_qr_token: extend to also return ordering_mode, so the
-- public menu page can adapt its UI (cart hidden in DISPLAY_ONLY, pickup
-- name field instead of a table label in PICKUP, etc.) without a second
-- round trip. Same DROP+CREATE two-step as the organization_branding
-- migration -- Postgres won't let CREATE OR REPLACE change the return type.
-- ---------------------------------------------------------------------------

DROP FUNCTION resolve_table_by_qr_token(text);

CREATE FUNCTION resolve_table_by_qr_token(p_qr_token text)
RETURNS TABLE(
  table_id uuid,
  organization_id uuid,
  table_label text,
  organization_name text,
  default_language text,
  logo_url text,
  background_url text,
  ordering_mode ordering_mode
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT t.id, t.organization_id, t.label, o.name, o.default_language, o.logo_url, o.background_url, t.ordering_mode
  FROM tables t JOIN organizations o ON o.id = t.organization_id
  WHERE t.qr_token = p_qr_token;
$$;

REVOKE ALL ON FUNCTION resolve_table_by_qr_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION resolve_table_by_qr_token(text) TO app_user;
