"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FlagIcon } from "@/components/flag-icon"

const courses = [
  { name: "Tiếng Anh", code: "gb", learners: "840K", difficulty: "Mọi cấp độ", accent: "from-[#5352a5]/15 to-[#a19ff9]/5" },
  { name: "Tiếng Tây Ban Nha", code: "es", learners: "520K", difficulty: "A1 → C1", accent: "from-[#d9912a]/15 to-[#d9912a]/5" },
  { name: "Tiếng Nhật", code: "jp", learners: "410K", difficulty: "A1 → N2", accent: "from-[#d0406e]/15 to-[#d0406e]/5" },
  { name: "Tiếng Pháp", code: "fr", learners: "310K", difficulty: "A1 → C2", accent: "from-[#702ae1]/15 to-[#702ae1]/5" },
  { name: "Tiếng Đức", code: "de", learners: "280K", difficulty: "A1 → C1", accent: "from-[#2e9e6a]/15 to-[#2e9e6a]/5" },
  { name: "Tiếng Ý", code: "it", learners: "190K", difficulty: "A1 → B2", accent: "from-[#2e9e6a]/15 to-[#2e9e6a]/5" },
  { name: "Tiếng Hàn", code: "kr", learners: "230K", difficulty: "A1 → TOPIK 3", accent: "from-[#d9912a]/15 to-[#d9912a]/5" },
  { name: "Tiếng Trung", code: "cn", learners: "260K", difficulty: "A1 → HSK 4", accent: "from-[#d0406e]/15 to-[#d0406e]/5" },
  { name: "Tiếng Bồ Đào Nha", code: "pt", learners: "140K", difficulty: "A1 → B2", accent: "from-[#5352a5]/15 to-[#5352a5]/5" },
  { name: "Tiếng Nga", code: "ru", learners: "120K", difficulty: "A1 → B2", accent: "from-[#d9912a]/15 to-[#d9912a]/5" },
  { name: "Tiếng Hà Lan", code: "nl", learners: "90K", difficulty: "A1 → B2", accent: "from-[#2e9e6a]/15 to-[#2e9e6a]/5" },
  { name: "Tiếng Ả Rập", code: "sa", learners: "110K", difficulty: "A1 → B1", accent: "from-[#702ae1]/15 to-[#702ae1]/5" },
]

export default function CoursesPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5 text-xs font-semibold">
            Khóa học
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            20+ ngôn ngữ, <span className="text-gradient-primary">một nền tảng</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground">
            Dù bạn mới bắt đầu hay đang hoàn thiện fluency, OmniLingo đều có lộ trình phù hợp.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <motion.div
              key={c.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
            >
              <Card
                className={`group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${c.accent} p-6 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-lowest shadow-ambient">
                    <FlagIcon code={c.code} size={32} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">{c.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.difficulty}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {c.learners} học viên
                </div>
                <Link href="/sign-up" className="absolute inset-0" aria-label={`Bắt đầu học ${c.name}`} />
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-gradient-primary text-primary-foreground shadow-raise hover:shadow-hover transition-shadow"
          >
            <Link href="/sign-up">
              Bắt đầu học miễn phí
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
