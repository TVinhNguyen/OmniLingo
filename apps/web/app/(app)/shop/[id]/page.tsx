"use client"

import { use, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  Gem,
  ShoppingCart,
  Zap,
  Star,
  ChevronLeft,
  Plus,
  Minus,
  Sparkles,
  Shield,
  Flame,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const product = {
  name: "Streak Freeze Pack",
  description:
    "Bảo vệ streak của bạn! Một Streak Freeze tự động kích hoạt khi bạn bỏ lỡ 1 ngày học, giữ chuỗi streak không bị đứt.",
  category: "Power-up",
  rarity: "Rare",
  price: 450,
  quantity: 3,
  bonus: 20,
  rating: 4.8,
  reviews: 2341,
  color: "from-primary to-accent",
  icon: Shield,
  effects: [
    "Tự động kích hoạt khi bỏ lỡ ngày học",
    "Giữ streak không bị đứt",
    "Có thể stack tối đa 5 cái",
    "Reset mỗi tuần nếu đầy",
  ],
  howToUse: [
    "Mua pack 3 Streak Freeze",
    "Tự động thêm vào inventory của bạn",
    "Không cần activate thủ công",
    "Khi bỏ lỡ, sẽ tự dùng 1 cái",
  ],
  reviewsList: [
    {
      name: "Emma Wilson",
      avatar: "EW",
      rating: 5,
      text: "Cứu cả streak 180 ngày của tôi khi đi du lịch!",
      date: "2 tuần trước",
    },
    {
      name: "Kenji Tanaka",
      avatar: "KT",
      rating: 5,
      text: "Must-have cho người bận rộn. Worth every gem.",
      date: "1 tháng trước",
    },
    {
      name: "Sophie Dubois",
      avatar: "SD",
      rating: 4,
      text: "Rất tiện, mong có pack lớn hơn.",
      date: "1 tháng trước",
    },
  ],
}

const userGems = 1200

export default function ShopItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [quantity, setQuantity] = useState(1)
  const totalPrice = product.price * quantity
  const canAfford = userGems >= totalPrice

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/shop"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Về shop
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <div
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${product.color} p-8 shadow-hover`}
          >
            <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
            <div className="relative flex aspect-square items-center justify-center">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="grid h-48 w-48 place-items-center rounded-3xl bg-white/20 backdrop-blur-xl"
              >
                <product.icon className="h-24 w-24 text-white" />
              </motion.div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                className="aspect-square rounded-xl bg-gradient-to-br from-surface-low to-surface p-3 hover:ring-2 hover:ring-primary"
              >
                <div
                  className={`h-full w-full rounded-lg bg-gradient-to-br ${product.color} opacity-${i === 1 ? "100" : "50"}`}
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                {product.category}
              </Badge>
              <Badge className="rounded-full bg-warning/20 text-warning border-warning/20">
                <Sparkles className="mr-1 h-3 w-3" />
                {product.rarity}
              </Badge>
            </div>
            <h1 className="mt-3 font-sans text-3xl font-bold text-balance lg:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-warning text-warning"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
              <span className="ml-1 font-semibold">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviews.toLocaleString()} reviews)
            </span>
          </div>

          {/* Price card */}
          <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
            <div className="mb-4 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <Gem className="h-6 w-6 text-accent" />
                  <span className="text-3xl font-bold tabular-nums">{totalPrice}</span>
                  <span className="text-sm text-muted-foreground">gems</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Bao gồm {product.quantity * quantity} Streak Freeze
                </div>
              </div>
              {product.bonus > 0 && (
                <Badge className="bg-success text-white">+{product.bonus}% bonus</Badge>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium">Số lượng</span>
              <div className="flex items-center gap-3 rounded-xl bg-surface-low p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="grid h-8 w-8 place-items-center rounded-lg hover:bg-surface-lowest"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center font-semibold tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="grid h-8 w-8 place-items-center rounded-lg hover:bg-surface-lowest"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Balance */}
            <div className="mb-4 flex items-center justify-between rounded-xl bg-accent/5 p-3">
              <span className="text-xs text-muted-foreground">Số gems hiện có</span>
              <div className="flex items-center gap-1">
                <Gem className="h-4 w-4 text-accent" />
                <span className="font-bold tabular-nums">{userGems}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                size="lg"
                disabled={!canAfford}
                className="w-full rounded-xl bg-primary shadow-hover"
              >
                <Zap className="mr-2 h-4 w-4" />
                {canAfford ? "Mua ngay" : "Không đủ gems"}
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full rounded-xl bg-transparent">
                <Link href="/shop/cart">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Thêm vào giỏ
                </Link>
              </Button>
            </div>

            {!canAfford && (
              <Button variant="ghost" className="mt-2 w-full rounded-xl text-xs">
                Mua thêm gems →
              </Button>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3 rounded-xl bg-surface-low p-1">
              <TabsTrigger value="details" className="rounded-lg">
                Chi tiết
              </TabsTrigger>
              <TabsTrigger value="how-to" className="rounded-lg">
                Cách dùng
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg">
                Đánh giá
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4 space-y-3">
              <div className="rounded-2xl bg-surface-lowest p-5 shadow-ambient">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Hiệu ứng
                </h3>
                <ul className="space-y-2">
                  {product.effects.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="how-to" className="mt-4">
              <div className="rounded-2xl bg-surface-lowest p-5 shadow-ambient">
                <ol className="space-y-3">
                  {product.howToUse.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4 space-y-3">
              {product.reviewsList.map((r, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-surface-lowest p-4 shadow-ambient"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-white">
                      {r.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{r.name}</div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star
                            key={s}
                            className={`h-3 w-3 ${
                              s < r.rating ? "fill-warning text-warning" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
