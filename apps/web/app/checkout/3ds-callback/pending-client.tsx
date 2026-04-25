"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Lock, Sparkles } from "lucide-react"

const POLL_INTERVAL_MS = 3000

interface PendingClientProps {
  sessionId: string
}

export default function ThreeDSPendingClient({ sessionId }: PendingClientProps) {
  const router = useRouter()

  // Continue polling on the client (RSC already polled 5x) by re-fetching the
  // route — the server will re-run resolveStatus and either redirect to
  // /checkout/success or render the failed view.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)

    const id = window.setInterval(() => {
      router.refresh()
    }, POLL_INTERVAL_MS)

    return () => {
      window.removeEventListener("beforeunload", handler)
      window.clearInterval(id)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col items-center justify-center px-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-hover">
          <Sparkles className="size-5" />
        </div>
        <span className="font-display text-xl font-bold">OmniLingo</span>
      </div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="mb-8 flex size-20 items-center justify-center rounded-full border-4 border-surface-high border-t-primary"
      />

      <h1 className="font-display text-2xl font-bold tracking-tight text-center text-balance">
        Đang xác nhận thanh toán…
      </h1>
      <p className="mt-2 max-w-md text-center text-muted-foreground text-pretty">
        Vui lòng không tắt trang này. Quá trình chỉ mất vài giây.
      </p>

      <div className="mt-8 h-1.5 w-64 overflow-hidden rounded-full bg-surface-high">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="h-full w-1/2 rounded-full bg-gradient-primary"
        />
      </div>

      <p className="mt-10 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3" />
        Giao dịch được bảo mật bởi 3D Secure · session {sessionId.slice(0, 8)}…
      </p>
    </div>
  )
}
