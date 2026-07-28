-- "Call the waiter" feature: same real-time shape as order events
-- (20260727020000_order_realtime_notify) but on its own channel, so a
-- dashboard client can tell the two kinds of event apart without parsing
-- payload contents. No new SECURITY DEFINER function is needed to let a
-- customer create a call, for the same reason the public ordering
-- migration doesn't need one for orders: once resolve_table_by_qr_token
-- has resolved organization_id, inserting a staff_calls row is an
-- ordinary RLS-scoped write through withTenant().
CREATE FUNCTION notify_staff_call_event() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM pg_notify(
    'staff_call_events',
    json_build_object(
      'organizationId', NEW.organization_id,
      'callId', NEW.id,
      'type', CASE WHEN TG_OP = 'INSERT' THEN 'created' ELSE 'updated' END
    )::text
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER staff_calls_notify
AFTER INSERT OR UPDATE OF status ON "staff_calls"
FOR EACH ROW EXECUTE FUNCTION notify_staff_call_event();
