import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTABanner() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div
          data-aos="zoom-in"
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-primary p-10 text-center shadow-hover sm:p-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#983772]/40 blur-3xl"
          />

          <h2 className="relative font-sans text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground text-balance sm:text-5xl">
            Thứ ngôn ngữ bạn luôn muốn học
            <br />
            đang đợi bạn hôm nay.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-primary-foreground/85">
            Đăng ký miễn phí. Không cần thẻ tín dụng. Bắt đầu lesson đầu tiên
            trong 30 giây.
          </p>

          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-primary hover:bg-white/90 shadow-hover"
            >
              <Link href="/sign-up">
                Bắt đầu miễn phí
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              <Link href="/pricing">So sánh các gói</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
