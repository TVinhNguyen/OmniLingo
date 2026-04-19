"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import {
  Star,
  Heart,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Globe2,
  Clock,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { FlagIcon } from "@/components/flag-icon"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const tutors = [
  {
    name: "Emma Johnson",
    country: "UK",
    flag: "gb",
    specialty: "IELTS, Business English",
    teaches: ["English"],
    languages: ["English (native)", "Spanish (B2)"],
    rating: 4.98,
    reviews: 1204,
    lessons: 5200,
    price: 18,
    tagline: "Certified IELTS examiner with 8 years of experience. Let's crack your 7.5!",
    avatar: "/tutor-emma.jpg",
    online: true,
    video: true,
  },
  {
    name: "Kenji Tanaka",
    country: "Japan",
    flag: "jp",
    specialty: "JLPT N5→N1, conversation",
    teaches: ["Japanese"],
    languages: ["Japanese (native)", "English (C1)"],
    rating: 4.95,
    reviews: 856,
    lessons: 3800,
    price: 22,
    tagline: "Patient Tokyo-based tutor. I make kanji feel less scary, promise.",
    avatar: "/tutor-kenji.jpg",
    online: false,
    video: true,
  },
  {
    name: "Sophie Laurent",
    country: "France",
    flag: "fr",
    specialty: "DELF, pronunciation, culture",
    teaches: ["French"],
    languages: ["French (native)", "English (C2)"],
    rating: 5.0,
    reviews: 642,
    lessons: 2900,
    price: 25,
    tagline: "Bonjour! Former university lecturer — grammar with a smile.",
    avatar: "/tutor-sophie.jpg",
    online: true,
    video: true,
  },
  {
    name: "Carlos Mendez",
    country: "Spain",
    flag: "es",
    specialty: "DELE, Latin slang, travel",
    teaches: ["Spanish"],
    languages: ["Spanish (native)", "Portuguese (C1)", "English (B2)"],
    rating: 4.92,
    reviews: 501,
    lessons: 2100,
    price: 16,
    tagline: "Hola! I teach real, everyday Spanish you'll actually use.",
    avatar: "/tutor-carlos.jpg",
    online: true,
    video: true,
  },
  {
    name: "Ming Chen",
    country: "China",
    flag: "cn",
    specialty: "HSK 1-6, business Chinese",
    teaches: ["Chinese"],
    languages: ["Chinese (native)", "English (C1)"],
    rating: 4.88,
    reviews: 389,
    lessons: 1700,
    price: 19,
    tagline: "Let's make Mandarin feel natural, character by character.",
    avatar: "/tutor-ming.jpg",
    online: false,
    video: true,
  },
  {
    name: "Anna Müller",
    country: "Germany",
    flag: "de",
    specialty: "Goethe-Zertifikat, grammar",
    teaches: ["German"],
    languages: ["German (native)", "English (C2)"],
    rating: 4.96,
    reviews: 740,
    lessons: 3100,
    price: 24,
    tagline: "Structured, precise, and always on time — like German grammar itself.",
    avatar: "/tutor-anna.jpg",
    online: true,
    video: true,
  },
]

export default function TutorsPage() {
  const [q, setQ] = useState("")
  const filtered = tutors.filter(
    (t) =>
      !q ||
      t.name.toLowerCase().includes(q.toLowerCase()) ||
      t.teaches.some((l) => l.toLowerCase().includes(q.toLowerCase())),
  )

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Badge variant="secondary" className="mb-2 rounded-full">
            <Globe2 className="mr-1 size-3" />
            Live Tutors
          </Badge>
          <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            Learn from native speakers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Book 1-on-1 video lessons with vetted tutors from around the world.
          </p>
        </div>
        <Button variant="outline" className="rounded-full bg-transparent">
          <SlidersHorizontal className="mr-2 size-4" />
          Filters
        </Button>
      </div>

      {/* Filters bar */}
      <Card className="mb-8 border-border/60 bg-card/80 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_180px]">
          <InputGroup>
            <InputGroupAddon>
              <Search className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tutors by name or language"
            />
          </InputGroup>
          <Select defaultValue="any">
            <SelectTrigger>
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any language</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="any">
            <SelectTrigger>
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any price</SelectItem>
              <SelectItem value="low">Under $15/hr</SelectItem>
              <SelectItem value="mid">$15-25/hr</SelectItem>
              <SelectItem value="high">Over $25/hr</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="any">
            <SelectTrigger>
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any time</SelectItem>
              <SelectItem value="now">Available now</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tutor cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="group overflow-hidden border-border/60 bg-card/80 transition hover:-translate-y-1 hover:shadow-soft">
              <div className="relative aspect-[4/3] overflow-hidden bg-accent">
                <Image
                  src={t.avatar || "/placeholder.svg"}
                  alt={t.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <button className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/80 backdrop-blur transition hover:bg-background">
                  <Heart className="size-4 text-foreground" />
                </button>
                {t.online && (
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-success px-2 py-1 text-xs font-semibold text-white">
                    <span className="size-1.5 rounded-full bg-white" />
                    Online
                  </div>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur">
                  <FlagIcon code={t.flag} className="size-3" />
                  {t.country}
                </div>
              </div>
              <div className="p-5">
                <div className="mb-1 flex items-start justify-between">
                  <h3 className="font-serif text-lg font-semibold">{t.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="size-4 fill-warning text-warning" />
                    <span className="font-semibold">{t.rating}</span>
                    <span className="text-muted-foreground">({t.reviews})</span>
                  </div>
                </div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-primary">
                  Teaches {t.teaches.join(", ")}
                </p>
                <p className="mb-4 text-sm text-muted-foreground">{t.tagline}</p>

                <div className="mb-4 flex flex-wrap gap-1">
                  {t.languages.slice(0, 2).map((l) => (
                    <Badge key={l} variant="outline" className="rounded-full text-xs">
                      {l}
                    </Badge>
                  ))}
                </div>

                <div className="mb-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5" />
                    {t.lessons.toLocaleString()} lessons
                  </div>
                  <div>
                    <span className="font-serif text-xl font-bold text-foreground">${t.price}</span>
                    <span className="text-xs text-muted-foreground"> / 50 min</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-full bg-transparent">
                    <MessageCircle className="mr-1.5 size-3.5" />
                    Message
                  </Button>
                  <Button size="sm" className="flex-1 rounded-full" asChild>
                    <Link href="/tutors/emma-johnson">Book trial</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
