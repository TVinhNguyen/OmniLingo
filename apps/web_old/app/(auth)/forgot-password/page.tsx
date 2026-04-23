"use client"

import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function ForgotPasswordPage() {
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
      <form className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <InputGroup className="mt-1.5 bg-surface-lowest shadow-ambient">
            <InputGroupAddon>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput id="email" type="email" placeholder="ban@email.com" />
          </InputGroup>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full bg-gradient-primary text-primary-foreground shadow-ambient"
        >
          Gửi link khôi phục
        </Button>
      </form>
    </AuthShell>
  )
}
