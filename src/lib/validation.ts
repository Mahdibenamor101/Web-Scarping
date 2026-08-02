import { z } from "zod";
import { Allergen } from "@prisma/client";
import { LANGUAGE_CODES } from "./translate";

export const signupSchema = z.object({
  organizationName: z.string().trim().min(2).max(120),
  ownerName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(10).max(200),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(1).max(200),
});

export const staffRoleSchema = z.enum(["OWNER", "MANAGER", "SERVER", "KITCHEN"]);

export const billingCheckoutSchema = z.object({
  period: z.enum(["monthly", "quarterly", "semiannual", "annual"]),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(255),
  restaurantName: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10).max(4000),
});

export const inviteStaffSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  role: staffRoleSchema,
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(1),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(10).max(200),
});

export const updateStaffSchema = z.object({
  role: staffRoleSchema.optional(),
  isActive: z.boolean().optional(),
});

const allergenSchema = z.nativeEnum(Allergen);

export const createMenuCategorySchema = z.object({
  nameIt: z.string().trim().min(1).max(120),
  nameEn: z.string().trim().max(120).optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

export const updateMenuCategorySchema = createMenuCategorySchema.partial();

export const createMenuItemSchema = z.object({
  categoryId: z.string().uuid(),
  nameIt: z.string().trim().min(1).max(150),
  nameEn: z.string().trim().max(150).optional(),
  descriptionIt: z.string().trim().max(1000).optional(),
  descriptionEn: z.string().trim().max(1000).optional(),
  price: z.number().positive().max(10000),
  photoUrl: z.string().trim().url().max(2000).optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
  allergens: z.array(allergenSchema).max(14).optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

export const orderingModeSchema = z.enum(["TABLE", "COUNTER", "PICKUP", "DISPLAY_ONLY"]);

export const createTableSchema = z.object({
  label: z.string().trim().min(1).max(50),
  orderingMode: orderingModeSchema.optional(),
});

export const updateTableSchema = z.object({
  label: z.string().trim().min(1).max(50).optional(),
  status: z.enum(["FREE", "OCCUPIED"]).optional(),
  orderingMode: orderingModeSchema.optional(),
});

export const createOrderItemSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().min(1).max(50),
  notes: z.string().trim().max(500).optional(),
});

export const createOrderSchema = z.object({
  items: z.array(createOrderItemSchema).min(1).max(50),
  // Required only for PICKUP orders -- enforced in the route once the QR
  // token resolves to a table, since the schema alone doesn't know the
  // table's ordering mode yet.
  pickupName: z.string().trim().min(1).max(120).optional(),
});

export const orderStatusSchema = z.enum(["PENDING", "IN_PROGRESS", "READY", "SERVED", "CANCELLED"]);

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});

// White-label: null explicitly clears a previously-set image (distinct
// from omitting the key, which leaves it unchanged) -- see
// src/app/api/branding/route.ts.
export const updateBrandingSchema = z.object({
  logoUrl: z.string().trim().url().max(2000).nullable().optional(),
  backgroundUrl: z.string().trim().url().max(2000).nullable().optional(),
});

export const generatePhotoSchema = z.object({
  nameIt: z.string().trim().min(1).max(150),
  descriptionIt: z.string().trim().max(1000).optional(),
});

export const registerPushTokenSchema = z.object({
  token: z.string().trim().min(1).max(500),
  platform: z.enum(["ios", "android"]),
});

export const translateMenuSchema = z.object({
  languageCodes: z
    .array(z.enum(LANGUAGE_CODES as [string, ...string[]]))
    .min(1)
    .max(LANGUAGE_CODES.length),
});
