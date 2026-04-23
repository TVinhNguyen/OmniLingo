"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowLeft,
  BookOpen,
  Check,
  X,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const LESSON = {
  title: "Present Perfect Tense",
  level: "B1",
  mastery: 64,
  tldr: "Thì hiện tại hoàn thành diễn tả hành động đã xảy ra trong quá khứ và có liên quan đến hiện tại.",
  structure: {
    aff: "S + have/has + V(past participle) + O",
    neg: "S + have/has + not + V(past participle) + O",
    que: "Have/Has + S + V(past participle) + O ?",
  },
  examples: [
    { subj: "I", aux: "have", verb: "visited", rest: "Paris three times." },
    { subj: "She", aux: "has", verb: "lived", rest: "in Tokyo since 2020." },
    { subj: "They", aux: "have", verb: "finished", rest: "their homework." },
    { subj: "We", aux: "haven't", verb: "seen", rest: "him this week." },
  ],
  related: [
    { id: "past-perfect", title: "Past Perfect", desc: "So sánh với Past Perfect" },
    { id: "present-continuous", title: "Present Continuous", desc: "Diễn tả hành động đang xảy ra" },
    { id: "simple-past", title: "Simple Past", desc: "Quá khứ đơn" },
  ],
  mistakes: [
    "Dùng simple past thay vì present perfect khi có 'since/for'",
    "Quên '-s' ở 'has' với ngôi thứ 3 số ít",
    "Không dùng past participle (v3) mà dùng v2",
  ],
  mcq: [
    { q: "She ___ the book already.", options: ["read", "reads", "has read", "have read"], correct: 2 },
    { q: "___ you ever ___ to Japan?", options: ["Did / go", "Have / been", "Has / been", "Are / going"], correct: 1 },
    { q: "I ___ my keys. I can't find them.", options: ["lost", "have lost", "am losing", "losing"], correct: 1 },
    { q: "We ___ here since 2015.", options: ["live", "lived", "have lived", "are living"], correct: 2 },
    { q: "He ___ a new car.", options: ["buy", "bought", "has bought", "is bought"], correct: 2 },
  ],
  conj: [
    { q: "She ___ (finish) her project.", answer: "has finished" },
    { q: "They ___ (not see) that movie yet.", answer: "have not seen" },
    { q: "I ___ (be) to Rome twice.", answer: "have been" },
    { q: "We ___ (eat) lunch already.", answer: "have eaten" },
    { q: "He ___ (write) three books.", answer: "has written" },
  ],
}

