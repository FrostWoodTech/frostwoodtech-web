import { describe, expect, it } from "vitest";
import { issuesOf } from "@/test/issuesOf";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  setPasswordSchema,
} from "@/admin/validation/authSchemas";

describe("email rule", () => {
  it.each(["admin@frostwood.tech", "a@b", "  padded@example.com  "])(
    "accepts %j",
    (email) => {
      expect(forgotPasswordSchema.safeParse({ email }).success).toBe(true);
    },
  );

  it.each([
    "",
    "no-at-sign",
    "@leading.com",
    "trailing@",
    "two@@at.com",
    "a@b@c",
    "has space@x.com",
  ])("rejects %j", (email) => {
    const result = forgotPasswordSchema.safeParse({ email });
    expect(issuesOf(result).email).toBe("A valid email address is required.");
  });

  it("trims the parsed value", () => {
    const result = forgotPasswordSchema.parse({ email: "  x@y.com " });
    expect(result.email).toBe("x@y.com");
  });
});

describe("loginSchema", () => {
  it("only requires a non-empty password, not the strength rules", () => {
    expect(
      loginSchema.safeParse({ email: "x@y.com", password: "a" }).success,
    ).toBe(true);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({ email: "x@y.com", password: "" });
    expect(issuesOf(result).password).toBe("Password is required.");
  });
});

describe("registerSchema", () => {
  const valid = {
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    password: "correct-horse",
    confirmPassword: "correct-horse",
  };

  it("accepts a valid registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("requires first and last names that aren't just whitespace", () => {
    const issues = issuesOf(
      registerSchema.safeParse({ ...valid, firstName: "  ", lastName: "" }),
    );
    expect(issues.firstName).toBe("First name is required.");
    expect(issues.lastName).toBe("Last name is required.");
  });

  it("enforces the 8 character minimum", () => {
    const issues = issuesOf(
      registerSchema.safeParse({
        ...valid,
        password: "short77",
        confirmPassword: "short77",
      }),
    );
    expect(issues.password).toBe("Password must be at least 8 characters.");
  });

  it("rejects whitespace inside the password", () => {
    const issues = issuesOf(
      registerSchema.safeParse({
        ...valid,
        password: "has space",
        confirmPassword: "has space",
      }),
    );
    expect(issues.password).toBe("Password cannot contain whitespace.");
  });

  it("reports a confirmation mismatch on confirmPassword", () => {
    const issues = issuesOf(
      registerSchema.safeParse({ ...valid, confirmPassword: "different1" }),
    );
    expect(issues).toEqual({
      confirmPassword: "Password and its confirmation do not match.",
    });
  });
});

describe("setPasswordSchema", () => {
  it("reports a confirmation mismatch on confirmPassword", () => {
    const issues = issuesOf(
      setPasswordSchema.safeParse({
        password: "password1",
        confirmPassword: "password2",
      }),
    );
    expect(issues).toEqual({
      confirmPassword: "Password and its confirmation do not match.",
    });
  });
});

describe("changePasswordSchema", () => {
  const valid = {
    currentPassword: "old",
    newPassword: "new-password",
    confirmNewPassword: "new-password",
  };

  it("accepts a valid change", () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("labels strength errors as the new password", () => {
    const issues = issuesOf(
      changePasswordSchema.safeParse({
        ...valid,
        newPassword: "short",
        confirmNewPassword: "short",
      }),
    );
    expect(issues.newPassword).toBe(
      "New password must be at least 8 characters.",
    );
  });

  it("requires the current password", () => {
    const issues = issuesOf(
      changePasswordSchema.safeParse({ ...valid, currentPassword: "" }),
    );
    expect(issues.currentPassword).toBe("Current password is required.");
  });

  it("reports a confirmation mismatch on confirmNewPassword", () => {
    const issues = issuesOf(
      changePasswordSchema.safeParse({
        ...valid,
        confirmNewPassword: "something-else",
      }),
    );
    expect(issues).toEqual({
      confirmNewPassword: "New password and its confirmation do not match.",
    });
  });
});
