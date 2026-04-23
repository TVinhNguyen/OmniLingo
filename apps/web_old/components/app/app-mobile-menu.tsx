"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import {
  Home,
  BookOpen,
  Dumbbell,
  Trophy,
  Bot,
  Users,
  MessageSquare,
  BarChart3,
  ShoppingBag,
  Flag,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoMark } from "@/components/public/public-navbar"
import { ThemeToggle } from "@/components/theme-toggle"

const nav = [
  { href: "/dashboard", icon: Home, label: "Trang chủ" },
  { href: "/learn", icon: BookOpen, label: "Học" },
  { href: "/practice", icon: Dumbbell, label: "Luyện tập" },
  { href: "/test-prep", icon: Trophy, label: "Luyện thi" },
  { href: "/ai-tutor", icon: Bot, label: "AI Tutor" },
  { href: "/tutors", icon: Users, label: "Giáo viên 1-1" },
  { href: "/community", icon: MessageSquare, label: "Cộng đồng" },
  { href: "/leaderboard", icon: Flag, label: "Bảng xếp hạng" },
  { href: "/progress", icon: BarChart3, label: "Tiến độ" },
  { href: "/shop", icon: ShoppingBag, label: "Cửa hàng" },
]

export function AppMobileMenu({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 overflow-y-auto bg-sidebar p-4 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2">
                <LogoMark />
                <span className="text-lg font-bold">OmniLingo</span>
              </Link>
              <div className="flex items-center gap-1">
                <ThemeToggle className="h-9 w-9" />
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-low"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <nav className="mt-6">
              <ul className="flex flex-col gap-1">
                {nav.map((item) => {
                  const active = pathname.startsWith(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium",
                          active
                            ? "bg-surface-high shadow-ambient"
                            : "text-muted-foreground hover:bg-surface-low"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
