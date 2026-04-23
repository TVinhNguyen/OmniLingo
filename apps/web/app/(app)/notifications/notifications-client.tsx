"use client"

import { useState, useTransition } from "react"
import { motion } from "motion/react"
import {
  Bell,
  Flame,
  Trophy,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Calendar,
  Gift,
  Info,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { markAllReadAction, markReadAction } from "./actions"
import type { AppNotification } from "@/lib/api/types"

const TYPE_ICON: Record<string, typeof Bell> = {
  streak:      Flame,
  message:     MessageSquare,
  achievement: Trophy,
  reminder:    Calendar,
  ai:          Sparkles,
  billing:     Gift,
  system:      Info,
}

const TYPE_GRADIENT: Record<string, string> = {
  streak:      "from-amber-400 to-orange-500",
  message:     "from-primary to-accent",
  achievement: "from-yellow-400 to-amber-500",
  reminder:    "from-primary to-primary-container",
  ai:          "from-accent to-tertiary",
  billing:     "from-destructive to-tertiary",
  system:      "from-slate-400 to-slate-600",
}

interface NotificationsClientProps {
  initialItems: AppNotification[]
  initialUnread: number
}

function NotifCard({ n, onMarkRead }: { n: AppNotification; onMarkRead: (id: string) => void }) {
  const Icon = TYPE_ICON[n.type] ?? Bell
  const gradient = TYPE_GRADIENT[n.type] ?? "from-primary to-accent"

  return (
    <Card
      onClick={() => { if (!n.read) onMarkRead(n.id) }}
      className={`group flex cursor-pointer items-start gap-4 rounded-3xl border border-border bg-surface-lowest p-5 shadow-ambient transition-all hover:shadow-hover ${
        !n.read ? "bg-surface-low/40" : ""
      }`}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-ambient`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold tracking-tight">{n.title}</h3>
          {!n.read && (
            <Badge className="shrink-0 rounded-full bg-primary text-[10px] text-primary-foreground">
              Mới
            </Badge>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.body}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {new Date(n.createdAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
        </p>
      </div>
    </Card>
  )
}

export default function NotificationsClient({ initialItems, initialUnread }: NotificationsClientProps) {
  const [items, setItems] = useState(initialItems)
  const [unread, setUnread] = useState(initialUnread)
  const [, startTransition] = useTransition()

  const handleMarkRead = (id: string) => {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
    setUnread((u) => Math.max(0, u - 1))
    startTransition(() => { markReadAction([id]) })
  }

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnread(0)
    startTransition(() => { markAllReadAction() })
  }

  const unreadItems = items.filter((n) => !n.read)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Bell className="h-7 w-7 text-primary" />
            Thông báo
          </h1>
          {unread > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              Bạn có <span className="font-semibold text-foreground">{unread} thông báo mới</span>
            </p>
          )}
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" className="rounded-full" onClick={handleMarkAllRead}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Đánh dấu đã đọc
          </Button>
        )}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="rounded-full bg-surface-low">
          <TabsTrigger value="all" className="rounded-full">Tất cả</TabsTrigger>
          <TabsTrigger value="unread" className="rounded-full">
            Chưa đọc {unread > 0 && `(${unread})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {items.length === 0 ? (
            <Card className="rounded-3xl p-8 text-center text-sm text-muted-foreground">
              Chưa có thông báo nào.
            </Card>
          ) : (
            <div className="space-y-3">
              {items.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <NotifCard n={n} onMarkRead={handleMarkRead} />
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          {unreadItems.length === 0 ? (
            <Card className="rounded-3xl p-8 text-center text-sm text-muted-foreground">
              Không có thông báo chưa đọc.
            </Card>
          ) : (
            <div className="space-y-3">
              {unreadItems.map((n) => (
                <NotifCard key={n.id} n={n} onMarkRead={handleMarkRead} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
