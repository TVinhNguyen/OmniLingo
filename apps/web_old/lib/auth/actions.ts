"use server";

/**
 * Server Actions for authentication.
 * Called directly from form `action={}` props — no API route needed.
 */

import { redirect } from "next/navigation";
import { serverLogin, serverRegister } from "@/lib/api/auth";
import { setSession, clearSession } from "@/lib/auth/session";

// ─── Login ────────────────────────────────────────────────────────────────────

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  if (!email || !password) {
    return { error: "Vui lòng điền đầy đủ thông tin." };
  }

  try {
    const tokens = await serverLogin({ email, password });
    await setSession(tokens);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Đăng nhập thất bại.";
    // Map common error messages to Vietnamese
    if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("credentials")) {
      return { error: "Email hoặc mật khẩu không đúng." };
    }
    return { error: msg };
  }

  redirect(redirectTo);
}

// ─── Register ────────────────────────────────────────────────────────────────

export interface RegisterState {
  error?: string;
}

export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = (formData.get("displayName") as string) || email.split("@")[0];

  if (!email || !password) {
    return { error: "Vui lòng điền đầy đủ thông tin." };
  }
  if (password.length < 8) {
    return { error: "Mật khẩu phải có ít nhất 8 ký tự." };
  }

  try {
    const tokens = await serverRegister({ email, password, displayName });
    await setSession(tokens);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Đăng ký thất bại.";
    if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("exist")) {
      return { error: "Email này đã được sử dụng. Vui lòng đăng nhập." };
    }
    return { error: msg };
  }

  redirect("/onboarding");
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/");
}
