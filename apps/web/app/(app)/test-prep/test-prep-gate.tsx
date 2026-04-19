"use client";

import Link from "next/link";
import { Lock, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/** Shown to Free-tier users who don't have test_prep access. */
export default function TestPrepGate() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Lock className="h-10 w-10 text-primary" />
      </div>

      <Badge variant="secondary" className="mb-4 rounded-full">
        <Crown className="mr-1 size-3 text-warning" />
        Tính năng Premium
      </Badge>

      <h1 className="font-serif text-3xl font-bold tracking-tight">
        Luyện thi chứng chỉ
      </h1>
      <p className="mt-3 text-muted-foreground">
        Truy cập toàn bộ đề thi mock IELTS, TOEIC, TOEFL và bài tập theo phần với gói{" "}
        <strong>Plus</strong> trở lên.
      </p>

      <Card className="mt-8 w-full border-border/60 bg-card/80 p-6 text-left">
        <div className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Bao gồm trong gói Plus +
        </div>
        <ul className="space-y-3 text-sm">
          {[
            "3 đề mock test / tháng (IELTS, TOEIC, TOEFL)",
            "Bài tập theo kỹ năng yếu",
            "Phân tích kết quả chi tiết",
            "Dự đoán band score",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline" className="rounded-full bg-transparent">
          <Link href="/dashboard">Quay lại</Link>
        </Button>
        <Button
          asChild
          className="rounded-full bg-gradient-primary text-primary-foreground shadow-ambient"
        >
          <Link href="/pricing">
            <Crown className="mr-2 h-4 w-4" />
            Nâng cấp ngay
          </Link>
        </Button>
      </div>
    </div>
  );
}
