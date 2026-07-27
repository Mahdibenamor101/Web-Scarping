import { z } from "zod";

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
