-- A staff member who clicks their emailed invitation link has already
-- proven ownership of that inbox -- the same proof the separate
-- email-verification flow (growth_features migration) exists to get for
-- self-service signup. No reason to also make them click a second,
-- redundant "confirm your email" link right after.
--
-- accept_invitation's RETURNS TABLE already grew an `email` column once
-- before (see the invitation_lookup migration) -- preserved here as-is.
-- Postgres won't let CREATE OR REPLACE touch OUT-parameter shape even
-- when it's unchanged in this case, so DROP+CREATE again, same as every
-- other return-shape-sensitive function in this codebase.
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

  INSERT INTO users (id, organization_id, name, email, password_hash, role, email_verified_at, created_at, updated_at)
  VALUES (gen_random_uuid(), v_invitation.organization_id, p_name, v_invitation.email, p_password_hash, v_invitation.role, now(), now(), now())
  RETURNING id INTO v_user_id;

  UPDATE invitations SET accepted_at = now() WHERE id = v_invitation.id;

  RETURN QUERY SELECT v_user_id, v_invitation.organization_id, v_invitation.role, v_invitation.email;
END;
$$;

REVOKE ALL ON FUNCTION accept_invitation(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION accept_invitation(text, text, text) TO app_user;
