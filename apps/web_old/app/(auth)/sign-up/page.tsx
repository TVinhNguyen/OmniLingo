"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { AuthShell, OAuthButtons, AuthDivider } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { registerAction, type RegisterState } from "@/lib/auth/actions";

const initialState: RegisterState = {};

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <AuthShell
      title="Tạo tài khoản"
      subtitle="Bắt đầu hành trình học ngôn ngữ của bạn — miễn phí, không cần thẻ."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href="/sign-in" className="font-semibold text-accent hover:underline">
            Đăng nhập
          </Link>
        </p>
      }
    >
      <OAuthButtons />
      <AuthDivider />

      <form action={formAction} className="space-y-4">
        {/* Error banner */}
        {state.error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {state.error}
          </div>
        )}

        {/* Display name */}
        <div>
          <Label htmlFor="displayName" className="text-sm font-medium">
            Tên hiển thị
          </Label>
          <InputGroup className="mt-1.5 bg-surface-lowest shadow-ambient">
            <InputGroupAddon>
              <User className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              id="displayName"
              name="displayName"
              type="text"
              placeholder="Tên của bạn"
              autoComplete="name"
            />
          </InputGroup>
        </div>

        {/* Email */}
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

        {/* Password */}
        <div>
          <Label htmlFor="password" className="text-sm font-medium">
            Mật khẩu
          </Label>
          <InputGroup className="mt-1.5 bg-surface-lowest shadow-ambient">
            <InputGroupAddon>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Ít nhất 8 ký tự"
              autoComplete="new-password"
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
          <p className="mt-1 text-xs text-muted-foreground">
            Tối thiểu 8 ký tự, nên có chữ hoa và số.
          </p>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <Checkbox id="terms" name="terms" className="mt-0.5" required />
          <label
            htmlFor="terms"
            className="text-xs leading-relaxed text-muted-foreground"
          >
            Tôi đồng ý với{" "}
            <Link href="/terms" className="font-semibold text-foreground hover:underline">
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link href="/privacy" className="font-semibold text-foreground hover:underline">
              Chính sách bảo mật
            </Link>
          </label>
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
              Đang tạo tài khoản…
            </>
          ) : (
            "Tạo tài khoản miễn phí"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
