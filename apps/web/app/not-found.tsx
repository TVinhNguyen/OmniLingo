"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Home, Search, MessageCircle, ArrowLeft, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-surface-lowest shadow-ambient"
        >
          {/* Illustration */}
          <div className="relative bg-gradient-primary p-12 text-center text-white">
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white blur-3xl" />
            </div>

            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white/20 backdrop-blur"
            >
              <Compass className="h-14 w-14" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative mt-6 text-7xl font-bold leading-none"
            >
              404
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative mt-2 text-lg font-medium text-white/85"
            >
              Lost in Translation
            </motion.p>
          </div>

          <div className="p-10">
            <h2 className="text-3xl font-bold">Không tìm thấy trang</h2>
            <p className="mt-3 text-muted-foreground">
              Có vẻ bạn đã đi lạc trong hành trình ngôn ngữ. Trang này không tồn tại hoặc đã được
              di chuyển.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Link
                href="/"
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-ambient"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Home className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold">Trang chủ</span>
              </Link>
              <Link
                href="/help"
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-ambient"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Search className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold">Trợ giúp</span>
              </Link>
              <Link
                href="/contact"
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-ambient"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold">Liên hệ</span>
              </Link>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => window.history.back()}
                variant="ghost"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại trang trước
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
