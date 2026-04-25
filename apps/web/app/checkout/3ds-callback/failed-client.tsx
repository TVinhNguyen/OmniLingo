"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { XCircle, RefreshCw, Tags, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FailedClientProps {
  errorMessage: string | null
}

export default function ThreeDSFailedClient({ errorMessage }: FailedClientProps) {
  return (
    <div className="min-h-screen bg-gradient-soft py-16 px-4">
      <div className="mx-auto max-w-lg space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="size-12 text-destructive" strokeWidth={2} />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-balance">
            Xác thực 3D Secure thất bại
          </h1>
          <p className="mt-2 text-muted-foreground text-pretty">
            Giao dịch chưa được hoàn tất. Bạn chưa bị tính phí.
          </p>
          {errorMessage && (
            <Card className="mt-4 w-full border-destructive/30 bg-destructive/5">
              <CardContent className="p-3 text-sm text-destructive">{errorMessage}</CardContent>
            </Card>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <Button asChild size="lg" className="w-full h-12 bg-gradient-primary">
            <Link href="/pricing">
              <RefreshCw className="mr-2 size-4" /> Thử lại với gói khác
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="flex-1 h-11" asChild>
              <Link href="/pricing">
                <Tags className="mr-2 size-4" /> Xem các gói
              </Link>
            </Button>
            <Button variant="ghost" size="lg" className="flex-1 h-11" asChild>
              <Link href="/contact">
                <HelpCircle className="mr-2 size-4" /> Hỗ trợ
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
