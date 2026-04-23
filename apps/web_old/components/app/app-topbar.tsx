"use client"

import Link from "next/link"
import { useState } from "react"
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
import { ThemeToggle } from "@/components/theme-toggle"

export function AppTopbar() {
  const [lang, setLang] = useState<LangCode>("ja")
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl">
        <div className="flex h-full items-center gap-3 px-4 lg:px-8">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-low lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full bg-surface-lowest px-3 py-2 text-sm font-semibold shadow-ambient transition-all hover:shadow-hover">
                <FlagIcon code={lang} size={22} />
                <span className="hidden sm:inline">{flagMap[lang].native}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="rounded-2xl shadow-raise">
              <DropdownMenuLabel>Ngôn ngữ đang học</DropdownMenuLabel>
              {(["en", "ja", "zh", "ko", "fr", "de", "es"] as LangCode[]).map(
                (code) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => setLang(code)}
                    className="gap-2"
                  >
                    <FlagIcon code={code} size={20} />
                    <span className="flex-1">{flagMap[code].name}</span>
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search */}
          <div className="hidden max-w-md flex-1 md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Tìm bài học, từ vựng, giáo viên..."
                className="w-full rounded-full bg-surface-lowest py-2.5 pl-11 pr-4 text-sm shadow-ambient outline-none placeholder:text-muted-foreground focus:shadow-hover"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Streak */}
            <div className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700 sm:flex">
              <Flame className="h-4 w-4 fill-current" />
              <span>12</span>
            </div>

            {/* XP */}
            <div className="hidden items-center gap-1.5 rounded-full bg-accent-container px-3 py-1.5 text-sm font-bold text-on-accent-container md:flex">
              <span className="text-base leading-none">⚡</span>
              <span>240</span>
            </div>

            {/* Gems */}
            <div className="hidden items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1.5 text-sm font-bold text-cyan-700 md:flex">
              <span className="text-base leading-none">💎</span>
              <span>520</span>
            </div>

            {/* Messages */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative hidden rounded-full bg-surface-lowest shadow-ambient sm:inline-flex"
            >
              <Link href="/messages" aria-label="Tin nhắn">
                <MessageCircle className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
              </Link>
            </Button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative rounded-full bg-surface-lowest shadow-ambient"
            >
              <Link href="/notifications" aria-label="Thông báo">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
              </Link>
            </Button>

            {/* Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground shadow-ambient">
                  MA
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl shadow-raise w-56">
                <DropdownMenuLabel>
                  <p className="font-semibold">Minh Anh</p>
                  <p className="text-xs font-normal text-muted-foreground">
                    minh@omnilingo.app
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Hồ sơ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Cài đặt
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/subscription">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Gói đăng ký
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <AppMobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
