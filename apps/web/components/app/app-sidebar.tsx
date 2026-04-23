"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Flame,
  Globe,
  PenLine,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoMark } from "@/components/public/public-navbar"

type NavItem = { href: string; icon: typeof Home; label: string; badge?: string }

const navPrimary: NavItem[] = [
  { href: "/dashboard", icon: Home, label: "Trang chủ" },
  { href: "/learn", icon: BookOpen, label: "Học" },
  { href: "/practice", icon: Dumbbell, label: "Luyện tập" },
  { href: "/test-prep", icon: Trophy, label: "Luyện thi" },
  { href: "/ai-tutor", icon: Bot, label: "AI Tutor", badge: "AI" },
  { href: "/tutors", icon: Users, label: "Giáo viên 1-1" },
]

const navSocial: NavItem[] = [
  { href: "/community", icon: MessageSquare, label: "Cộng đồng" },
  { href: "/challenges", icon: Flame, label: "Thử thách" },
  { href: "/language-exchange", icon: Globe, label: "Trao đổi ngôn ngữ" },
  { href: "/leaderboard", icon: Flag, label: "Bảng xếp hạng" },
]

const navTools: NavItem[] = [
  { href: "/writing-center", icon: PenLine, label: "Writing Center" },
  { href: "/tutors/bookings", icon: Calendar, label: "Lịch đã đặt" },
  { href: "/progress", icon: BarChart3, label: "Tiến độ" },
  { href: "/shop", icon: ShoppingBag, label: "Cửa hàng" },
]

const navGroups = [
  { label: "", items: navPrimary },
  { label: "Cộng đồng", items: navSocial },
  { label: "Khác", items: navTools },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-2 px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <LogoMark />
          <span className="text-lg font-bold">OmniLingo</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {navGroups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-4" : ""}>
            {group.label && (
              <div className="px-4 pb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {group.label}
              </div>
            )}
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href + "/")) ||
                  (item.href !== "/dashboard" && pathname === item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all",
                        active
                          ? "bg-surface-high text-foreground shadow-ambient"
                          : "text-muted-foreground hover:bg-surface-low hover:text-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-colors",
                          active
                            ? "bg-gradient-primary text-primary-foreground"
                            : "bg-surface-low group-hover:bg-surface-high"
                        )}
                      >
                        <item.icon className="h-4 w-4" strokeWidth={2.2} />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="rounded-full bg-gradient-fluency px-2 py-0.5 text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="m-3 rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-ambient">
        <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
          Gói Plus
        </p>
        <p className="mt-1 text-lg font-bold leading-tight">
          Mở khoá mọi tính năng
        </p>
        <p className="mt-1 text-xs opacity-85">AI Tutor + Test Prep + 1-1</p>
        <Link
          href="/pricing"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary hover:bg-white/90"
        >
          Nâng cấp
        </Link>
      </div>
    </aside>
  )
}
