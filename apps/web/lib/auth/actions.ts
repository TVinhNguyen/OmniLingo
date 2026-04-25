"use server";

/**
 * Server Actions for authentication.
 * Called directly from form `action={}` props — no API route needed.
 */

import { redirect } from "next/navigation";
import {
  serverLogin,
  serverRegister,
  serverLogout,
  serverForgotPassword,
  serverResetPassword,
  serverOAuthCallback,
  serverChangePassword,
  serverDeleteAccount,
} from "@/lib/api/auth";
import { setSession, clearSession, getSession } from "@/lib/auth/session";

// ─── Login ────────────────────────────────────────────────────────────────────

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState | undefined,
  formData: FormData,
): Promise<LoginState | undefined> {
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
  _prev: RegisterState | undefined,
  formData: FormData,
): Promise<RegisterState | undefined> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = (formData.get("displayName") as string) || email.split("@")[0];

  if (!email || !password) {
    return { error: "Vui lòng điền đầy đủ thông tin." };
  }
  if (password.length < 10) {
    return { error: "Mật khẩu phải có ít nhất 10 ký tự." };
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
  // Revoke refresh token on identity server first (security: prevent token reuse)
  const session = await getSession();
  if (session?.refreshToken) {
    await serverLogout(session.refreshToken).catch(() => {}); // best-effort
  }
  await clearSession();
  redirect("/");
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export interface ForgotPasswordState {
  success?: boolean;
  error?: string;
}

export async function forgotPasswordAction(
  _prev: ForgotPasswordState | undefined,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = (formData.get("email") as string)?.trim();
  if (!email) return { error: "Vui lòng nhập email." };

  // Always show success (anti-enumeration hardened server-side)
  await serverForgotPassword(email).catch(() => {});
  return { success: true };
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export interface ResetPasswordState {
  success?: boolean;
  error?: string;
}

export async function resetPasswordAction(
  _prev: ResetPasswordState | undefined,
  formData: FormData,
): Promise<ResetPasswordState> {
  const token       = (formData.get("token") as string)?.trim();
  const newPassword = (formData.get("newPassword") as string) ?? "";
  const confirm     = (formData.get("confirm") as string) ?? "";

  if (!token) return { error: "Token không hợp lệ. Vui lòng dùng lại link trong email." };
  if (newPassword.length < 10) return { error: "Mật khẩu phải có ít nhất 10 ký tự." };
  if (newPassword !== confirm) return { error: "Mật khẩu xác nhận không khớp." };

  try {
    await serverResetPassword(token, newPassword);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Đặt lại mật khẩu thất bại.";
    if (msg.toLowerCase().includes("expired") || msg.toLowerCase().includes("invalid")) {
      return { error: "Link đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu lại." };
    }
    return { error: msg };
  }

  redirect("/sign-in?reset=1");
}

// ─── OAuth Callback ───────────────────────────────────────────────────────────

export async function oauthCallbackAction(
  provider: string,
  code: string,
  state: string,
): Promise<{ error?: string }> {
  let redirectPath: string;
  try {
    const tokens = await serverOAuthCallback(provider, code, state);
    await setSession({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    redirectPath = tokens.isNewUser ? "/onboarding" : "/dashboard";
  } catch (err) {
    const msg = err instanceof Error ? err.message : "OAuth đăng nhập thất bại.";
    return { error: msg };
  }
  redirect(redirectPath);
}

// ─── Change Password ──────────────────────────────────────────────────────────

export interface ChangePasswordState {
  success?: boolean;
  error?: string;
}

export async function changePasswordAction(
  _prev: ChangePasswordState | undefined,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await getSession();
  if (!session?.accessToken) redirect("/sign-in");

  const oldPassword = (formData.get("oldPassword") as string) ?? "";
  const newPassword = (formData.get("newPassword") as string) ?? "";
  const confirm     = (formData.get("confirm") as string) ?? "";

  if (!oldPassword || !newPassword) return { error: "Vui lòng điền đầy đủ thông tin." };
  if (newPassword.length < 10) return { error: "Mật khẩu mới phải có ít nhất 10 ký tự." };
  if (newPassword !== confirm) return { error: "Mật khẩu xác nhận không khớp." };

  try {
    await serverChangePassword(session.accessToken, oldPassword, newPassword);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Đổi mật khẩu thất bại.";
    if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("wrong")) {
      return { error: "Mật khẩu hiện tại không đúng." };
    }
    return { error: msg };
  }

  return { success: true };
}

// ─── Delete Account ───────────────────────────────────────────────────────────

export interface DeleteAccountState {
  error?: string;
}

export async function deleteAccountAction(
  _prev: DeleteAccountState | undefined,
  formData: FormData,
): Promise<DeleteAccountState> {
  const session = await getSession();
  if (!session?.accessToken) redirect("/sign-in");

  const password = (formData.get("password") as string) ?? "";
  if (!password) return { error: "Vui lòng nhập mật khẩu để xác nhận." };

  try {
    await serverDeleteAccount(session.accessToken, password);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Xoá tài khoản thất bại.";
    if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("wrong")) {
      return { error: "Mật khẩu không đúng." };
    }
    return { error: msg };
  }

  await clearSession();
  redirect("/");
}
