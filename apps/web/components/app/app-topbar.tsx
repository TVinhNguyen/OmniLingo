"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Bell,
  Flame,
  Menu,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  CreditCard,
  MessageCircle,
  Sun,
  Moon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { FlagIcon, flagMap, type LangCode } from "@/components/flag-icon"
import { AppMobileMenu } from "./app-mobile-menu"
import { getUnreadNotificationCountAction } from "@/app/(app)/notifications/actions"

const UNREAD_POLL_INTERVAL_MS = 30_000

export function AppTopbar() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [lang, setLang] = useState<LangCode>("ja")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    setMounted(true)
    const isDarkMode = localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
    setIsDark(isDarkMode)
  }, [])

  useEffect(() => {
    let cancelled = false
    const tick = async () => {
      const n = await getUnreadNotificationCountAction()
      if (!cancelled) setUnreadCount(n)
    }
    tick()
    const id = window.setInterval(tick, UNREAD_POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [])

  function search() {
    if (searchValue.trim()) router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`)
  }

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    setIsDark(!isDark)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-surface-low/80 backdrop-blur-sm px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Search bar */}
        <div className="hidden flex-1 items-center gap-2 md:flex lg:max-w-md">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Tìm kiếm..."
              className="w-full rounded-full bg-surface-lowest px-3 py-2 pl-9 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Flame streak */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden rounded-full text-xs md:flex gap-1"
          >
            <Flame className="h-4 w-4 text-accent" />
            <span>142</span>
          </Button>

          {/* Notifications */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative rounded-full bg-surface-lowest shadow-ambient"
          >
            <Link
              href="/notifications"
              aria-label={
                unreadCount > 0
                  ? `Thông báo (${unreadCount} chưa đọc)`
                  : "Thông báo"
              }
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-accent-foreground">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Dark mode toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full bg-surface-lowest shadow-ambient"
              title="Toggle dark mode"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-surface-lowest shadow-ambient"
              >
                <FlagIcon code={lang} className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
              {Object.entries(flagMap).map(([code, flag]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => setLang(code as LangCode)}
                  className="cursor-pointer"
                >
                  <span className="mr-2 text-lg">{typeof flag === 'string' ? flag : flag.native}</span>
                  <span>{code.toUpperCase()}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full gap-2 bg-surface-lowest shadow-ambient"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-primary" />
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/subscription" className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Gói cước</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/messages" className="cursor-pointer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>Tin nhắn</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <AppMobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
