-- A fourth narrow escape hatch, same reasoning as the three in the previous
-- migration: previewing an invitation (showing "you've been invited to
-- <restaurant> as <role>" before the invitee sets a password) happens before
-- they have any session, so there is no tenant context to scope the lookup
-- to. Returns only what the accept-invite screen needs -- never the
-- password hash, never other organizations' data.
CREATE FUNCTION invitation_lookup_by_token(p_token text)
RETURNS TABLE(
  organization_name text,
  email text,
  role staff_role,
  expires_at timestamptz,
  accepted_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.name, i.email, i.role, i.expires_at, i.accepted_at
  FROM invitations i
  JOIN organizations o ON o.id = i.organization_id
  WHERE i.token = p_token;
$$;

REVOKE ALL ON FUNCTION invitation_lookup_by_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION invitation_lookup_by_token(text) TO app_user;

-- accept_invitation originally returned (user_id, organization_id, role).
-- The session cookie the app sets right after acceptance also needs the
-- user's email, so the return shape grows a column here. Postgres won't let
-- CREATE OR REPLACE change a function's RETURNS TABLE shape, hence the drop.
DROP FUNCTION accept_invitation(text, text, text);

CREATE FUNCTION accept_invitation(
  p_token text,
  p_name text,
  p_password_hash text
) RETURNS TABLE(user_id uuid, organization_id uuid, role staff_role, email text)
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

  RETURN QUERY SELECT v_user_id, v_invitation.organization_id, v_invitation.role, v_invitation.email;
END;
$$;

REVOKE ALL ON FUNCTION accept_invitation(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION accept_invitation(text, text, text) TO app_user;
