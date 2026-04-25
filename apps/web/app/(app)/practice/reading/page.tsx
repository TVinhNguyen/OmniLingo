"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { BookOpen, Clock, Type, CheckCircle2, TrendingUp, Search, Filter, Star, Zap } from "lucide-react"
import { PracticeHeader } from "@/components/app/practice-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

type ReadingItem = {
  id: string
  title: string
  excerpt: string
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
  duration: string
  words: number
  category: string
  difficulty: 1 | 2 | 3 | 4 | 5
  icon: string
}

const articles: ReadingItem[] = [
  {
    id: "urban-gardens",
    title: "The rise of urban gardens in Tokyo",
    excerpt: "How cities are transforming concrete into green spaces",
    level: "B1",
    duration: "3 min",
    words: 312,
    category: "lifestyle",
    difficulty: 3,
    icon: "🌱",
  },
  {
    id: "coffee-history",
    title: "A brief history of coffee",
    excerpt: "From Ethiopian highlands to global commodity",
    level: "B2",
    duration: "5 min",
    words: 487,
    category: "history",
    difficulty: 3,
    icon: "☕",
  },
  {
    id: "remote-work",
    title: "The future of remote work",
    excerpt: "Trends shaping the workplace of tomorrow",
    level: "B1",
    duration: "4 min",
    words: 356,
    category: "technology",
    difficulty: 3,
    icon: "💻",
  },
  {
    id: "ocean-plastic",
    title: "Ocean plastic pollution crisis",
    excerpt: "Understanding the impact and solutions",
    level: "C1",
    duration: "7 min",
    words: 621,
    category: "environment",
    difficulty: 5,
    icon: "🌊",
  },
  {
    id: "ai-future",
    title: "Artificial intelligence and society",
    excerpt: "Benefits and challenges ahead",
    level: "C1",
    duration: "8 min",
    words: 745,
    category: "technology",
    difficulty: 5,
    icon: "🤖",
  },
  {
    id: "mental-health",
    title: "Mental health in the digital age",
    excerpt: "How technology affects our wellbeing",
    level: "B2",
    duration: "6 min",
    words: 534,
    category: "health",
    difficulty: 4,
    icon: "🧠",
  },
  {
    id: "travel-sustainable",
    title: "Sustainable tourism practices",
    excerpt: "How to travel responsibly",
    level: "B1",
    duration: "4 min",
    words: 298,
    category: "lifestyle",
    difficulty: 2,
    icon: "✈️",
  },
  {
    id: "languages-brain",
    title: "How learning languages changes your brain",
    excerpt: "Science behind multilingualism",
    level: "B2",
    duration: "5 min",
    words: 412,
    category: "education",
    difficulty: 3,
    icon: "🧬",
  },
]

const categories = ["All", "lifestyle", "history", "technology", "environment", "health", "education"]

const levelColor: Record<string, string> = {
  A1: "from-[#2e9e6a] to-[#5cc29a]",
  A2: "from-[#5cc29a] to-[#5352a5]",
  B1: "from-[#5352a5] to-[#702ae1]",
  B2: "from-[#702ae1] to-[#983772]",
  C1: "from-[#983772] to-[#d56ba6]",
  C2: "from-[#d56ba6] to-[#a19ff9]",
}

export default function ReadingHubPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory = selectedCategory === "All" || a.category === selectedCategory
    return matchSearch && matchCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <PracticeHeader
        title="Reading practice"
        description="Improve comprehension with authentic articles at your level"
        icon={BookOpen}
        breadcrumb="Reading"
        stats={[
          { label: "Articles", value: articles.length.toString() },
          { label: "Hours of content", value: "42+" },
          { label: "Levels", value: "A1-C2" },
        ]}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 rounded-full bg-surface-lowest"
              />
            </div>
          </div>
          <Button variant="outline" className="rounded-full bg-transparent">
            <Filter className="mr-2 size-4" />
            More filters
          </Button>
        </div>

        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-hover"
                  : "bg-surface-lowest shadow-ambient hover:bg-surface-high"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Articles grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/practice/reading/${article.id}`}>
                  <Card className="group h-full overflow-hidden rounded-3xl bg-surface-lowest p-6 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover">
                    <div className="flex items-start justify-between">
                      <div className="text-4xl">{article.icon}</div>
                      <Badge variant="outline" className="rounded-full">
                        {article.level}
                      </Badge>
                    </div>

                    <h3 className="mt-4 font-medium leading-snug text-foreground group-hover:text-primary">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground">{article.excerpt}</p>

                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {article.duration}
                      </span>
                      <span>{article.words} words</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: article.difficulty }).map((_, i) => (
                          <Zap key={i} className="size-3 fill-current text-accent" />
                        ))}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No articles found. Try adjusting your filters.</p>
          </div>
        )}
      </main>
    </div>
  )
}
