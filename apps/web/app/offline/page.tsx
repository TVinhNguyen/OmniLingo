"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  WifiOff,
  Wifi,
  RefreshCw,
  Download,
  BookOpen,
  Headphones,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const OFFLINE_AVAILABLE = [
  {
    icon: BookOpen,
    title: "Flashcards đã tải",
    count: "12 bộ",
    color: "from-[#702ae1] to-[#b48bff]",
  },
  {
    icon: Headphones,
    title: "Bài nghe đã lưu",
    count: "5 bài",
    color: "from-[#5352a5] to-[#a19ff9]",
  },
  {
    icon: Download,
    title: "Ghi chú của bạn",
    count: "Đồng bộ khi online",
    color: "from-[#2e9e6a] to-[#5cc29a]",
  },
]

export default function OfflinePage() {
  const [online, setOnline] = useState(false)
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    const updateStatus = () => setOnline(navigator.onLine)
    updateStatus()
    window.addEventListener("online", updateStatus)
    window.addEventListener("offline", updateStatus)
    return () => {
      window.removeEventListener("online", updateStatus)
      window.removeEventListener("offline", updateStatus)
    }
  }, [])

  const retry = () => {
    setRetrying(true)
    setTimeout(() => {
      setRetrying(false)
      if (navigator.onLine) {
        window.location.href = "/dashboard"
      }
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-surface-lowest shadow-ambient"
        >
          {/* Hero */}
          <div
            className={`relative p-12 text-center text-white transition-colors ${
              online ? "bg-gradient-to-br from-success to-success/70" : "bg-gradient-primary"
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white/20 backdrop-blur"
            >
              {online ? <Wifi className="h-14 w-14" /> : <WifiOff className="h-14 w-14" />}
            </motion.div>

            <h1 className="mt-6 text-4xl font-bold">
              {online ? "Kết nối đã khôi phục!" : "Bạn đang offline"}
            </h1>
            <p className="mt-3 max-w-md mx-auto text-white/85">
              {online
                ? "Internet đã hoạt động trở lại. Nhấn nút bên dưới để tiếp tục."
                : "Không có kết nối internet. Bạn vẫn có thể truy cập các nội dung đã tải về."}
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <div className={`h-2 w-2 rounded-full ${online ? "bg-white" : "bg-white/40 animate-pulse"}`} />
              <div className={`h-2 w-2 rounded-full ${online ? "bg-white" : "bg-white/40 animate-pulse [animation-delay:0.2s]"}`} />
              <div className={`h-2 w-2 rounded-full ${online ? "bg-white" : "bg-white/40 animate-pulse [animation-delay:0.4s]"}`} />
            </div>
          </div>

          <div className="p-10">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={retry}
                disabled={retrying}
                className="h-12 flex-1 gap-2 rounded-2xl bg-gradient-primary font-semibold shadow-hover"
              >
                <RefreshCw className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`} />
                {retrying ? "Đang thử lại..." : online ? "Tiếp tục học" : "Thử kết nối lại"}
              </Button>
              {online && (
                <Button asChild variant="outline" className="h-12 flex-1 rounded-2xl">
                  <Link href="/dashboard">Về Dashboard</Link>
                </Button>
              )}
            </div>

            <div className="mt-8">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Download className="h-5 w-5 text-primary" />
                Nội dung có sẵn offline
              </h2>
              <div className="mt-4 space-y-3">
                {OFFLINE_AVAILABLE.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-4 rounded-2xl bg-surface-low p-4"
                  >
                    <div
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white`}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.count}</div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Mẹo: </p>
              <p className="mt-1">
                Tải trước flashcards và bài học yêu thích trong phần Cài đặt để luôn có thể học dù
                không có internet.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
