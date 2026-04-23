"use client"

import Link from "next/link"
import { motion } from "motion/react"
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
  Gift,
  Users,
} from "lucide-react"

const sections = [
  {
    title: "Tài khoản",
    items: [
      {
        href: "/settings/account",
        label: "Tài khoản",
        description: "Email, mật khẩu, xoá tài khoản",
        icon: User,
      },
      {
        href: "/settings/connected-accounts",
        label: "Tài khoản liên kết",
        description: "Google, Apple, Facebook, GitHub",
        icon: Link2,
      },
      {
        href: "/settings/security",
        label: "Bảo mật",
        description: "Mật khẩu, 2FA, phiên đăng nhập",
        icon: Lock,
      },
    ],
  },
  {
    title: "Học tập",
    items: [
      {
        href: "/settings/learning",
        label: "Học tập",
        description: "Mục tiêu, nhắc nhở, âm thanh",
        icon: GraduationCap,
      },
      {
        href: "/settings/languages",
        label: "Ngôn ngữ",
        description: "Ngôn ngữ học, ngôn ngữ giao diện",
        icon: Languages,
      },
      {
        href: "/settings/notifications",
        label: "Thông báo",
        description: "Push, email, in-app",
        icon: Bell,
      },
    ],
  },
  {
    title: "Riêng tư & Trợ năng",
    items: [
      {
        href: "/settings/privacy",
        label: "Quyền riêng tư",
        description: "Hiển thị hồ sơ, chặn, dữ liệu",
        icon: Shield,
      },
      {
        href: "/settings/accessibility",
        label: "Trợ năng & Giao diện",
        description: "Font, theme, giảm chuyển động",
        icon: Eye,
      },
      {
        href: "/settings/data-export",
        label: "Xuất dữ liệu",
        description: "Tải toàn bộ dữ liệu học của bạn",
        icon: Download,
      },
    ],
  },
  {
    title: "Thanh toán",
    items: [
      {
        href: "/settings/subscription",
        label: "Gói đăng ký",
        description: "Premium, so sánh gói",
        icon: Crown,
      },
      {
        href: "/settings/billing",
        label: "Thanh toán & Hoá đơn",
        description: "Thẻ, lịch sử, hoá đơn VAT",
        icon: CreditCard,
      },
      {
        href: "/billing/gift",
        label: "Tặng Premium",
        description: "Gửi tháng Premium cho bạn bè",
        icon: Gift,
      },
      {
        href: "/billing/referral",
        label: "Giới thiệu bạn",
        description: "Nhận thưởng khi mời bạn tham gia",
        icon: Users,
      },
    ],
  },
]

export default function SettingsHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Cài đặt</h1>
        <p className="mt-2 text-muted-foreground">
          Tuỳ chỉnh trải nghiệm OmniLingo theo phong cách học tập của bạn.
        </p>
      </motion.header>

      <div className="space-y-10">
        {sections.map((section, si) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.05 }}
          >
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              {section.title}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-4 rounded-3xl bg-surface-lowest p-5 shadow-ambient transition-all hover:-translate-y-0.5 hover:shadow-hover"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold">{item.label}</div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  )
}
