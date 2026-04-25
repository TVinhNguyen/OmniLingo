"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { AuthShell, OAuthButtons, AuthDivider } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { loginAction, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = {};

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") || "/dashboard";

  return (
    <AuthShell
      title="Chào mừng trở lại"
      subtitle="Tiếp tục hành trình học của bạn."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/sign-up" className="font-semibold text-accent hover:underline">
            Đăng ký miễn phí
          </Link>
        </p>
      }
    >
      <OAuthButtons />
      <AuthDivider />

      <form action={formAction} className="space-y-4">
        {/* Pass redirect target to Server Action */}
        <input type="hidden" name="redirectTo" value={redirectTo} />

        {/* Error banner */}
        {state.error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {state.error}
          </div>
        )}

        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <InputGroup className="mt-1.5 bg-surface-lowest shadow-ambient">
            <InputGroupAddon>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              id="email"
              name="email"
              type="email"
              placeholder="ban@email.com"
              autoComplete="email"
              required
            />
          </InputGroup>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-accent hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <InputGroup className="mt-1.5 bg-surface-lowest shadow-ambient">
            <InputGroupAddon>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu của bạn"
              autoComplete="current-password"
              required
            />
            <InputGroupAddon align="inline-end">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="w-full rounded-full bg-gradient-primary text-primary-foreground shadow-ambient hover:shadow-hover disabled:opacity-70"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang đăng nhập…
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
