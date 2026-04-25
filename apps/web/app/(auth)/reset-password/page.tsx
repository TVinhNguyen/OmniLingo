"use client"

import { Suspense, useState, useActionState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "motion/react"
import { Check, Eye, EyeOff, Lock, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthShell } from "@/components/auth/auth-shell"
import { resetPasswordAction } from "@/lib/auth/actions"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const [state, formAction, isPending] = useActionState(resetPasswordAction, undefined)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPw, setShowPw] = useState(false)

  const checks = [
    { ok: password.length >= 10, label: "Ít nhất 10 ký tự" },
    { ok: /[A-Z]/.test(password), label: "Chữ in hoa" },
    { ok: /[0-9]/.test(password), label: "Số" },
    { ok: /[^A-Za-z0-9]/.test(password), label: "Ký tự đặc biệt" },
  ]
  const strength = checks.filter((c) => c.ok).length
  const match = password && password === confirm

  return (
    <AuthShell
      title={state?.success ? "Mật khẩu đã đặt lại" : "Đặt lại mật khẩu"}
      subtitle={
        state?.success
          ? "Hãy đăng nhập bằng mật khẩu mới"
          : "Chọn mật khẩu mới cho tài khoản của bạn"
      }
    >
      {state?.success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <Check className="h-7 w-7 text-success" />
          </div>
          <Button asChild className="mt-6 w-full">
            <Link href="/sign-in">Đăng nhập ngay</Link>
          </Button>
        </motion.div>
      ) : (
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="token" value={token} />
          <div>
            <Label htmlFor="pw">Mật khẩu mới</Label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="pw"
                name="newPassword"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPw ? "Ẩn" : "Hiện"}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition ${
                        i <= strength
                          ? strength <= 1
                            ? "bg-danger"
                            : strength <= 2
                              ? "bg-warning"
                              : strength <= 3
                                ? "bg-accent"
                                : "bg-success"
                          : "bg-border"
                      }`}
                    />
                  ))}
                </div>
                <ul className="grid grid-cols-2 gap-1.5 text-xs">
                  {checks.map((c) => (
                    <li
                      key={c.label}
                      className={`flex items-center gap-1.5 ${
                        c.ok ? "text-success" : "text-muted-foreground"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="confirm">Nhập lại mật khẩu</Label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirm"
                name="confirm"
                type={showPw ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="pl-9"
                required
              />
            </div>
            {confirm && !match && (
              <p className="mt-1.5 text-xs text-danger">Mật khẩu không khớp</p>
            )}
          </div>

          {state?.error && (
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />{state.error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || strength < 4 || !match}
          >
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang cập nhật…</>
            ) : "Cập nhật mật khẩu"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            <Link href="/sign-in" className="hover:underline">
              Quay lại đăng nhập
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Đặt lại mật khẩu" subtitle="Đang tải…">
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </AuthShell>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
