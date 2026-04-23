import { use } from "react"
import Link from "next/link"
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function HelpArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  return (
    <main className="min-h-dvh bg-surface-low pt-16">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/help">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Trung tâm trợ giúp
          </Link>
        </Button>

        <Badge>Tài khoản</Badge>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-pretty sm:text-4xl">
          Cách đặt lại mật khẩu tài khoản của bạn
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Cập nhật: 10/03/2026 · 3 phút đọc</p>

        <div className="mt-10 space-y-5 text-lg leading-relaxed">
          <p>
            Nếu bạn quên mật khẩu, đừng lo lắng. OmniLingo cung cấp quy trình đặt lại mật khẩu đơn
            giản và an toàn. Làm theo các bước dưới đây để lấy lại quyền truy cập tài khoản.
          </p>

          <h2 className="mt-10 font-serif text-2xl font-semibold">Bước 1: Truy cập trang Quên mật khẩu</h2>
          <p>
            Tại trang đăng nhập, nhấn vào liên kết <strong>&quot;Quên mật khẩu?&quot;</strong> bên
            dưới ô nhập mật khẩu. Bạn sẽ được chuyển đến trang yêu cầu email.
          </p>

          <h2 className="mt-10 font-serif text-2xl font-semibold">Bước 2: Nhập email đã đăng ký</h2>
          <p>
            Nhập chính xác địa chỉ email bạn đã dùng khi đăng ký tài khoản. Nếu không nhớ, hãy kiểm
            tra email xác nhận đăng ký từ OmniLingo trong hộp thư của bạn.
          </p>

          <h2 className="mt-10 font-serif text-2xl font-semibold">Bước 3: Kiểm tra email</h2>
          <p>
            Trong vòng 2 phút, bạn sẽ nhận được email có chứa link đặt lại mật khẩu. Link có hiệu
            lực trong 24 giờ. Nếu không thấy email, hãy kiểm tra thư mục Spam.
          </p>

          <h2 className="mt-10 font-serif text-2xl font-semibold">Bước 4: Tạo mật khẩu mới</h2>
          <p>
            Nhấn vào link trong email, bạn sẽ được chuyển đến trang tạo mật khẩu mới. Mật khẩu mới
            cần đáp ứng các yêu cầu:
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Tối thiểu 8 ký tự</li>
            <li>Có ít nhất 1 chữ hoa</li>
            <li>Có ít nhất 1 chữ số</li>
            <li>Có ít nhất 1 ký tự đặc biệt</li>
          </ul>
        </div>

        <div className="mt-16 rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
          <div className="text-center">
            <p className="font-semibold">Bài viết này có hữu ích không?</p>
            <div className="mt-3 flex justify-center gap-3">
              <Button variant="outline" size="sm">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Có
              </Button>
              <Button variant="outline" size="sm">
                <ThumbsDown className="mr-2 h-4 w-4" />
                Không
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-surface-lowest p-6 text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 font-semibold">Vẫn cần trợ giúp?</p>
          <p className="mt-1 text-sm text-muted-foreground">Đội ngũ hỗ trợ luôn sẵn sàng</p>
          <Button asChild className="mt-4">
            <Link href="/contact">Liên hệ hỗ trợ</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
