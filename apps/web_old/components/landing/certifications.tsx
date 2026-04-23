const certs = [
  { label: "IELTS", sub: "British Council" },
  { label: "TOEIC", sub: "Business English" },
  { label: "TOEFL", sub: "Academic" },
  { label: "HSK", sub: "Chinese 1-9" },
  { label: "JLPT", sub: "Japanese N5-N1" },
  { label: "TOPIK", sub: "Korean 1-6" },
  { label: "DELF", sub: "French A1-C2" },
  { label: "Goethe", sub: "German A1-C2" },
]

export function Certifications() {
  return (
    <section id="certifications" className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-center">
          <div data-aos="fade-right">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
              Được công nhận toàn cầu
            </p>
            <h2 className="font-sans text-4xl font-extrabold tracking-tight sm:text-5xl text-balance">
              Luyện thi cho{" "}
              <span className="text-gradient-fluency">8+ chứng chỉ</span> quốc
              tế
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Đề thi thật, chấm AI theo rubric chuẩn, dự đoán band điểm chính
              xác tới 0.5. Có proctored mock test cho học viên Ultimate.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-surface-lowest px-4 py-2 text-sm font-semibold shadow-ambient">
                ✓ Đề thi Cambridge thật
              </span>
              <span className="rounded-full bg-surface-lowest px-4 py-2 text-sm font-semibold shadow-ambient">
                ✓ AI grader rubric chuẩn
              </span>
              <span className="rounded-full bg-surface-lowest px-4 py-2 text-sm font-semibold shadow-ambient">
                ✓ Dự đoán band ±0.5
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {certs.map((c, i) => (
              <div
                key={c.label}
                data-aos="zoom-in"
                data-aos-delay={i * 50}
                className="group relative flex aspect-square flex-col items-center justify-center rounded-3xl bg-surface-lowest p-6 text-center shadow-ambient transition-all duration-500 hover:shadow-hover hover:-translate-y-1"
              >
                <span className="text-2xl font-extrabold tracking-tight text-gradient-primary sm:text-3xl">
                  {c.label}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {c.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
