"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  User,
  GraduationCap,
  Languages,
  Bell,
  Shield,
  Eye,
  Lock,
  Link2,
  Download,
  CreditCard,
  Crown,
  ChevronRight,
  Check,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/settings/account", label: "Tài khoản", icon: User },
  { href: "/settings/connected-accounts", label: "Tài khoản liên kết", icon: Link2 },
  { href: "/settings/security", label: "Bảo mật", icon: Lock },
  { href: "/settings/learning", label: "Học tập", icon: GraduationCap },
  { href: "/settings/languages", label: "Ngôn ngữ", icon: Languages },
  { href: "/settings/notifications", label: "Thông báo", icon: Bell },
  { href: "/settings/privacy", label: "Quyền riêng tư", icon: Shield },
  { href: "/settings/accessibility", label: "Trợ năng & Giao diện", icon: Eye },
  { href: "/settings/data-export", label: "Xuất dữ liệu", icon: Download },
  { href: "/settings/subscription", label: "Gói đăng ký", icon: Crown },
  { href: "/settings/billing", label: "Thanh toán", icon: CreditCard },
]

export function SettingsShell({
  title,
  description,
  children,
  dirty = false,
  onSave,
  onCancel,
}: {
  title: string
  description?: string
  children: ReactNode
  dirty?: boolean
  onSave?: () => void
  onCancel?: () => void
}) {
  const pathname = usePathname()
  const current = navItems.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/settings" className="hover:text-primary">
          Settings
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{current?.label || title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-surface-lowest p-3 shadow-ambient">
            <nav className="space-y-0.5">
              {navItems.map((n) => {
                const active =
                  pathname === n.href || pathname.startsWith(n.href + "/")
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground shadow-ambient"
                        : "text-muted-foreground hover:bg-surface-low hover:text-foreground"
                    }`}
                  >
                    <n.icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div>
          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="font-sans text-3xl font-bold text-balance">{title}</h1>
            {description && <p className="mt-1 text-muted-foreground">{description}</p>}
          </motion.header>

          <div className="space-y-4">{children}</div>

          {/* Sticky save footer */}
          <AnimatePresence>
            {dirty && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 flex items-center gap-3 rounded-2xl border border-border bg-surface-lowest/95 px-4 py-3 shadow-hover backdrop-blur"
              >
                <span className="text-sm font-medium">Có thay đổi chưa lưu</span>
                <Button variant="ghost" size="sm" onClick={onCancel} className="rounded-xl">
                  <X className="mr-1 h-3.5 w-3.5" />
                  Hủy
                </Button>
                <Button size="sm" onClick={onSave} className="rounded-xl bg-primary shadow-ambient">
                  <Check className="mr-1 h-3.5 w-3.5" />
                  Lưu thay đổi
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export function SettingsCard({
  title,
  description,
  children,
  danger = false,
}: {
  title?: string
  description?: string
  children: ReactNode
  danger?: boolean
}) {
  return (
    <div
      className={`rounded-3xl p-6 shadow-ambient ${
        danger ? "bg-destructive/5 ring-1 ring-destructive/20" : "bg-surface-lowest"
      }`}
    >
      {title && (
        <div className="mb-4">
          <h3 className={`font-semibold ${danger ? "text-destructive" : ""}`}>{title}</h3>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export function SettingsRow({
  label,
  title,
  description,
  icon: Icon,
  children,
}: {
  label?: string
  title?: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  children: ReactNode
}) {
  const heading = title ?? label ?? ""
  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-b-0 last:pb-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-start gap-3">
        {Icon && (
          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div className="flex-1">
          <div className="font-medium">{heading}</div>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}
