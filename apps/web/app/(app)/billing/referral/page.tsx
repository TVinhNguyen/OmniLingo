"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  Users,
  Gift,
  Check,
  Copy,
  Mail,
  MessageCircle,
  Share2,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const steps = [
  {
    icon: Share2,
    title: "Chia sẻ link",
    desc: "Gửi link mời bạn bè qua email, mạng xã hội, hoặc SMS",
    color: "from-primary to-accent",
  },
  {
    icon: Users,
    title: "Bạn bè tham gia",
    desc: "Khi bạn bè đăng ký và mua gói Plus+",
    color: "from-accent to-primary",
  },
  {
    icon: Gift,
    title: "Cả hai nhận thưởng",
    desc: "Bạn nhận 1 tháng Plus, bạn bè được giảm 20%",
    color: "from-success to-primary",
  },
]

const stats = [
  { label: "Bạn bè đã mời", value: 12, icon: Users, color: "from-primary to-accent" },
  { label: "Đã tham gia", value: 8, icon: Check, color: "from-success to-primary" },
  { label: "Đã subscribe", value: 3, icon: Sparkles, color: "from-accent to-warning" },
  { label: "Ngày Plus earned", value: 90, icon: Gift, color: "from-warning to-primary" },
]

const shareButtons = [
  { name: "Facebook", color: "bg-[#1877F2]", short: "FB" },
  { name: "Twitter", color: "bg-[#1DA1F2]", short: "X" },
  { name: "WhatsApp", color: "bg-[#25D366]", short: "WA" },
  { name: "Email", color: "bg-primary", icon: Mail },
  { name: "SMS", color: "bg-accent", icon: MessageCircle },
]

const history = [
  {
    email: "tran.an@example.com",
    status: "subscribed",
    date: "15/10/2024",
    reward: "30 ngày Plus",
  },
  {
    email: "minh.nguyen@example.com",
    status: "subscribed",
    date: "10/10/2024",
    reward: "30 ngày Plus",
  },
  {
    email: "linh.pham@example.com",
    status: "subscribed",
    date: "05/10/2024",
    reward: "30 ngày Plus",
  },
  { email: "ha.le@example.com", status: "signed-up", date: "02/10/2024", reward: "Pending" },
  { email: "son.do@example.com", status: "signed-up", date: "28/09/2024", reward: "Pending" },
  { email: "tu.nguyen@example.com", status: "invited", date: "25/09/2024", reward: "—" },
  { email: "mai.hoang@example.com", status: "invited", date: "20/09/2024", reward: "—" },
]

const faqs = [
  {
    q: "Khi nào tôi nhận được thưởng?",
    a: "Ngay sau khi bạn được mời hoàn thành thanh toán gói Plus/Pro/Ultimate. Bạn sẽ nhận 30 ngày miễn phí cộng thêm vào tài khoản.",
  },
  {
    q: "Có giới hạn số lượng người mời không?",
    a: "Không. Bạn có thể mời không giới hạn, mỗi người mời thành công được 30 ngày Plus miễn phí, tối đa 365 ngày/năm.",
  },
  {
    q: "Làm sao biết ai đã dùng link của tôi?",
    a: "Trong bảng 'Lịch sử giới thiệu' bên dưới, bạn sẽ thấy email và trạng thái của từng người.",
  },
  {
    q: "Thưởng có hết hạn không?",
    a: "Thưởng 30 ngày Plus không hết hạn nếu tài khoản của bạn còn active. Chúng được cộng dồn.",
  },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  invited: { label: "Đã mời", color: "bg-muted text-muted-foreground" },
  "signed-up": { label: "Đã đăng ký", color: "bg-warning/10 text-warning" },
  subscribed: { label: "Đã subscribe", color: "bg-success/10 text-success" },
}

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const link = "https://omnilingo.app/r/USER123"

  const copy = () => {
    navigator.clipboard?.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/billing"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Về billing
      </Link>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-primary p-8 text-white shadow-hover"
      >
        <div className="absolute -top-20 -right-20 opacity-20">
          <Users className="h-72 w-72" />
        </div>
        <div className="relative max-w-2xl">
          <Badge className="mb-3 bg-white/20 backdrop-blur">Chương trình giới thiệu</Badge>
          <h1 className="font-sans text-3xl font-bold text-balance lg:text-5xl">
            Mời bạn bè - Nhận 1 tháng Plus miễn phí
          </h1>
          <p className="mt-3 text-white/90">
            Chia sẻ OmniLingo với người thân. Mỗi người bạn đăng ký gói trả phí, bạn nhận 30 ngày
            Plus miễn phí.
          </p>
        </div>
      </motion.div>

      {/* How it works */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <h2 className="mb-6 text-center text-2xl font-bold">Cách hoạt động</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-3xl bg-surface-lowest p-6 shadow-ambient"
            >
              <div className="absolute top-3 right-4 text-6xl font-bold text-surface-low">
                {i + 1}
              </div>
              <div
                className={`mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${s.color} text-white`}
              >
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Referral link */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-10 rounded-3xl bg-surface-lowest p-6 shadow-ambient sm:p-8"
      >
        <h2 className="text-xl font-bold">Link giới thiệu của bạn</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Chia sẻ link này với bạn bè để nhận thưởng
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input value={link} readOnly className="h-12 rounded-xl text-base font-mono" />
          <Button
            onClick={copy}
            className={`h-12 gap-2 rounded-xl px-6 shadow-ambient ${
              copied ? "bg-success text-white" : "bg-primary"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Đã copy
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy link
              </>
            )}
          </Button>
        </div>

        <div className="mt-6">
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Chia sẻ nhanh
          </div>
          <div className="flex flex-wrap gap-2">
            {shareButtons.map((s) => (
              <button
                key={s.name}
                className={`flex items-center gap-2 rounded-xl ${s.color} px-4 py-2.5 text-sm font-medium text-white shadow-ambient transition-transform hover:-translate-y-0.5`}
              >
                {s.icon ? <s.icon className="h-4 w-4" /> : <span>{s.short}</span>}
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10"
      >
        <h2 className="mb-4 text-xl font-bold">Thống kê của bạn</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="rounded-3xl bg-surface-lowest p-5 shadow-ambient"
            >
              <div
                className={`mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${s.color} text-white`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* History */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10 overflow-hidden rounded-3xl bg-surface-lowest shadow-ambient"
      >
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Lịch sử giới thiệu</h2>
            <Badge variant="secondary">{history.length} người</Badge>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-low">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Thưởng
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-sm">{h.email}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className={`rounded-full ${statusConfig[h.status].color} border-0`}
                    >
                      {statusConfig[h.status].label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{h.date}</td>
                  <td className="px-6 py-4 text-sm font-medium">{h.reward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="mb-4 text-xl font-bold">Câu hỏi thường gặp</h2>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl bg-surface-lowest shadow-ambient"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left font-medium"
              >
                {f.q}
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="border-t border-border px-4 pb-4 pt-3 text-sm text-muted-foreground"
                >
                  {f.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
