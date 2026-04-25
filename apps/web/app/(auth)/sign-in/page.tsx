"use client"

import Link from "next/link"
import { useState } from "react"
import { useActionState } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import { motion } from "motion/react"
import { AuthShell, OAuthButtons, AuthDivider } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { loginAction } from "@/lib/auth/actions"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [state, formAction, isPending] = useActionState(loginAction, undefined)

  return (
    <AuthShell
      title="Chào mừng trở lại"
      subtitle="Tiếp tục hành trình học của bạn."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            Đăng ký miễn phí
          </Link>
        </p>
      }
    >
      <OAuthButtons />
      <AuthDivider />

      {/* Error alert */}
      {state?.error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </motion.div>
      )}

      <form action={formAction} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label htmlFor="email" className="text-sm font-semibold">
            Email
          </Label>
          <InputGroup
            className={`mt-2 bg-surface-lowest shadow-ambient transition-all ${
              focused === "email" ? "ring-2 ring-primary/30" : ""
            }`}
          >
            <InputGroupAddon>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className="text-base"
            />
          </InputGroup>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-semibold">
              Mật khẩu
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <InputGroup
            className={`mt-2 bg-surface-lowest shadow-ambient transition-all ${
              focused === "password" ? "ring-2 ring-primary/30" : ""
            }`}
          >
            <InputGroupAddon>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              className="text-base tracking-wide"
            />
            <InputGroupAddon align="inline-end">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="w-full rounded-full bg-gradient-primary text-primary-foreground shadow-ambient hover:shadow-hover transition-all group"
          >
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang đăng nhập...</>
            ) : (
              <>Đăng nhập <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
            )}
          </Button>
        </motion.div>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
        Đăng nhập bằng cách nhấp nút trên, bạn đồng ý với <Link href="/terms" className="underline hover:text-foreground">Điều khoản</Link> của chúng tôi.
      </p>
    </AuthShell>
  )
}
