"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft,
  ChevronRight,
  User,
  Languages,
  Award,
  FileVideo,
  CheckCircle2,
  Check,
  Upload,
  Sparkles,
  Plus,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const STEPS = [
  { id: 1, name: "Thông tin cá nhân", icon: User },
  { id: 2, name: "Ngôn ngữ dạy", icon: Languages },
  { id: 3, name: "Kinh nghiệm", icon: Award },
  { id: 4, name: "Video giới thiệu", icon: FileVideo },
  { id: 5, name: "Hoàn tất", icon: CheckCircle2 },
]

const LANGUAGES = [
  "Tiếng Anh",
  "Tiếng Nhật",
  "Tiếng Hàn",
  "Tiếng Trung",
  "Tiếng Pháp",
  "Tiếng Đức",
  "Tiếng Tây Ban Nha",
  "Tiếng Ý",
  "Tiếng Nga",
  "Tiếng Ả Rập",
]

const SPECIALTIES = [
  "IELTS",
  "TOEIC",
  "TOEFL",
  "Business English",
  "Conversational",
  "Grammar",
  "Pronunciation",
  "JLPT",
  "HSK",
  "Kids (5-12)",
  "Teens (13-17)",
  "Adults",
]

export default function TutorApplyPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "vn",
    bio: "",
    languages: [] as { lang: string; level: string }[],
    specialties: [] as string[],
    experience: "",
    certifications: "",
    hourlyRate: "15",
    videoUploaded: false,
  })

  const addLanguage = () => {
    if (form.languages.length < 5) {
      setForm({
        ...form,
        languages: [...form.languages, { lang: LANGUAGES[0], level: "C1" }],
      })
    }
  }

  const removeLanguage = (idx: number) => {
    setForm({
      ...form,
      languages: form.languages.filter((_, i) => i !== idx),
    })
  }

  const toggleSpecialty = (spec: string) => {
    setForm({
      ...form,
      specialties: form.specialties.includes(spec)
        ? form.specialties.filter((s) => s !== spec)
        : [...form.specialties, spec],
    })
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Button
          variant="ghost"
          asChild
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/become-tutor">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Link>
        </Button>

        {/* Hero */}
        <div className="overflow-hidden rounded-3xl bg-gradient-primary p-10 text-white shadow-hover">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <div className="text-sm font-medium uppercase tracking-wider text-white/70">
                Đăng ký làm giáo viên
              </div>
              <h1 className="text-3xl font-bold">Trở thành giáo viên OmniLingo</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-white/90">
            Tham gia cộng đồng 2000+ giáo viên, dạy học viên từ khắp thế giới và nhận thu nhập hấp dẫn.
          </p>
        </div>

        {/* Stepper */}
        <div className="mt-8 overflow-hidden rounded-3xl bg-surface-lowest p-4 shadow-ambient">
          <div className="flex items-center gap-2 overflow-x-auto">
            {STEPS.map((s, idx) => {
              const isDone = step > s.id
              const isActive = step === s.id
              return (
                <div key={s.id} className="flex flex-1 items-center gap-2">
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                        isDone
                          ? "bg-success text-success-foreground"
                          : isActive
                            ? "bg-primary text-primary-foreground shadow-hover"
                            : "bg-surface-low text-muted-foreground"
                      }`}
                    >
                      {isDone ? <Check className="h-5 w-5" /> : s.id}
                    </div>
                    <span
                      className={`hidden text-sm sm:block ${
                        isActive ? "font-semibold" : "text-muted-foreground"
                      }`}
                    >
                      {s.name}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 transition-colors ${
                        isDone ? "bg-success" : "bg-surface-low"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="mt-8 rounded-3xl bg-surface-lowest p-8 shadow-ambient"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
                  <p className="mt-1 text-muted-foreground">
                    Hãy giới thiệu bản thân để học viên hiểu về bạn
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Họ tên đầy đủ *</Label>
                    <Input
                      id="name"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="mt-2 h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="mt-2 h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+84 ..."
                      className="mt-2 h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Quốc gia</Label>
                    <Select
                      value={form.country}
                      onValueChange={(v) => setForm({ ...form, country: v })}
                    >
                      <SelectTrigger id="country" className="mt-2 h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vn">Việt Nam</SelectItem>
                        <SelectItem value="us">Hoa Kỳ</SelectItem>
                        <SelectItem value="uk">Anh</SelectItem>
                        <SelectItem value="au">Úc</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Giới thiệu ngắn *</Label>
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Chia sẻ về phong cách dạy, đam mê và mục tiêu của bạn..."
                    rows={5}
                    className="mt-2 rounded-xl"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {form.bio.length}/500 ký tự • Tối thiểu 100 ký tự
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Ngôn ngữ bạn có thể dạy</h2>
                  <p className="mt-1 text-muted-foreground">
                    Thêm tối đa 5 ngôn ngữ với trình độ tương ứng
                  </p>
                </div>

                <div className="space-y-3">
                  {form.languages.map((l, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-2xl border border-border p-3"
                    >
                      <Select
                        value={l.lang}
                        onValueChange={(v) => {
                          const newLangs = [...form.languages]
                          newLangs[idx].lang = v
                          setForm({ ...form, languages: newLangs })
                        }}
                      >
                        <SelectTrigger className="flex-1 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={l.level}
                        onValueChange={(v) => {
                          const newLangs = [...form.languages]
                          newLangs[idx].level = v
                          setForm({ ...form, languages: newLangs })
                        }}
                      >
                        <SelectTrigger className="w-32 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B2">B2 Upper</SelectItem>
                          <SelectItem value="C1">C1 Advanced</SelectItem>
                          <SelectItem value="C2">C2 Proficient</SelectItem>
                          <SelectItem value="native">Native</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLanguage(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addLanguage}
                    disabled={form.languages.length >= 5}
                    className="w-full rounded-xl"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm ngôn ngữ
                  </Button>
                </div>

                <div>
                  <Label>Chuyên môn</Label>
                  <p className="mt-1 text-sm text-muted-foreground">Chọn các lĩnh vực bạn giỏi</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SPECIALTIES.map((spec) => (
                      <button
                        key={spec}
                        onClick={() => toggleSpecialty(spec)}
                        className={`rounded-full border-2 px-4 py-2 text-sm transition-all ${
                          form.specialties.includes(spec)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-surface-lowest hover:border-primary/40"
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Kinh nghiệm & Chứng chỉ</h2>
                  <p className="mt-1 text-muted-foreground">
                    Cho chúng tôi biết quá trình giảng dạy của bạn
                  </p>
                </div>

                <div>
                  <Label htmlFor="exp">Số năm kinh nghiệm</Label>
                  <Select
                    value={form.experience}
                    onValueChange={(v) => setForm({ ...form, experience: v })}
                  >
                    <SelectTrigger id="exp" className="mt-2 h-12 rounded-xl">
                      <SelectValue placeholder="Chọn kinh nghiệm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">Dưới 1 năm</SelectItem>
                      <SelectItem value="1-3">1-3 năm</SelectItem>
                      <SelectItem value="3-5">3-5 năm</SelectItem>
                      <SelectItem value="5-10">5-10 năm</SelectItem>
                      <SelectItem value="10+">Trên 10 năm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="certs">Chứng chỉ (tùy chọn)</Label>
                  <Textarea
                    id="certs"
                    value={form.certifications}
                    onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                    placeholder="TESOL, CELTA, IELTS 8.5, ..."
                    rows={4}
                    className="mt-2 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="rate">Mức giá mong muốn (USD/giờ)</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">${form.hourlyRate}</span>
                    <Input
                      id="rate"
                      type="range"
                      min="5"
                      max="60"
                      value={form.hourlyRate}
                      onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>$5</span>
                    <span>$30 (trung bình)</span>
                    <span>$60</span>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Video giới thiệu</h2>
                  <p className="mt-1 text-muted-foreground">
                    Video 1-3 phút giúp học viên hiểu về bạn hơn
                  </p>
                </div>

                <div
                  className={`rounded-3xl border-2 border-dashed p-10 text-center transition-colors ${
                    form.videoUploaded
                      ? "border-success bg-success/5"
                      : "border-border hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  {form.videoUploaded ? (
                    <>
                      <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
                      <p className="mt-4 text-lg font-semibold">intro-video.mp4</p>
                      <p className="text-sm text-muted-foreground">2:45 • 45 MB</p>
                      <Button
                        variant="outline"
                        onClick={() => setForm({ ...form, videoUploaded: false })}
                        className="mt-4 rounded-xl"
                      >
                        Thay video khác
                      </Button>
                    </>
                  ) : (
                    <>
                      <Upload className="mx-auto h-16 w-16 text-muted-foreground" />
                      <p className="mt-4 text-lg font-semibold">Tải video lên</p>
                      <p className="text-sm text-muted-foreground">
                        MP4, MOV • Tối đa 100MB • 1-3 phút
                      </p>
                      <Button
                        onClick={() => setForm({ ...form, videoUploaded: true })}
                        className="mt-4 rounded-xl bg-gradient-primary shadow-hover"
                      >
                        Chọn file
                      </Button>
                    </>
                  )}
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 p-5">
                  <h3 className="text-sm font-bold">Gợi ý nội dung video</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    <li>• Giới thiệu tên và quốc tịch</li>
                    <li>• Kinh nghiệm dạy và chuyên môn</li>
                    <li>• Phong cách giảng dạy</li>
                    <li>• Một lời chào thân thiện với học viên</li>
                  </ul>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-primary shadow-hover"
                >
                  <CheckCircle2 className="h-14 w-14 text-white" />
                </motion.div>

                <div>
                  <h2 className="text-3xl font-bold">Đơn đăng ký đã được gửi!</h2>
                  <p className="mt-2 text-muted-foreground">
                    Đội ngũ OmniLingo sẽ xem xét và phản hồi trong 3-5 ngày làm việc
                  </p>
                </div>

                <div className="mx-auto max-w-md rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 p-6 text-left">
                  <h3 className="font-bold">Bước tiếp theo</h3>
                  <ul className="mt-3 space-y-3">
                    {[
                      "Kiểm tra email xác nhận",
                      "Hoàn thành bài kiểm tra giảng dạy",
                      "Phỏng vấn ngắn qua video",
                      "Bắt đầu dạy và nhận học viên",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {idx + 1}
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button asChild variant="outline" className="rounded-2xl">
                    <Link href="/">Về trang chủ</Link>
                  </Button>
                  <Button asChild className="rounded-2xl bg-gradient-primary shadow-hover">
                    <Link href="/dashboard">Về Dashboard</Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {step < 5 && (
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Bước {step} / 5
            </div>
            <Button
              onClick={() => setStep(step + 1)}
              className="h-12 gap-2 rounded-2xl bg-gradient-primary px-8 font-semibold shadow-hover"
            >
              {step === 4 ? "Gửi đơn đăng ký" : "Tiếp theo"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
