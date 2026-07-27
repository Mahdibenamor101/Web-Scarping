import { NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { subscribeToOrderEvents } from "@/lib/realtime";

export const dynamic = "force-dynamic";

const HEARTBEAT_MS = 15000;

// Server-Sent Events: one long-lived HTTP response per connected staff
// member, pushed to whenever prisma/migrations/*_order_realtime_notify's
// trigger fires for their organization. No polling on either side.
export async function GET(_req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("not_authenticated", { status: 401 });
  }

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | null = null;
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
      unsubscribe = await subscribeToOrderEvents(session.organizationId, send);
      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          // ignore
        }
      }, HEARTBEAT_MS);
    },
    cancel() {
      unsubscribe?.();
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
