"use client"

import Link from "next/link"
import { useState } from "react"
import { useActionState } from "react"
import { Eye, EyeOff, Mail, Lock, User, CheckCircle2, ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import { motion } from "motion/react"
import { AuthShell, OAuthButtons, AuthDivider } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { registerAction } from "@/lib/auth/actions"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [state, formAction, isPending] = useActionState(registerAction, undefined)

  return (
    <AuthShell
      title="Tạo tài khoản"
      subtitle="Bắt đầu hành trình học ngôn ngữ — miễn phí, không cần thẻ."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            Đăng nhập
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
        {/* Display name */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Label htmlFor="displayName" className="text-sm font-semibold">
            Tên hiển thị
          </Label>
          <InputGroup
            className={`mt-2 bg-surface-lowest shadow-ambient transition-all ${
              focused === "displayName" ? "ring-2 ring-primary/30" : ""
            }`}
          >
            <InputGroupAddon>
              <User className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              id="displayName"
              name="displayName"
              type="text"
              placeholder="Nguyễn Minh Anh"
              required
              onFocus={() => setFocused("displayName")}
              onBlur={() => setFocused(null)}
              className="text-base"
            />
          </InputGroup>
        </motion.div>

        {/* Email */}
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

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="password" className="text-sm font-semibold">
            Mật khẩu
          </Label>
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
              placeholder="Ít nhất 10 ký tự"
              required
              minLength={10}
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

        {/* Benefits box */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-start gap-3 rounded-2xl border border-border/60 bg-surface-low/40 p-4"
        >
          <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Miễn phí để bắt đầu</p>
            <p>Không cần thẻ tín dụng</p>
            <p>Hủy bất kỳ lúc nào</p>
          </div>
        </motion.div>

        {/* Terms */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-start gap-3"
        >
          <Checkbox id="terms" className="mt-1" required />
          <label
            htmlFor="terms"
            className="text-xs leading-relaxed text-muted-foreground"
          >
            Tôi đồng ý với{" "}
            <Link href="/terms" className="font-semibold text-foreground hover:text-accent transition-colors">
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link href="/privacy" className="font-semibold text-foreground hover:text-accent transition-colors">
              Chính sách bảo mật
            </Link>
          </label>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="w-full rounded-full bg-gradient-primary text-primary-foreground shadow-ambient hover:shadow-hover transition-all group"
          >
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tạo tài khoản...</>
            ) : (
              <>Tạo tài khoản miễn phí <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
            )}
          </Button>
        </motion.div>
      </form>
    </AuthShell>
  )
}
