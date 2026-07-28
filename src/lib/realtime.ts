import { Client } from "pg";
import { EventEmitter } from "node:events";

export type OrderEvent = { organizationId: string; orderId: string; type: "created" | "updated" };
export type StaffCallEvent = { organizationId: string; callId: string; type: "created" | "updated" };

// One dedicated Postgres connection, LISTENing on `order_events` and
// `staff_call_events` for the lifetime of this server process, fanning out
// to whichever organizations currently have an open SSE connection. This
// scales to multiple app server instances without any extra work: Postgres
// NOTIFY broadcasts to every session that's LISTENing, so each instance
// gets every event and only forwards it to the browsers connected to
// *that* instance.
//
// This is a plain module-level singleton, same pattern as the Prisma
// client in src/lib/db.ts, and relies on the same assumption: `next dev` /
// `next start` are long-lived Node processes, not per-request functions.
// A serverless deployment (e.g. Vercel functions) would need a different
// transport for this piece specifically -- see CONTEXT.md §13.
const orderBus = new EventEmitter();
orderBus.setMaxListeners(0);
const staffCallBus = new EventEmitter();
staffCallBus.setMaxListeners(0);

let listenClient: Client | null = null;
let connecting: Promise<void> | null = null;

async function ensureListening(): Promise<void> {
  if (listenClient) return;
  if (connecting) return connecting;

  connecting = (async () => {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    client.on("notification", (msg) => {
      if (!msg.payload) return;
      try {
        if (msg.channel === "order_events") {
          const event = JSON.parse(msg.payload) as OrderEvent;
          orderBus.emit(event.organizationId, event);
        } else if (msg.channel === "staff_call_events") {
          const event = JSON.parse(msg.payload) as StaffCallEvent;
          staffCallBus.emit(event.organizationId, event);
        }
      } catch {
        // Malformed payload should never happen (the trigger controls the
        // shape) -- if it does, drop it rather than crash the listener.
      }
    });
    client.on("error", (err) => {
      console.error("[realtime] LISTEN connection error, will reconnect on next subscribe", err);
      listenClient = null;
      connecting = null;
    });
    await client.connect();
    await client.query("LISTEN order_events");
    await client.query("LISTEN staff_call_events");
    listenClient = client;
  })();

  try {
    await connecting;
  } finally {
    connecting = null;
  }
}

/** Subscribes to order events for one organization. Returns an unsubscribe function. */
export async function subscribeToOrderEvents(
  organizationId: string,
  onEvent: (event: OrderEvent) => void,
): Promise<() => void> {
  await ensureListening();
  orderBus.on(organizationId, onEvent);
  return () => orderBus.off(organizationId, onEvent);
}

/** Subscribes to "call the waiter" events for one organization. Returns an unsubscribe function. */
export async function subscribeToStaffCallEvents(
  organizationId: string,
  onEvent: (event: StaffCallEvent) => void,
): Promise<() => void> {
  await ensureListening();
  staffCallBus.on(organizationId, onEvent);
  return () => staffCallBus.off(organizationId, onEvent);
}