export default function GrammarDetailPage() {
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({})
  const [mcqSubmitted, setMcqSubmitted] = useState(false)
  const [conjAnswers, setConjAnswers] = useState<Record<number, string>>({})
  const [conjSubmitted, setConjSubmitted] = useState(false)

  const mcqScore = Object.entries(mcqAnswers).filter(
    ([i, a]) => LESSON.mcq[parseInt(i)].correct === a,
  ).length

  const conjScore = Object.entries(conjAnswers).filter(
    ([i, a]) =>
      a.toLowerCase().trim() === LESSON.conj[parseInt(i)].answer.toLowerCase(),
  ).length

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Hero header */}
      <section
        data-aos="fade-up"
        className="relative overflow-hidden rounded-3xl bg-gradient-primary p-7 text-primary-foreground shadow-hover sm:p-9"
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
          <Link
            href="/practice/grammar"
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            Quay lại Ngữ pháp
          </Link>

          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <GraduationCap className="h-7 w-7" />
              </span>
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  <Sparkles className="h-3 w-3" />
                  Level {LESSON.level} · Mastery {LESSON.mastery}%
                </span>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {LESSON.title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
                  {LESSON.tldr}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-widest text-white/70">
                Progress
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold">
                  {LESSON.mastery}
                </span>
                <span className="text-sm text-white/70">%</span>
              </div>
              <div className="mt-2 h-2 w-40 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${LESSON.mastery}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {/* Structure cards */}
          <section
            data-aos="fade-up"
            className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
          >
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <BookOpen className="h-5 w-5 text-accent" />
              Cấu trúc
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Khẳng định", value: LESSON.structure.aff, color: "from-[#5352a5] to-[#a19ff9]" },
                { label: "Phủ định", value: LESSON.structure.neg, color: "from-[#983772] to-[#d56ba6]" },
                { label: "Nghi vấn", value: LESSON.structure.que, color: "from-[#702ae1] to-[#b48bff]" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-surface-low p-4"
                >
                  <span
                    className={`inline-block rounded-full bg-gradient-to-br ${s.color} px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white`}
                  >
                    {s.label}
                  </span>
                  <code className="mt-3 block font-mono text-sm leading-relaxed">
                    {s.value}
                  </code>
                </div>
              ))}
            </div>
          </section>

          {/* Examples */}
          <section
            data-aos="fade-up"
            className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
          >
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Sparkles className="h-5 w-5 text-accent" />
              Ví dụ mẫu
            </h2>
            <ul className="mt-4 space-y-2">
              {LESSON.examples.map((ex, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-2xl bg-surface-low px-4 py-3 text-base leading-relaxed"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span>
                    <span className="font-semibold">{ex.subj}</span>{" "}
                    <span className="rounded-md bg-accent-container px-1.5 py-0.5 font-semibold text-on-accent-container">
                      {ex.aux}
                    </span>{" "}
                    <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">
                      {ex.verb}
                    </span>{" "}
                    {ex.rest}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Exercises tabs */}
          <section data-aos="fade-up">
            <Tabs defaultValue="mcq" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Luyện tập</h2>
                <TabsList className="grid grid-cols-2 gap-1 rounded-full bg-surface-lowest p-1 shadow-ambient">
                  <TabsTrigger
                    value="mcq"
                    className="rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
                  >
                    Trắc nghiệm
                  </TabsTrigger>
                  <TabsTrigger
                    value="conj"
                    className="rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
                  >
                    Chia động từ
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="mcq" className="space-y-3">
                {LESSON.mcq.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-3xl bg-surface-lowest p-5 shadow-ambient"
                  >
                    <p className="font-semibold">
                      <span className="mr-2 text-sm text-muted-foreground">
                        Q{i + 1}.
                      </span>
                      {item.q}
                    </p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {item.options.map((opt, j) => {
                        const selected = mcqAnswers[i] === j
                        const isCorrect = item.correct === j
                        const showResult = mcqSubmitted
                        return (
                          <button
                            key={j}
                            onClick={() =>
                              !mcqSubmitted &&
                              setMcqAnswers({ ...mcqAnswers, [i]: j })
                            }
                            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-left text-sm transition-all ${
                              showResult && isCorrect
                                ? "bg-success/15 text-success ring-2 ring-success/50"
                                : showResult && selected && !isCorrect
                                  ? "bg-destructive/15 text-destructive ring-2 ring-destructive/50"
                                  : selected
                                    ? "bg-gradient-primary text-white shadow-ambient"
                                    : "bg-surface-low hover:shadow-ambient"
                            }`}
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/20 text-xs font-bold">
                              {String.fromCharCode(65 + j)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {showResult && isCorrect && (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                            {showResult && selected && !isCorrect && (
                              <X className="h-4 w-4" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between rounded-3xl bg-surface-lowest p-5 shadow-ambient">
                  {mcqSubmitted ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <p className="font-semibold">
                        Kết quả: {mcqScore}/{LESSON.mcq.length} câu đúng
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Đã chọn {Object.keys(mcqAnswers).length}/
                      {LESSON.mcq.length} câu
                    </p>
                  )}
                  <Button
                    size="lg"
                    onClick={() => {
                      if (mcqSubmitted) {
                        setMcqAnswers({})
                        setMcqSubmitted(false)
                      } else {
                        setMcqSubmitted(true)
                      }
                    }}
                    disabled={
                      !mcqSubmitted &&
                      Object.keys(mcqAnswers).length !== LESSON.mcq.length
                    }
                    className="rounded-full bg-gradient-primary text-white shadow-ambient hover:opacity-95"
                  >
                    {mcqSubmitted ? "Làm lại" : "Nộp bài"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="conj" className="space-y-3">
                {LESSON.conj.map((item, i) => {
                  const answer = conjAnswers[i] ?? ""
                  const correct =
                    answer.toLowerCase().trim() === item.answer.toLowerCase()
                  return (
                    <div
                      key={i}
                      className="rounded-3xl bg-surface-lowest p-5 shadow-ambient"
                    >
                      <p className="font-semibold">
                        <span className="mr-2 text-sm text-muted-foreground">
                          Q{i + 1}.
                        </span>
                        {item.q}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Input
                          value={answer}
                          onChange={(e) =>
                            setConjAnswers({
                              ...conjAnswers,
                              [i]: e.target.value,
                            })
                          }
                          disabled={conjSubmitted}
                          placeholder="Nhập đáp án…"
                          className="flex-1 rounded-full border-0 bg-surface-low"
                        />
                        {conjSubmitted && (
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${correct ? "bg-success text-white" : "bg-destructive text-white"}`}
                          >
                            {correct ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                      {conjSubmitted && !correct && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Đáp án đúng:{" "}
                          <span className="font-semibold text-success">
                            {item.answer}
                          </span>
                        </p>
                      )}
                    </div>
                  )
                })}

                <div className="flex items-center justify-between rounded-3xl bg-surface-lowest p-5 shadow-ambient">
                  {conjSubmitted ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <p className="font-semibold">
                        Kết quả: {conjScore}/{LESSON.conj.length} câu đúng
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Đã điền {Object.values(conjAnswers).filter(Boolean).length}/
                      {LESSON.conj.length} câu
                    </p>
                  )}
                  <Button
                    size="lg"
                    onClick={() => {
                      if (conjSubmitted) {
                        setConjAnswers({})
                        setConjSubmitted(false)
                      } else {
                        setConjSubmitted(true)
                      }
                    }}
                    className="rounded-full bg-gradient-primary text-white shadow-ambient hover:opacity-95"
                  >
                    {conjSubmitted ? "Làm lại" : "Chấm điểm"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Common mistakes */}
          <section
            data-aos="fade-up"
            className="rounded-3xl bg-surface-lowest p-5 shadow-ambient"
          >
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Lỗi thường gặp
            </h3>
            <ul className="mt-3 space-y-2">
              {LESSON.mistakes.map((m, i) => (
                <li
                  key={i}
                  className="flex gap-2 rounded-2xl bg-destructive/5 p-3 text-xs text-muted-foreground"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-[10px] font-bold text-destructive">
                    {i + 1}
                  </span>
                  {m}
                </li>
              ))}
            </ul>
          </section>

          {/* Related lessons */}
          <section
            data-aos="fade-up"
            className="rounded-3xl bg-surface-lowest p-5 shadow-ambient"
          >
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <BookOpen className="h-4 w-4 text-accent" />
              Bài liên quan
            </h3>
            <ul className="mt-3 space-y-2">
              {LESSON.related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/practice/grammar/${r.id}`}
                    className="group flex items-center gap-2 rounded-2xl bg-surface-low p-3 transition-all hover:bg-accent-container/60"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Practice CTA */}
          <section
            data-aos="fade-up"
            className="rounded-3xl bg-gradient-fluency p-5 text-primary-foreground shadow-ambient"
          >
            <h3 className="text-sm font-bold">Ôn lại bài này bằng SRS</h3>
            <p className="mt-1 text-xs text-white/85">
              Hệ thống nhắc lại cách quãng giúp bạn nhớ vĩnh viễn.
            </p>
            <Button
              asChild
              size="sm"
              className="mt-4 w-full rounded-full bg-white text-accent hover:bg-white/90 shadow-ambient"
            >
              <Link href="/practice/vocabulary">
                Thêm vào SRS
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </section>
        </aside>
      </div>
    </div>
  )
}
