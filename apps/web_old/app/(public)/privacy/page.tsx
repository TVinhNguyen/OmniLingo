import { Badge } from "@/components/ui/badge"

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-3xl px-4">
        <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5 text-xs font-semibold">
          Pháp lý
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          Chính sách bảo mật
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Cập nhật lần cuối: 01/04/2026</p>

        <div className="mt-10 space-y-6">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-bold tracking-tight">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

const sections = [
  {
    title: "Dữ liệu chúng tôi thu thập",
    body:
      "Thông tin tài khoản (tên, email), dữ liệu học tập (tiến độ, điểm số), thiết bị và nhật ký truy cập, thông tin thanh toán qua đối tác (Stripe, VNPay).",
  },
  {
    title: "Cách chúng tôi sử dụng dữ liệu",
    body:
      "Cá nhân hoá lộ trình học, cải thiện thuật toán SRS, gửi thông báo và email quan trọng, phòng chống gian lận. Chúng tôi KHÔNG bán dữ liệu cá nhân cho bên thứ ba.",
  },
  {
    title: "Chia sẻ với bên thứ ba",
    body:
      "Chỉ chia sẻ với nhà cung cấp hạ tầng (Vercel, Supabase, Stripe) theo hợp đồng nghiêm ngặt. Không chia sẻ vì mục đích tiếp thị của bên khác.",
  },
  {
    title: "Quyền của bạn",
    body:
      "Theo GDPR và Luật Bảo vệ dữ liệu cá nhân Việt Nam: quyền truy cập, chỉnh sửa, xoá, xuất dữ liệu, rút lại đồng ý. Gửi yêu cầu tới privacy@omnilingo.app.",
  },
  {
    title: "Cookie",
    body:
      "Chúng tôi sử dụng cookie thiết yếu (đăng nhập), phân tích (thống kê ẩn danh) và marketing (có thể tắt). Xem thêm tại trang Cookie.",
  },
  {
    title: "Bảo mật",
    body:
      "Mã hoá TLS 1.3 khi truyền, mã hoá AES-256 khi lưu trữ. Mật khẩu băm bằng bcrypt. Audit bảo mật định kỳ 2 lần/năm bởi bên thứ ba độc lập.",
  },
  {
    title: "Trẻ em dưới 13 tuổi",
    body:
      "OmniLingo không chủ động thu thập dữ liệu trẻ em dưới 13. Nếu bạn là phụ huynh và phát hiện con mình đã đăng ký, vui lòng liên hệ để xoá.",
  },
  {
    title: "Liên hệ DPO",
    body:
      "Data Protection Officer: privacy@omnilingo.app. Chúng tôi phản hồi trong 30 ngày theo quy định GDPR.",
  },
]
