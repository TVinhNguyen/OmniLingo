"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Mail, ArrowLeft, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { forgotPasswordAction } from "@/lib/auth/actions"

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, undefined)

  if (state?.success) {
    return (
      <AuthShell
        title="Email đã gửi"
        subtitle="Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link khôi phục trong vài phút."
        footer={
          <Link
            href="/sign-in"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-7 w-7 text-success" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Kiểm tra hộp thư đến (và thư mục spam) của bạn.
          </p>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Quên mật khẩu?"
      subtitle="Nhập email của bạn, chúng tôi sẽ gửi link khôi phục."
      footer={
        <Link
          href="/sign-in"
          className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại đăng nhập
        </Link>
      }
    >
      <form action={formAction} className="space-y-4">
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
              required
              autoComplete="email"
            />
          </InputGroup>
        </div>

        {state?.error && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {state.error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="w-full rounded-full bg-gradient-primary text-primary-foreground shadow-ambient"
        >
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang gửi…</>
          ) : (
            "Gửi link khôi phục"
          )}
        </Button>
      </form>
    </AuthShell>
  )
}
