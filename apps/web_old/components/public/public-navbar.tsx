"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Menu, X, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { href: "/courses", label: "Khóa học" },
  { href: "/#certifications", label: "Chứng chỉ" },
  { href: "/pricing", label: "Bảng giá" },
  { href: "/about", label: "Về chúng tôi" },
  { href: "/blog", label: "Blog" },
]

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <div
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-2 transition-all duration-300",
            scrolled ? "glass shadow-ambient" : "bg-transparent"
          )}
        >
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
            <span className="text-lg font-bold tracking-tight">OmniLingo</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-low hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href="/sign-in">Đăng nhập</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-gradient-primary text-primary-foreground shadow-ambient hover:shadow-hover transition-shadow"
            >
              <Link href="/sign-up">Bắt đầu miễn phí</Link>
            </Button>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-low md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 overflow-hidden rounded-2xl bg-surface-lowest p-4 shadow-ambient md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-low"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2 pt-2">
                <ThemeToggle className="mr-auto" />
                <Button asChild variant="ghost" size="sm" className="flex-1 rounded-full">
                  <Link href="/sign-in">Đăng nhập</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="flex-1 rounded-full bg-gradient-primary text-primary-foreground"
                >
                  <Link href="/sign-up">Bắt đầu</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-ambient",
        className
      )}
    >
      <Languages className="h-5 w-5" strokeWidth={2.5} />
    </span>
  )
}
