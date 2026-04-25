"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  FileUp,
  Globe,
  Lock,
  Sparkles,
  Upload,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { deckTemplates, templatePreview } from "@/lib/vocab-data"

const emojis = [
  "🎓", "📚", "💼", "✈️", "🌏", "☀️", "🔤", "💡",
  "🎯", "🏆", "🎨", "🎵", "🍕", "🇬🇧", "🇯🇵", "🇰🇷",
  "🇨🇳", "🇫🇷", "🇩🇪", "🇪🇸", "🇮🇹", "🇹🇭", "🇻🇳", "🌸",
  "🍜", "🗼", "🎌", "🏯", "🌟", "📖", "🧠", "💪",
  "🚀", "⚡", "🔥", "💎", "🎭", "🎪", "🎬", "📱",
  "🧳", "🏨", "🍽️", "☕", "🍺", "🎂", "🌈", "🌙",
  "☁️", "❄️", "🌊", "🔔", "🔒", "🧩", "🎲", "⚽",
  "🏀", "🎾", "🏈", "⛳", "🎳", "♟️", "🎮", "🎰",
]

const langs = [
  { code: "en", name: "Tiếng Anh", flag: "🇬🇧" },
  { code: "ja", name: "Tiếng Nhật", flag: "🇯🇵" },
  { code: "ko", name: "Tiếng Hàn", flag: "🇰🇷" },
  { code: "zh", name: "Tiếng Trung", flag: "🇨🇳" },
  { code: "fr", name: "Tiếng Pháp", flag: "🇫🇷" },
  { code: "de", name: "Tiếng Đức", flag: "🇩🇪" },
  { code: "es", name: "Tiếng Tây Ban Nha", flag: "🇪🇸" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
]

const levels: Record<string, string[]> = {
  en: ["A1", "A2", "B1", "B2", "C1", "C2"],
  ja: ["N5", "N4", "N3", "N2", "N1"],
  ko: ["TOPIK 1", "TOPIK 2", "TOPIK 3", "TOPIK 4", "TOPIK 5", "TOPIK 6"],
  zh: ["HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6", "HSK 7-9"],
  fr: ["A1", "A2", "B1", "B2", "C1", "C2"],
  de: ["A1", "A2", "B1", "B2", "C1", "C2"],
  es: ["A1", "A2", "B1", "B2", "C1", "C2"],
  vi: ["Cơ bản", "Trung cấp", "Nâng cao"],
}

export default function NewDeckPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [sourceLang, setSourceLang] = useState("en")
  const [targetLang, setTargetLang] = useState("vi")
  const [level, setLevel] = useState("B2")

  // Step 2
  const [contentType, setContentType] = useState<"empty" | "template" | "import">("empty")
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [importText, setImportText] = useState("")
  const [importFile, setImportFile] = useState<string | null>(null)

  // Step 3
  const [visibility, setVisibility] = useState<"private" | "public" | "shared">("private")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [emoji, setEmoji] = useState("🎓")
  const [algo, setAlgo] = useState("fsrs")
  const [dailyNew, setDailyNew] = useState([15])
  const [dailyReview, setDailyReview] = useState([200])

  const sourceLangObj = langs.find((l) => l.code === sourceLang)

  const canNext = () => {
    if (step === 1) return name.trim().length >= 2
    if (step === 2) {
      if (contentType === "template") return !!templateId
      if (contentType === "import") return !!importFile || importText.trim().length > 0
      return true
    }
    return true
  }

  const addTag = () => {
    const v = tagInput.trim()
    if (v && !tags.includes(v)) setTags([...tags, v])
    setTagInput("")
  }

  const finish = () => {
    // Mock push to new deck
    router.push("/practice/vocabulary/decks/ielts-5000")
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/practice/vocabulary" className="hover:text-foreground">Vocabulary</Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground font-medium">Tạo deck mới</span>
      </div>

      {/* Progress stepper */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-ambient">
        <div className="relative">
          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-surface-high" />
          <div
            className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-primary transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {[
              { n: 1, label: "Thông tin" },
              { n: 2, label: "Nội dung" },
              { n: 3, label: "Tuỳ chỉnh" },
              { n: 4, label: "Xác nhận" },
            ].map((s) => (
              <div key={s.n} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 bg-card font-semibold transition-all",
                    s.n < step && "border-primary bg-primary text-primary-foreground",
                    s.n === step && "border-primary text-primary scale-110",
                    s.n > step && "border-border text-muted-foreground",
                  )}
                >
                  {s.n < step ? <Check className="size-4" /> : s.n}
                </div>
                <span className={cn("text-xs font-medium", s.n === step ? "text-foreground" : "text-muted-foreground")}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-ambient">
            <CardContent className="p-6 md:p-8">
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Thông tin cơ bản</h2>
                    <p className="text-muted-foreground mt-1">Đặt tên cho deck và chọn ngôn ngữ</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tên deck <span className="text-destructive">*</span></label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="VD: IELTS Vocabulary 5000"
                      className="mt-1.5 h-12 rounded-xl bg-surface-lowest text-lg"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mô tả</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Mô tả ngắn về mục đích của deck này..."
                      rows={3}
                      className="mt-1.5 rounded-xl bg-surface-lowest"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium">Ngôn ngữ học</label>
                      <Select value={sourceLang} onValueChange={(v) => { setSourceLang(v); setLevel(levels[v]?.[0] ?? "A1") }}>
                        <SelectTrigger className="mt-1.5 h-11 rounded-xl bg-surface-lowest">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {langs.map((l) => (
                            <SelectItem key={l.code} value={l.code}>
                              <span className="mr-2">{l.flag}</span>
                              {l.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Ngôn ngữ nghĩa</label>
                      <Select value={targetLang} onValueChange={setTargetLang}>
                        <SelectTrigger className="mt-1.5 h-11 rounded-xl bg-surface-lowest">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {langs.map((l) => (
                            <SelectItem key={l.code} value={l.code}>
                              <span className="mr-2">{l.flag}</span>
                              {l.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Trình độ</label>
                      <Select value={level} onValueChange={setLevel}>
                        <SelectTrigger className="mt-1.5 h-11 rounded-xl bg-surface-lowest">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(levels[sourceLang] ?? []).map((l) => (
                            <SelectItem key={l} value={l}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Nội dung deck</h2>
                    <p className="text-muted-foreground mt-1">Chọn cách tạo nội dung</p>
                  </div>
                  <RadioGroup value={contentType} onValueChange={(v) => setContentType(v as typeof contentType)}>
                    <div className="grid gap-3">
                      {[
                        { value: "empty", title: "Tạo rỗng", desc: "Tự thêm thẻ sau khi tạo deck" },
                        { value: "template", title: "Chọn template", desc: "Dùng bộ từ vựng có sẵn" },
                        { value: "import", title: "Import file", desc: "CSV, Anki, Quizlet, hoặc paste text" },
                      ].map((o) => (
                        <label
                          key={o.value}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-card p-4 transition",
                            contentType === o.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                          )}
                        >
                          <RadioGroupItem value={o.value} />
                          <div className="flex-1">
                            <div className="font-semibold">{o.title}</div>
                            <div className="text-xs text-muted-foreground">{o.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>

                  {contentType === "template" && (
                    <div className="space-y-3 pt-2">
                      <p className="text-sm font-medium">Chọn template</p>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {deckTemplates.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setTemplateId(t.id)}
                            className={cn(
                              "group rounded-xl border-2 bg-card p-4 text-left transition",
                              templateId === t.id ? "border-primary bg-primary/5 shadow-hover" : "border-border hover:border-primary/50",
                            )}
                          >
                            <div className="text-3xl mb-2">{t.emoji}</div>
                            <div className="font-semibold text-sm">{t.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>
                            <div className="mt-2 flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">{t.tag}</Badge>
                              <span className="text-xs font-mono text-muted-foreground">{t.count} từ</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      {templateId && templatePreview[templateId] && (
                        <div className="rounded-xl bg-surface-low p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Xem trước 5 từ đầu
                          </p>
                          <div className="space-y-1">
                            {templatePreview[templateId].map((w, i) => (
                              <div key={i} className="flex justify-between text-sm py-1 border-b border-border/40 last:border-0">
                                <span className="font-semibold">{w.lemma}</span>
                                <span className="text-muted-foreground">{w.meaning}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {contentType === "import" && (
                    <Tabs defaultValue="csv" className="pt-2">
                      <TabsList className="bg-surface-low">
                        <TabsTrigger value="csv">CSV/TSV</TabsTrigger>
                        <TabsTrigger value="anki">Anki</TabsTrigger>
                        <TabsTrigger value="quizlet">Quizlet</TabsTrigger>
                        <TabsTrigger value="paste">Paste text</TabsTrigger>
                      </TabsList>
                      <TabsContent value="csv" className="mt-4">
                        <ImportDropzone file={importFile} onFile={setImportFile} hint=".csv, .tsv (cột: lemma, meaning, example)" />
                      </TabsContent>
                      <TabsContent value="anki" className="mt-4">
                        <ImportDropzone file={importFile} onFile={setImportFile} hint=".apkg package từ Anki" />
                      </TabsContent>
                      <TabsContent value="quizlet" className="mt-4">
                        <Input placeholder="https://quizlet.com/..." className="h-12 rounded-xl bg-surface-lowest" />
                      </TabsContent>
                      <TabsContent value="paste" className="mt-4">
                        <Textarea
                          value={importText}
                          onChange={(e) => setImportText(e.target.value)}
                          placeholder="lemma, nghĩa, ví dụ&#10;afraid, sợ hãi, She was afraid of the dark.&#10;brave, dũng cảm, A brave firefighter saved the child."
                          rows={8}
                          className="rounded-xl bg-surface-lowest font-mono text-sm"
                        />
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Tuỳ chỉnh</h2>
                    <p className="text-muted-foreground mt-1">Cài đặt thêm cho deck của bạn</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Hiển thị</label>
                    <RadioGroup value={visibility} onValueChange={(v) => setVisibility(v as typeof visibility)} className="mt-2">
                      <div className="grid gap-2 sm:grid-cols-3">
                        {[
                          { v: "private", icon: Lock, label: "Riêng tư", desc: "Chỉ mình bạn" },
                          { v: "shared", icon: Users, label: "Chia sẻ link", desc: "Ai có link đều xem được" },
                          { v: "public", icon: Globe, label: "Công khai", desc: "Lên community" },
                        ].map((o) => (
                          <label
                            key={o.v}
                            className={cn(
                              "flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-3 transition",
                              visibility === o.v ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value={o.v} />
                              <o.icon className="size-4" />
                              <span className="font-medium text-sm">{o.label}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{o.desc}</span>
                          </label>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Tags</label>
                    <div className="mt-1.5 flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        placeholder="ielts, b2, academic..."
                        className="rounded-xl bg-surface-lowest"
                      />
                      <Button variant="outline" onClick={addTag}>Thêm</Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {tags.map((t) => (
                          <Badge key={t} className="gap-1 bg-accent/20 text-accent border-accent/30">
                            {t}
                            <button onClick={() => setTags(tags.filter((x) => x !== t))}><X className="size-3" /></button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Cover emoji</label>
                    <div className="mt-2 grid grid-cols-8 gap-1.5 rounded-xl border border-border bg-surface-lowest p-3">
                      {emojis.map((e) => (
                        <button
                          key={e}
                          onClick={() => setEmoji(e)}
                          className={cn(
                            "flex size-10 items-center justify-center rounded-lg text-xl transition",
                            emoji === e ? "bg-gradient-primary scale-110 shadow-hover" : "hover:bg-surface-low",
                          )}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">SRS Algorithm</label>
                      <Select value={algo} onValueChange={setAlgo}>
                        <SelectTrigger className="mt-1.5 rounded-xl bg-surface-lowest">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fsrs">FSRS v5 (khuyến nghị)</SelectItem>
                          <SelectItem value="sm2">SM-2 (cổ điển)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Thẻ mới/ngày: <span className="text-primary">{dailyNew[0]}</span>
                      </label>
                      <Slider value={dailyNew} onValueChange={setDailyNew} min={5} max={50} step={1} className="mt-4" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium">
                        Giới hạn ôn/ngày: <span className="text-primary">{dailyReview[0]}</span>
                      </label>
                      <Slider value={dailyReview} onValueChange={setDailyReview} min={50} max={500} step={10} className="mt-4" />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Xác nhận tạo deck</h2>
                    <p className="text-muted-foreground mt-1">Kiểm tra lại thông tin trước khi tạo</p>
                  </div>

                  <div className="rounded-2xl bg-gradient-primary p-6 text-white">
                    <div className="flex items-center gap-4">
                      <div className="flex size-16 items-center justify-center rounded-2xl bg-white/20 text-4xl">
                        {emoji}
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold">{name || "Tên deck"}</h3>
                        <p className="text-sm opacity-90">{description || "Chưa có mô tả"}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <Badge className="bg-white/20 border-0 text-white">{sourceLangObj?.flag} {sourceLangObj?.name}</Badge>
                          <Badge className="bg-white/20 border-0 text-white">{level}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <SummaryRow label="Nội dung" value={
                      contentType === "empty" ? "Rỗng" :
                      contentType === "template" ? `Template: ${deckTemplates.find((t) => t.id === templateId)?.name ?? "-"}` :
                      "Import file"
                    } />
                    <SummaryRow label="Hiển thị" value={visibility === "private" ? "Riêng tư" : visibility === "public" ? "Công khai" : "Chia sẻ"} />
                    <SummaryRow label="Algorithm" value={algo === "fsrs" ? "FSRS v5" : "SM-2"} />
                    <SummaryRow label="Thẻ mới/ngày" value={`${dailyNew[0]}`} />
                    <SummaryRow label="Giới hạn ôn/ngày" value={`${dailyReview[0]}`} />
                    <SummaryRow label="Tags" value={tags.length ? tags.join(", ") : "Không có"} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {step === 1 ? (
          <Button variant="ghost" asChild>
            <Link href="/practice/vocabulary">
              <ArrowLeft className="mr-2 size-4" /> Huỷ
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="mr-2 size-4" /> Quay lại
          </Button>
        )}

        {step < 4 ? (
          <Button
            disabled={!canNext()}
            onClick={() => setStep((s) => s + 1)}
            className="bg-gradient-primary min-w-32"
          >
            Tiếp <ArrowRight className="ml-2 size-4" />
          </Button>
        ) : (
          <Button onClick={finish} size="lg" className="bg-gradient-primary min-w-40">
            <Sparkles className="mr-2 size-4" /> Tạo deck
          </Button>
        )}
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-low p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  )
}

function ImportDropzone({ file, onFile, hint }: { file: string | null; onFile: (s: string) => void; hint: string }) {
  const [over, setOver] = useState(false)
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        const f = e.dataTransfer.files[0]
        if (f) onFile(f.name)
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-surface-lowest p-10 text-center transition",
        over ? "border-primary bg-primary/5" : "border-border",
      )}
    >
      {file ? (
        <>
          <FileUp className="size-6 text-primary" />
          <p className="text-sm font-semibold">{file}</p>
          <p className="text-xs text-muted-foreground">Đã sẵn sàng import</p>
        </>
      ) : (
        <>
          <Upload className="size-6 text-muted-foreground" />
          <p className="text-sm font-medium">Kéo thả file vào đây</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </>
      )}
    </div>
  )
}
