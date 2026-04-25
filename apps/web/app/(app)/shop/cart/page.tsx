"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  Gem,
  ShoppingCart,
  Trash2,
  ChevronLeft,
  Plus,
  Minus,
  Shield,
  Zap,
  Flame,
  Tag,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

type CartItem = {
  id: number
  name: string
  desc: string
  icon: typeof Shield
  color: string
  price: number
  quantity: number
}

const initialItems: CartItem[] = [
  {
    id: 1,
    name: "Streak Freeze Pack (3)",
    desc: "Bảo vệ streak khi bỏ lỡ ngày học",
    icon: Shield,
    color: "from-primary to-accent",
    price: 450,
    quantity: 1,
  },
  {
    id: 2,
    name: "Double XP (24h)",
    desc: "Nhân đôi XP trong 24 giờ",
    icon: Zap,
    color: "from-warning to-accent",
    price: 300,
    quantity: 2,
  },
  {
    id: 3,
    name: "Heart Refill",
    desc: "Hồi đầy 5 trái tim ngay lập tức",
    icon: Flame,
    color: "from-accent to-primary",
    price: 200,
    quantity: 1,
  },
  {
    id: 4,
    name: "XP Boost Week",
    desc: "+50% XP trong 7 ngày",
    icon: Zap,
    color: "from-success to-primary",
    price: 800,
    quantity: 1,
  },
]

const userGems = 3500

export default function ShopCartPage() {
  const [items, setItems] = useState(initialItems)
  const [coupon, setCoupon] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const total = subtotal - discount
  const canAfford = userGems >= total

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0),
    )
  }

  const remove = (id: number) => setItems(items.filter((i) => i.id !== id))

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link
          href="/shop"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Về shop
        </Link>
        <div className="rounded-3xl bg-surface-lowest p-12 text-center shadow-ambient">
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5">
            <ShoppingCart className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Giỏ hàng trống</h2>
          <p className="mt-2 text-muted-foreground">
            Khám phá shop và tìm những item bạn thích!
          </p>
          <Button asChild className="mt-6 rounded-xl bg-primary shadow-ambient">
            <Link href="/shop">Đi tới shop</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/shop"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Tiếp tục mua sắm
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <h1 className="font-sans text-3xl font-bold text-balance">Giỏ hàng</h1>
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          {items.length} items
        </Badge>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 rounded-3xl bg-surface-lowest p-4 shadow-ambient transition-all hover:shadow-hover"
            >
              <div
                className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${item.color}`}
              >
                <item.icon className="h-7 w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/shop/${item.id}`} className="font-semibold hover:text-primary">
                  {item.name}
                </Link>
                <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{item.desc}</p>
                <div className="mt-2 flex items-center gap-1 text-sm font-medium text-accent">
                  <Gem className="h-3.5 w-3.5" />
                  {item.price} gems / pack
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 rounded-xl bg-surface-low p-1">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="grid h-7 w-7 place-items-center rounded-lg hover:bg-surface-lowest"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="grid h-7 w-7 place-items-center rounded-lg hover:bg-surface-lowest"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  onClick={() => remove(item.id)}
                  className="text-xs text-destructive hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl bg-surface-lowest p-6 shadow-hover"
          >
            <h2 className="text-lg font-semibold">Tóm tắt đơn hàng</h2>

            {/* Coupon */}
            <div className="mt-4">
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Mã giảm giá"
                  className="h-11 rounded-xl pl-10"
                  disabled={couponApplied}
                />
                {!couponApplied ? (
                  <button
                    onClick={() => coupon && setCouponApplied(true)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                  >
                    Áp dụng
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCouponApplied(false)
                      setCoupon("")
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-destructive"
                  >
                    Xóa
                  </button>
                )}
              </div>
              {couponApplied && (
                <p className="mt-2 text-xs text-success">
                  ✓ Coupon &ldquo;{coupon}&rdquo; áp dụng - giảm 10%
                </p>
              )}
            </div>

            {/* Lines */}
            <div className="mt-5 space-y-2 border-y border-border py-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="tabular-nums">{subtotal.toLocaleString()} gems</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Giảm giá (10%)</span>
                  <span className="tabular-nums">-{discount.toLocaleString()} gems</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí giao dịch</span>
                <span className="text-success">Miễn phí</span>
              </div>
            </div>
            <div className="flex items-baseline justify-between pt-4">
              <span className="font-semibold">Tổng cộng</span>
              <div className="flex items-baseline gap-1">
                <Gem className="h-5 w-5 self-center text-accent" />
                <span className="text-2xl font-bold tabular-nums">
                  {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Balance */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-low p-3 text-sm">
              <span className="text-muted-foreground">Số gems hiện có</span>
              <span className="flex items-center gap-1 font-semibold">
                <Gem className="h-3.5 w-3.5 text-accent" />
                {userGems.toLocaleString()}
              </span>
            </div>

            {/* Actions */}
            <Button
              size="lg"
              disabled={!canAfford}
              className="mt-4 w-full gap-2 rounded-xl bg-primary shadow-hover"
            >
              Thanh toán
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button asChild variant="ghost" className="mt-2 w-full rounded-xl">
              <Link href="/shop">Tiếp tục mua sắm</Link>
            </Button>

            {!canAfford && (
              <div className="mt-3 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
                Bạn cần thêm {(total - userGems).toLocaleString()} gems để thanh toán.
              </div>
            )}
          </motion.div>
        </aside>
      </div>
    </div>
  )
}
