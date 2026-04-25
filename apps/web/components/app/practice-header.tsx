import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ChevronRight, Sparkles } from "lucide-react"

interface PracticeHeaderProps {
  icon: LucideIcon
  breadcrumb: string
  title: string
  highlight?: string
  description: string
  gradient?: "primary" | "fluency" | "purple-pink"
  stats?: { label: string; value: string }[]
  badge?: string
}

export function PracticeHeader({
  icon: Icon,
  breadcrumb,
  title,
  highlight,
  description,
  gradient = "primary",
  stats,
  badge,
}: PracticeHeaderProps) {
  const gradientClass =
    gradient === "fluency"
      ? "bg-gradient-fluency"
      : gradient === "purple-pink"
        ? "bg-gradient-to-br from-[#983772] via-[#702ae1] to-[#5352a5]"
        : "bg-gradient-primary"

  return (
    <section
      data-aos="fade-up"
      className={`relative overflow-hidden rounded-3xl p-7 text-primary-foreground shadow-hover ${gradientClass} sm:p-9`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Link href="/practice" className="hover:text-white">
            {breadcrumb}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-white">{title}</span>
        </div>

        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Icon className="h-7 w-7" />
            </span>
            <div>
              {badge && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  <Sparkles className="h-3 w-3" />
                  {badge}
                </span>
              )}
              <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                {title}
                {highlight && (
                  <>
                    {" "}
                    <span className="text-[#dcc9ff]">{highlight}</span>
                  </>
                )}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
                {description}
              </p>
            </div>
          </div>

          {stats && stats.length > 0 && (
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur sm:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="min-w-[72px] rounded-xl bg-white/10 px-4 py-2.5 text-center"
                >
                  <p className="text-2xl font-extrabold leading-none">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-white/70">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
