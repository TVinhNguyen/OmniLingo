"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { LogoMark } from "@/components/public/public-navbar"

const STEP_INDEX: Record<string, number> = {
  "language-select": 1,
  "goal-select":     2,
  "level-select":    3,
  "placement":       4,
  "done":            5,
}

export function OnboardingShell({
  slug,
  title,
  subtitle,
  children,
}: {
  slug: string
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  const idx = STEP_INDEX[slug] ?? 1
  const pct = (idx / 5) * 100
  return (
    <div className="min-h-screen bg-gradient-soft px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" aria-label="OmniLingo"><LogoMark /></Link>
          <span className="text-sm text-muted-foreground">Bước {idx} / 5</span>
        </div>
        <div className="mb-8 h-1.5 rounded-full bg-surface-high">
          <motion.div
            className="h-full rounded-full bg-gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}
