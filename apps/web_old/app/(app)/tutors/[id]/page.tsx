"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ArrowLeft, Star, MessageCircle, Video, GraduationCap, Globe2, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const slots = [
  { day: "Mon", date: 20, times: ["09:00", "10:00", "14:00"] },
  { day: "Tue", date: 21, times: ["09:00", "11:00", "15:00", "19:00"] },
  { day: "Wed", date: 22, times: [] },
  { day: "Thu", date: 23, times: ["08:00", "12:00", "17:00"] },
  { day: "Fri", date: 24, times: ["10:00", "14:00"] },
  { day: "Sat", date: 25, times: ["09:00", "10:00", "11:00", "15:00"] },
  { day: "Sun", date: 26, times: ["10:00", "14:00"] },
]

const reviews = [
  { name: "Linh N.", text: "Emma is incredibly patient and her IELTS tips helped me score 7.5!", rating: 5, date: "2 weeks ago" },
  { name: "Marco R.", text: "Clear, structured lessons. I improved my Writing Task 2 dramatically.", rating: 5, date: "1 month ago" },
  { name: "Sara K.", text: "Kind, professional, and always prepared with great materials.", rating: 5, date: "1 month ago" },
]

export default function TutorDetailPage() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/tutors"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All tutors
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Header */}
          <Card className="mb-6 border-border/60 bg-card/80 p-6">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="relative aspect-square size-48 shrink-0 overflow-hidden rounded-2xl bg-accent">
                <Image src="/tutor-emma.jpg" alt="Emma Johnson" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Badge className="rounded-full bg-success/15 text-success hover:bg-success/15">
                    Online now
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    <Award className="mr-1 size-3" />
                    Top rated
                  </Badge>
                </div>
                <h1 className="font-serif text-3xl font-semibold tracking-tight">Emma Johnson</h1>
                <p className="text-sm text-muted-foreground">London, United Kingdom · English native</p>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <Stat label="Rating" value="4.98" sub="★★★★★" />
                  <Stat label="Lessons" value="5,200" sub="since 2018" />
                  <Stat label="Students" value="1,204" sub="active" />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button className="rounded-full">
                    <Video className="mr-2 size-4" />
                    Book trial $9
                  </Button>
                  <Button variant="outline" className="rounded-full bg-transparent">
                    <MessageCircle className="mr-2 size-4" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="resume">Resume</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6 space-y-6">
              <Card className="border-border/60 bg-card/80 p-6">
                <h2 className="mb-3 font-serif text-xl font-semibold">About me</h2>
                <p className="text-sm leading-relaxed text-foreground">
                  Hi! I&apos;m Emma, a certified IELTS examiner and CELTA-qualified English tutor based in
                  London. Over the last 8 years, I&apos;ve helped more than 1,200 students reach their target
                  band — from academic researchers preparing for PhD programs, to business professionals
                  seeking promotions, to travelers wanting to feel confident on their next adventure.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground">
                  My lessons are structured, warm, and full of real-life examples. We&apos;ll build your
                  skills step-by-step, with homework tailored to your goals.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <InfoRow icon={GraduationCap} label="Teaches" value="English, Business English" />
                  <InfoRow icon={Globe2} label="Also speaks" value="Spanish (B2), French (A2)" />
                  <InfoRow icon={Award} label="Certificates" value="CELTA, IELTS Examiner" />
                  <InfoRow icon={Video} label="Lesson format" value="50-min video · 1-on-1" />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-4">
              {reviews.map((r, i) => (
                <Card key={i} className="border-border/60 bg-card/80 p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-primary/15 text-primary">
                          {r.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-muted-foreground">{r.date}</div>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-warning text-warning" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground">{r.text}</p>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="resume" className="mt-6">
              <Card className="border-border/60 bg-card/80 p-6">
                <h2 className="mb-4 font-serif text-xl font-semibold">Education & certifications</h2>
                <div className="space-y-5">
                  <ResumeItem
                    title="MA in Applied Linguistics"
                    org="University College London"
                    date="2015 — 2017"
                  />
                  <ResumeItem title="CELTA certificate" org="Cambridge English" date="2018" />
                  <ResumeItem title="IELTS Examiner accreditation" org="British Council" date="2020" />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="border-border/60 bg-card/80 p-5 shadow-soft">
            <div className="mb-4 flex items-baseline justify-between">
              <div>
                <div className="font-serif text-3xl font-bold">$18</div>
                <div className="text-xs text-muted-foreground">per 50-min lesson</div>
              </div>
              <Badge variant="secondary" className="rounded-full">
                Trial $9
              </Badge>
            </div>

            <h3 className="mb-2 text-sm font-semibold">Select a time</h3>
            <div className="mb-3 grid grid-cols-7 gap-1">
              {slots.map((s) => (
                <div key={s.day} className="text-center">
                  <div className="text-xs text-muted-foreground">{s.day}</div>
                  <div className="font-medium">{s.date}</div>
                </div>
              ))}
            </div>
            <div className="mb-4 grid grid-cols-2 gap-2">
              {slots.flatMap((s) =>
                s.times.slice(0, 2).map((t) => (
                  <button
                    key={`${s.day}-${t}`}
                    onClick={() => setSelected(`${s.day} ${t}`)}
                    className={cn(
                      "rounded-lg border-2 px-3 py-2 text-xs font-medium transition",
                      selected === `${s.day} ${t}`
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    {s.day} · {t}
                  </button>
                )),
              )}
            </div>

            <Button className="w-full rounded-full" disabled={!selected}>
              {selected ? `Book ${selected}` : "Choose a time"}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Free to cancel up to 12h before
            </p>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl bg-accent/60 p-3 text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-serif text-xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 p-3">
      <Icon className="mt-0.5 size-4 text-primary" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  )
}

function ResumeItem({ title, org, date }: { title: string; org: string; date: string }) {
  return (
    <div className="flex items-start gap-4 border-l-2 border-primary/40 pl-4">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{org}</div>
        <div className="text-xs text-muted-foreground">{date}</div>
      </div>
    </div>
  )
}
