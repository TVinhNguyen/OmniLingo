"use client"

import { motion } from "motion/react"
import { Wrench, Clock, Sparkles, Twitter, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const UPDATES = [
  { title: "Hiệu năng trang luyện nói", done: true },
  { title: "Cập nhật hệ thống AI Tutor", done: true },
  { title: "Bộ lọc giáo viên mới", done: false },
  { title: "Kho từ vựng mở rộng", done: false },
]

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-surface-lowest shadow-ambient"
        >
          {/* Hero */}
          <div className="relative bg-gradient-primary p-12 text-center text-white">
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white blur-3xl" />
            </div>

            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white/20 backdrop-blur"
            >
              <Wrench className="h-14 w-14" />
            </motion.div>

            <h1 className="relative mt-6 text-4xl font-bold">
              Chúng tôi đang bảo trì
            </h1>
            <p className="relative mt-3 max-w-lg mx-auto text-white/85">
              OmniLingo đang được nâng cấp để mang lại trải nghiệm tốt hơn. Xin vui lòng quay lại sau ít phút.
            </p>

            <Badge className="relative mt-6 rounded-full bg-white/20 text-white hover:bg-white/25">
              <Clock className="mr-1 h-3 w-3" />
              Dự kiến hoàn tất: 14:30
            </Badge>
          </div>

          <div className="p-10">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="h-5 w-5 text-primary" />
              Những gì chúng tôi đang cập nhật
            </h2>

            <div className="mt-5 space-y-3">
              {UPDATES.map((update) => (
                <div
                  key={update.title}
                  className="flex items-center gap-3 rounded-2xl bg-surface-low p-3"
                >
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      update.done
                        ? "bg-success text-success-foreground"
                        : "bg-surface-lowest"
                    }`}
                  >
                    {update.done ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <div className="h-3 w-3 animate-pulse rounded-full bg-primary" />
                    )}
                  </div>
                  <span
                    className={`flex-1 text-sm ${
                      update.done ? "text-muted-foreground line-through" : "font-semibold"
                    }`}
                  >
                    {update.title}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button
                asChild
                variant="outline"
                className="h-12 gap-2 rounded-2xl"
              >
                <Link href="https://twitter.com" target="_blank">
                  <Twitter className="h-4 w-4" />
                  Theo dõi cập nhật
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 gap-2 rounded-2xl bg-gradient-primary shadow-hover"
              >
                <a href="mailto:support@omnilingo.io">
                  <Mail className="h-4 w-4" />
                  Nhận email thông báo
                </a>
              </Button>
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 p-4 text-center text-sm text-muted-foreground">
              Cảm ơn sự kiên nhẫn của bạn. Chúng tôi sẽ sớm trở lại với bạn!
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
