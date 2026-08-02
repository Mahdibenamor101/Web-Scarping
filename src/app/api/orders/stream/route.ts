import { NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { subscribeToOrderEvents, subscribeToStaffCallEvents } from "@/lib/realtime";

export const dynamic = "force-dynamic";

const HEARTBEAT_MS = 15000;

// Server-Sent Events: one long-lived HTTP response per connected staff
// member, pushed to whenever prisma/migrations/*_order_realtime_notify or
// *_staff_call_realtime_notify's trigger fires for their organization. No
// polling on either side. Both event kinds share this one connection
// (tagged by `kind`) rather than each getting their own EventSource --
// one long-lived HTTP connection per dashboard session, not two.
export async function GET(_req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("not_authenticated", { status: 401 });
  }

  const encoder = new TextEncoder();
  let unsubscribeOrders: (() => void) | null = null;
  let unsubscribeStaffCalls: (() => void) | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Controller already closed (client disconnected between events).
        }
      };

      send({ type: "connected" });
      unsubscribeOrders = await subscribeToOrderEvents(session.organizationId, (event) =>
        send({ ...event, kind: "order" }),
      );
      unsubscribeStaffCalls = await subscribeToStaffCallEvents(session.organizationId, (event) =>
        send({ ...event, kind: "staffCall" }),
      );
      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          // ignore
        }
      }, HEARTBEAT_MS);
    },
    cancel() {
      unsubscribeOrders?.();
      unsubscribeStaffCalls?.();
      if (heartbeat) clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
