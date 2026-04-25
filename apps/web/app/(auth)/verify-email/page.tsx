"use client"

import { useEffect, useRef, useState, useActionState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "motion/react"
import { Mail, Check, RefreshCw, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthShell } from "@/components/auth/auth-shell"
import { forgotPasswordAction } from "@/lib/auth/actions"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  // Resend via forgotPassword action
  const [resendState, resendAction, isResending] = useActionState(forgotPasswordAction, undefined)

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [cooldown])

  useEffect(() => {
    if (resendState?.success) setCooldown(30)
  }, [resendState])

  useEffect(() => {
    if (verified) {
      const t = setTimeout(() => router.push("/onboarding"), 2000)
      return () => clearTimeout(t)
    }
  }, [verified, router])

  const submit = async (code: string) => {
    setError(null)
    setPending(true)
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: code }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { message?: string }).message ?? "Mã không đúng hoặc đã hết hạn.")
      } else {
        setVerified(true)
      }
    } catch {
      setError("Không thể kết nối. Vui lòng thử lại.")
    } finally {
      setPending(false)
    }
  }

  const handleChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1)
    const next = [...digits]
    next[idx] = digit
    setDigits(next)
    if (digit && idx < 5) refs.current[idx + 1]?.focus()
    if (next.every((d) => d)) submit(next.join(""))
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length) {
      e.preventDefault()
      const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6)
      setDigits(next)
      refs.current[Math.min(pasted.length, 5)]?.focus()
      if (pasted.length === 6) submit(pasted)
    }
  }

  return (
    <AuthShell
      title={verified ? "Email đã xác thực" : "Xác thực email"}
      subtitle={
        verified
          ? "Tài khoản của bạn đã sẵn sàng"
          : "Nhập mã 6 số đã gửi tới email của bạn"
      }
    >
      {verified ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <Check className="h-7 w-7 text-success" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Đang chuyển tới onboarding…</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            {pending ? <Loader2 className="h-7 w-7 animate-spin text-primary" /> : <Mail className="h-7 w-7 text-primary" />}
          </div>

          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el }}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !digits[i] && i > 0) {
                    refs.current[i - 1]?.focus()
                  }
                }}
                disabled={pending || verified}
                inputMode="numeric"
                maxLength={1}
                className="h-14 w-12 rounded-xl border-2 bg-background text-center font-mono text-xl font-semibold outline-none transition focus:border-primary disabled:opacity-50"
                aria-label={`Mã số ${i + 1}`}
              />
            ))}
          </div>

          {error && (
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <div className="flex items-center justify-between border-t pt-4 text-sm">
            <span className="text-muted-foreground">Chưa nhận được email?</span>
            <form action={resendAction}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                disabled={cooldown > 0 || isResending}
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                {cooldown > 0 ? `Gửi lại sau ${cooldown}s` : "Gửi lại"}
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Sai email?{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              Đăng ký lại
            </Link>
          </p>
        </div>
      )}
    </AuthShell>
  )
}
