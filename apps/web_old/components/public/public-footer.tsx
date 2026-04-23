import Link from "next/link"
import { Globe2 } from "lucide-react"
import { LogoMark } from "./public-navbar"

const columns = [
  {
    title: "Sản phẩm",
    links: [
      { label: "Tính năng", href: "/#features" },
      { label: "Khóa học", href: "/courses" },
      { label: "Bảng giá", href: "/pricing" },
      { label: "Chứng chỉ", href: "/#certifications" },
    ],
  },
  {
    title: "Công ty",
    links: [
      { label: "Về chúng tôi", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Trở thành giáo viên", href: "/become-tutor" },
      { label: "Liên hệ", href: "/contact" },
    ],
  },
  {
    title: "Tài nguyên",
    links: [
      { label: "Trung tâm trợ giúp", href: "/help" },
      { label: "Câu hỏi thường gặp", href: "/#faq" },
      { label: "Cộng đồng", href: "/community" },
    ],
  },
  {
    title: "Pháp lý",
    links: [
      { label: "Điều khoản", href: "/terms" },
      { label: "Bảo mật", href: "/privacy" },
      { label: "Cookie", href: "/cookies" },
    ],
  },
]

export function PublicFooter() {
  return (
    <footer className="bg-surface-low">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <LogoMark />
              <span className="text-lg font-bold">OmniLingo</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Nền tảng học ngoại ngữ thông minh với AI tutor, SRS, và giáo viên
              bản xứ. Đạt chứng chỉ nhanh hơn.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <select
                className="rounded-full bg-surface-lowest px-4 py-2 text-sm font-medium outline-none shadow-ambient"
                aria-label="Chọn ngôn ngữ giao diện"
              >
                <option>🇻🇳 Tiếng Việt</option>
                <option>🇬🇧 English</option>
                <option>🇯🇵 日本語</option>
                <option>🇰🇷 한국어</option>
              </select>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} OmniLingo. Made with care by language lovers.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5" />
              Có mặt tại 40+ quốc gia
            </span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span>3.2M học viên</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
