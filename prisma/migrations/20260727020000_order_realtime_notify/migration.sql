-- Real-time kitchen/floor board: instead of polling, the app LISTENs on a
-- Postgres channel and gets pushed a NOTIFY the instant an order is
-- created or its status changes. The database is the single source of
-- truth for "an order changed" the same way it already is for tenant
-- isolation -- no separate message queue to keep in sync with it.
--
-- NOTIFY payloads queued during a transaction are only delivered to
-- listeners after that transaction commits (built-in Postgres behavior),
-- so a rolled-back order never fires a false notification.
--
-- This does NOT need SECURITY DEFINER: pg_notify() requires no special
-- privilege beyond being able to connect, and the trigger only reads the
-- row already in scope (NEW) -- no bypass of RLS is involved.
CREATE FUNCTION notify_order_event() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM pg_notify(
    'order_events',
    json_build_object(
      'organizationId', NEW.organization_id,
      'orderId', NEW.id,
      'type', CASE WHEN TG_OP = 'INSERT' THEN 'created' ELSE 'updated' END
    )::text
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_notify
AFTER INSERT OR UPDATE OF status ON "orders"
FOR EACH ROW EXECUTE FUNCTION notify_order_event();
