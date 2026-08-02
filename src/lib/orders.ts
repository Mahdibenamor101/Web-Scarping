import type { OrderStatus } from "@prisma/client";

/** Once an order reaches one of these, it no longer occupies its table. */
export const TERMINAL_ORDER_STATUSES: OrderStatus[] = ["SERVED", "CANCELLED"];
