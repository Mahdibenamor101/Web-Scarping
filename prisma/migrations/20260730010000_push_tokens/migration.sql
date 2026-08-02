-- Push notification device tokens for the mobile app (mobile/, 30 juillet
-- 2026, see CONTEXT.md). Same tenant_isolation RLS shape as every other
-- tenant table -- no SECURITY DEFINER involved, POST /api/push-tokens
-- runs under a normal authenticated session.

CREATE TABLE "push_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "organization_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token" text NOT NULL UNIQUE,
  "platform" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "push_tokens_organization_id_idx" ON "push_tokens" ("organization_id");
CREATE INDEX "push_tokens_user_id_idx" ON "push_tokens" ("user_id");

ALTER TABLE "push_tokens" ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON "push_tokens"
  USING (organization_id = current_setting('app.current_org_id', true)::uuid)
  WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);
