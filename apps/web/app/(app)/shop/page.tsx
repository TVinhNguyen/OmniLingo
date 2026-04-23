"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Gem, Flame, Heart, Snowflake, Sparkles, Zap, Gift, ShieldCheck, ShoppingCart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const powerUps = [
  {
    icon: Snowflake,
    name: "Streak freeze",
    description: "Protect your streak for one missed day.",
    price: 200,
    owned: 2,
    color: "from-sky-200/40 to-sky-100/20 text-sky-700",
  },
  {
    icon: Flame,
    name: "Double XP",
    description: "2x XP boost for the next 30 minutes.",
    price: 350,
    owned: 0,
    color: "from-destructive/20 to-destructive/5 text-destructive",
  },
  {
    icon: Heart,
    name: "Extra hearts",
    description: "Refill all hearts instantly.",
    price: 150,
    owned: 3,
    color: "from-primary/20 to-primary/5 text-primary",
  },
  {
    icon: Zap,
    name: "XP pack",
    description: "+500 XP to spend on shop items.",
    price: 400,
    owned: 0,
    color: "from-warning/20 to-warning/5 text-warning",
  },
]

const cosmetics = [
  { icon: Sparkles, name: "Starfield avatar frame", price: 800, tag: "Premium" },
  { icon: Gift, name: "Holiday reindeer outfit", price: 600, tag: "Seasonal" },
  { icon: ShieldCheck, name: "Scholar crest theme", price: 1200, tag: "Exclusive" },
]

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Badge variant="secondary" className="mb-2 rounded-full">
            <Gem className="mr-1 size-3" />
            Shop
          </Badge>
          <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            Power up your learning
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Spend XP on boosters, lives and cosmetics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Card className="flex items-center gap-3 border-border/60 bg-card/80 px-4 py-3">
            <Gem className="size-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Balance</div>
              <div className="font-serif text-xl font-bold">2,480 XP</div>
            </div>
          </Card>
          <Button asChild className="relative rounded-full">
            <Link href="/shop/cart">
              <ShoppingCart className="mr-1.5 size-4" />
              Giỏ hàng
              <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/95 px-1.5 text-xs font-bold text-primary">
                2
              </span>
            </Link>
          </Button>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 font-serif text-xl font-semibold">Power-ups</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {powerUps.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={`relative overflow-hidden border-border/60 bg-gradient-to-br ${p.color} p-5 transition hover:-translate-y-1 hover:shadow-soft`}
              >
                {p.owned > 0 && (
                  <Badge className="absolute right-3 top-3 rounded-full">Owned x{p.owned}</Badge>
                )}
                <p.icon className="mb-4 size-8" />
                <h3 className="font-serif text-lg font-semibold text-foreground">{p.name}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{p.description}</p>
                <Button className="w-full rounded-full">
                  <Gem className="mr-1.5 size-3.5" />
                  {p.price} XP
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-serif text-xl font-semibold">Cosmetics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cosmetics.map((c, i) => (
            <Card
              key={c.name}
              data-aos="fade-up"
              data-aos-delay={i * 50}
              className="group overflow-hidden border-border/60 bg-card/80 p-5 transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="mb-4 flex h-40 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent">
                <c.icon className="size-14 text-primary transition group-hover:scale-110" />
              </div>
              <Badge variant="outline" className="mb-2 rounded-full text-xs">
                {c.tag}
              </Badge>
              <h3 className="font-serif text-lg font-semibold">{c.name}</h3>
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1 font-serif text-lg font-bold">
                  <Gem className="size-4 text-primary" />
                  {c.price} XP
                </span>
                <Button size="sm" variant="outline" className="rounded-full bg-transparent">
                  Preview
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-xl font-semibold">Upgrade to Premium</h2>
        <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-primary/15 via-primary/5 to-accent p-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <Badge className="mb-2 rounded-full">Premium</Badge>
              <h3 className="font-serif text-2xl font-semibold">Unlimited hearts & ad-free learning</h3>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Join thousands of serious learners. Premium gives you unlimited hearts, full AI tutor
                access, offline lessons and personalized coaching.
              </p>
            </div>
            <Button size="lg" className="rounded-full">
              Start 7-day free trial
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}
