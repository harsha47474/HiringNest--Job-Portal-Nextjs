import { z } from "zod";

// Base schema without confirmPassword
export const baseRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  role: z.enum(["applicant", "employee"]),
});

export type BaseRegisterSchemaType = z.infer<typeof baseRegisterSchema>;

// Extended schema with confirmPassword + refine
export const registerSchemaWithConfirm = baseRegisterSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export type RegisterSchemaWithConfirmType = z.infer<typeof registerSchemaWithConfirm>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;