"use client"

import { Suspense, use, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import { AlertCircle, ArrowRight, Check, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { oauthCallbackAction } from "@/lib/auth/actions"

type Provider = "google" | "facebook" | "apple" | "github"

const providers: Record<Provider, { name: string; color: string; iconBg: string; Icon: () => React.ReactElement }> = {
  google: {
    name: "Google",
    color: "text-foreground",
    iconBg: "bg-card",
    Icon: () => (
      <svg viewBox="0 0 48 48" className="size-6">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
    ),
  },
  facebook: {
    name: "Facebook",
    color: "text-white",
    iconBg: "bg-[#1877F2]",
    Icon: () => (
      <svg viewBox="0 0 24 24" className="size-6" fill="white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  apple: {
    name: "Apple",
    color: "text-white",
    iconBg: "bg-foreground",
    Icon: () => (
      <svg viewBox="0 0 24 24" className="size-6" fill="white">
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
      </svg>
    ),
  },
  github: {
    name: "GitHub",
    color: "text-white",
    iconBg: "bg-foreground",
    Icon: () => (
      <svg viewBox="0 0 24 24" className="size-6" fill="white">
        <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.82-.26.82-.57v-2c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49 1 .11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.19 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.89.12 3.19.77.84 1.24 1.91 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.57A12 12 0 0 0 12 .3"/>
      </svg>
    ),
  },
}

type Step = "verify" | "session" | "prepare"

function CallbackInner({ provider }: { provider: Provider }) {
  const params = useSearchParams()
  const code  = params.get("code")  ?? ""
  const state = params.get("state") ?? ""
  const errorParam = params.get("error")
  const [currentStep, setCurrentStep] = useState<Step>("verify")
  const [failed, setFailed]           = useState(!!errorParam)
  const [errorMsg, setErrorMsg]       = useState(errorParam ?? "")

  const p = providers[provider] ?? providers.google

  useEffect(() => {
    if (failed || !code) {
      if (!code && !errorParam) setFailed(true)
      return
    }

    // Step 1 → call oauthCallbackAction
    setCurrentStep("verify")
    oauthCallbackAction(provider, code, state)
      .then((res) => {
        if (res?.error) {
          setErrorMsg(res.error)
          setFailed(true)
          return
        }
        // Action does server-side redirect — no need to handle success here
        // but still animate the steps while waiting
        setCurrentStep("session")
        setTimeout(() => setCurrentStep("prepare"), 600)
      })
      .catch((err: unknown) => {
        setErrorMsg(err instanceof Error ? err.message : "OAuth đăng nhập thất bại.")
        setFailed(true)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run once on mount

  const steps: Array<{ key: Step; label: string }> = [
    { key: "verify", label: `Xác thực với ${p.name}` },
    { key: "session", label: "Tạo phiên OmniLingo" },
    { key: "prepare", label: "Chuẩn bị dashboard" },
  ]

  if (failed) {
    return (
      <div className="min-h-screen bg-gradient-soft flex flex-col items-center justify-center px-4">
        <div className="mx-auto flex items-center gap-2 mb-8">
          <div className={cn("flex size-10 items-center justify-center rounded-xl shadow-ambient", p.iconBg)}>
            <p.Icon />
          </div>
          <ArrowRight className="size-4 text-muted-foreground" />
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-hover">
            <Sparkles className="size-5" />
          </div>
        </div>
        <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-12 text-destructive" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">Đăng nhập thất bại</h1>
        <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
          Không thể đăng nhập với {p.name}. Có thể bạn đã huỷ ở cửa sổ popup hoặc session đã hết hạn.
        </p>
        <div className="mt-8 flex gap-2">
          <Button asChild size="lg" className="bg-gradient-primary">
            <Link href="/sign-in">Thử lại</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Liên hệ support</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col items-center justify-center px-4">
      {/* Logos */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-10"
      >
        <div className={cn("flex size-12 items-center justify-center rounded-xl shadow-ambient", p.iconBg)}>
          <p.Icon />
        </div>
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <ArrowRight className="size-5 text-muted-foreground" />
        </motion.div>
        <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-hover">
          <Sparkles className="size-6" />
        </div>
      </motion.div>

      {/* Spinner */}
      <Loader2 className="size-12 animate-spin text-primary mb-6" />

      <h1 className="font-display text-2xl font-bold tracking-tight text-center text-balance">
        Đang đăng nhập bằng {p.name}…
      </h1>

      {/* Steps */}
      <div className="mt-8 w-full max-w-sm space-y-2">
        {steps.map((s) => {
          const stepIndex = steps.findIndex((x) => x.key === currentStep)
          const myIndex = steps.findIndex((x) => x.key === s.key)
          const done = myIndex < stepIndex
          const active = myIndex === stepIndex

          return (
            <motion.div
              key={s.key}
              initial={false}
              animate={{ opacity: myIndex <= stepIndex ? 1 : 0.4 }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-ambient"
            >
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                  done && "bg-success text-white",
                  active && "bg-primary text-white",
                  !done && !active && "bg-surface-low text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3" /> : active ? <Loader2 className="size-3 animate-spin" /> : "…"}
              </div>
              <span className={cn("text-sm", active ? "font-medium text-foreground" : "text-muted-foreground")}>
                {s.label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function CallbackPage({
  params,
}: {
  params: Promise<{ provider: string }>
}) {
  const { provider } = use(params)
  const p = (provider as Provider) in providers ? (provider as Provider) : "google"
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-soft" />}>
      <CallbackInner provider={p} />
    </Suspense>
  )
}
