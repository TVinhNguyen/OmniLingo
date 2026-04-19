"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { LogoMark } from "@/components/public/public-navbar"

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-60 -left-20 h-[540px] w-[540px] rounded-full blur-3xl opacity-50"
        style={{ background: "radial-gradient(circle, #a19ff9 0%, transparent 60%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-60 -right-20 h-[540px] w-[540px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, #983772 0%, transparent 60%)" }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-4 py-10">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="text-lg font-bold">OmniLingo</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 flex-1"
        >
          <h1 className="font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          )}

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-8">{footer}</div>}
        </motion.div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} OmniLingo. Bằng việc đăng ký, bạn đồng ý
          với{" "}
          <Link href="/terms" className="underline">
            Điều khoản
          </Link>{" "}
          &{" "}
          <Link href="/privacy" className="underline">
            Bảo mật
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export function OAuthButtons() {
  const providers = [
    {
      label: "Google",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 4.75c2.03 0 3.85.7 5.28 2.07l3.94-3.94C18.85.95 15.74-.5 12-.5 7.13-.5 2.89 2.55 1.03 6.72l4.63 3.59C6.6 7.5 9.06 4.75 12 4.75z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.27c0-.84-.08-1.65-.22-2.43H12v4.6h6.45c-.28 1.5-1.12 2.78-2.4 3.64l3.87 3c2.27-2.1 3.58-5.18 3.58-8.81z"
          />
          <path
            fill="#FBBC05"
            d="M5.66 14.31c-.22-.66-.34-1.37-.34-2.11 0-.74.12-1.45.34-2.11l-4.63-3.59C.37 8.22 0 10.05 0 12.2c0 2.15.37 3.98 1.03 5.7l4.63-3.59z"
          />
          <path
            fill="#34A853"
            d="M12 24.5c3.24 0 5.97-1.07 7.96-2.93l-3.87-3c-1.08.73-2.47 1.17-4.09 1.17-2.94 0-5.4-1.98-6.34-4.66l-4.63 3.59C2.89 21.95 7.13 25 12 24.5z"
          />
        </svg>
      ),
    },
    {
      label: "Apple",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.37-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.37C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95 0-5.52-4.48-10-10-10z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid gap-2">
      {providers.map((p) => (
        <button
          key={p.label}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-surface-lowest px-5 py-3 text-sm font-semibold shadow-ambient transition-all hover:-translate-y-0.5 hover:shadow-raise"
        >
          {p.icon}
          Tiếp tục với {p.label}
        </button>
      ))}
    </div>
  )
}

export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        hoặc
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}
