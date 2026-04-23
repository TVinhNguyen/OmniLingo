"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { RefreshCw, Home, MessageCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] App error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-surface-lowest shadow-ambient"
        >
          {/* Illustration */}
          <div className="relative bg-gradient-to-br from-[#983772] to-[#d56ba6] p-12 text-center text-white">
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white blur-3xl" />
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white/20 backdrop-blur"
            >
              <AlertTriangle className="h-14 w-14" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative mt-6 text-7xl font-bold leading-none"
            >
              500
            </motion.h1>
            <p className="relative mt-2 text-lg font-medium text-white/85">
              Something went wrong
            </p>
          </div>

          <div className="p-10">
            <h2 className="text-3xl font-bold">Đã xảy ra lỗi</h2>
            <p className="mt-3 text-muted-foreground">
              Chúng tôi gặp sự cố khi xử lý yêu cầu của bạn. Đội kỹ thuật đã được thông báo và đang
              kiểm tra.
            </p>

            {error.digest && (
              <div className="mt-4 rounded-xl bg-surface-low p-3 font-mono text-xs text-muted-foreground">
                <span className="opacity-60">Error ID: </span>
                {error.digest}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={reset}
                className="h-12 flex-1 gap-2 rounded-2xl bg-gradient-primary font-semibold shadow-hover"
              >
                <RefreshCw className="h-4 w-4" />
                Thử lại
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 flex-1 gap-2 rounded-2xl"
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Về trang chủ
                </Link>
              </Button>
            </div>

            <div className="mt-6 rounded-2xl bg-surface-low p-4 text-center text-sm">
              <p className="text-muted-foreground">
                Vấn đề vẫn tiếp diễn?{" "}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Liên hệ hỗ trợ
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
