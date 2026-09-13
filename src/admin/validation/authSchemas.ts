import { z } from "zod";

/** Mirrors `Services/UserService.cs` checks and wording. */

const MINIMUM_PASSWORD_LENGTH = 8;

/** Matches the API's deliberately loose `LooksLikeEmail`: one inner `@`, no spaces. */
const email = z
  .string()
  .trim()
  .refine(
    (value) =>
      value.split("@").length === 2 &&
      !value.startsWith("@") &&
      !value.endsWith("@") &&
      !/\s/.test(value),
    { message: "A valid email address is required." },
  );

const password = (label: string) =>
  z
    .string()
    .min(MINIMUM_PASSWORD_LENGTH, `${label} must be at least 8 characters.`)
    .refine((value) => !/\s/.test(value), {
      message: `${label} cannot contain whitespace.`,
    });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    email,
    password: password("Password"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Password and its confirmation do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email,
});

export const setPasswordSchema = z
  .object({
    password: password("Password"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Password and its confirmation do not match.",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: password("New password"),
    confirmNewPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    message: "New password and its confirmation do not match.",
    path: ["confirmNewPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
