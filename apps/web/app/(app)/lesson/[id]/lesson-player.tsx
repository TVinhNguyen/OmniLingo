"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, CheckCircle2, XCircle, Volume2,
  ChevronRight, Loader2, Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Mock exercise data (content-service not integrated yet — Phase 1.5) ───────

type Exercise =
  | { type: "multiple-choice"; question: string; options: string[]; correct: number }
  | { type: "translate"; prompt: string; answer: string }
  | { type: "listen-type"; audio: string; answer: string };

const MOCK_EXERCISES: Exercise[] = [
  {
    type: "multiple-choice",
    question: "What does 'ありがとう' mean?",
    options: ["Good morning", "Thank you", "Goodbye", "Excuse me"],
    correct: 1,
  },
  {
    type: "translate",
    prompt: "Translate to Japanese: 'I am a student'",
    answer: "私は学生です",
  },
  {
    type: "multiple-choice",
    question: "Which is the correct particle for location?",
    options: ["は", "が", "に", "で"],
    correct: 2,
  },
  {
    type: "translate",
    prompt: "Translate to English: 'どこですか？'",
    answer: "Where is it?",
  },
  {
    type: "multiple-choice",
    question: "How do you say 'water' in Japanese?",
    options: ["お茶", "みず", "コーヒー", "ジュース"],
    correct: 1,
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

interface LessonPlayerProps {
  lessonId: string;
  sessionId: string;
}

export default function LessonPlayer({ lessonId, sessionId }: LessonPlayerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [finished, setFinished] = useState(false);

  const exercise = MOCK_EXERCISES[currentIdx];
  const progress = ((currentIdx) / MOCK_EXERCISES.length) * 100;

  const checkAnswer = () => {
    if (checked) {
      // Advance
      if (currentIdx < MOCK_EXERCISES.length - 1) {
        setCurrentIdx((i) => i + 1);
        setSelected(null);
        setInput("");
        setChecked(false);
        setCorrect(null);
      } else {
        setFinished(true);
      }
      return;
    }

    let isCorrect = false;
    if (exercise.type === "multiple-choice") {
      isCorrect = selected === exercise.correct;
    } else if (exercise.type === "translate") {
      isCorrect = input.trim().toLowerCase() === exercise.answer.toLowerCase();
    }

    setCorrect(isCorrect);
    setChecked(true);
    if (isCorrect) setXpEarned((x) => x + 10);
  };

  const canCheck =
    exercise.type === "multiple-choice" ? selected !== null : input.trim().length > 0;

  // ─── Finished screen ──────────────────────────────────────────────────────
  if (finished) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center py-20 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-primary/15">
            <Flame className="h-14 w-14 text-primary" />
          </div>
        </motion.div>

        <h1 className="font-serif text-3xl font-bold">Xuất sắc!</h1>
        <p className="mt-2 text-muted-foreground">
          Bạn đã hoàn thành bài học và kiếm được{" "}
          <span className="font-bold text-primary">{xpEarned} XP</span>.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Session: {sessionId.slice(0, 8)}…</p>

        <div className="mt-8 flex gap-3">
          <Button asChild variant="outline" className="rounded-full bg-transparent">
            <Link href="/learn">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về lộ trình
            </Link>
          </Button>
          <Button
            className="rounded-full bg-gradient-primary text-primary-foreground shadow-ambient"
            onClick={() => {
              setCurrentIdx(0);
              setSelected(null);
              setInput("");
              setChecked(false);
              setCorrect(null);
              setXpEarned(0);
              setFinished(false);
            }}
          >
            Học lại
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ─── Exercise screen ──────────────────────────────────────────────────────
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 pb-20">
      {/* Top bar */}
      <div className="flex items-center gap-4">
        <Link
          href="/learn"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-lowest shadow-ambient transition hover:scale-105"
          aria-label="Thoát"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Progress value={progress} className="h-3 flex-1 rounded-full" />
        <span className="min-w-10 text-right text-sm font-bold text-primary">
          {xpEarned} XP
        </span>
      </div>

      {/* Exercise card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-border/60 bg-card/80 p-8 shadow-soft">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
              {currentIdx + 1} / {MOCK_EXERCISES.length}
            </p>

            {exercise.type === "multiple-choice" && (
              <MultipleChoice
                exercise={exercise}
                selected={selected}
                onSelect={setSelected}
                checked={checked}
              />
            )}

            {exercise.type === "translate" && (
              <TranslateExercise
                exercise={exercise}
                value={input}
                onChange={setInput}
                checked={checked}
              />
            )}
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Feedback bar */}
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={cn(
              "rounded-2xl border p-4",
              correct
                ? "border-success/40 bg-success/10 text-success"
                : "border-destructive/40 bg-destructive/10 text-destructive",
            )}
          >
            <div className="flex items-center gap-2 font-semibold">
              {correct ? (
                <><CheckCircle2 className="h-5 w-5" /> Chính xác! +10 XP</>
              ) : (
                <><XCircle className="h-5 w-5" /> Chưa đúng — thử lần sau nhé!</>
              )}
            </div>
            {!correct && exercise.type === "translate" && (
              <p className="mt-1 text-sm opacity-80">
                Đáp án: <strong>{exercise.answer}</strong>
              </p>
            )}
            {!correct && exercise.type === "multiple-choice" && (
              <p className="mt-1 text-sm opacity-80">
                Đáp án: <strong>{exercise.options[exercise.correct]}</strong>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Check / Continue button */}
      <Button
        size="lg"
        disabled={!canCheck}
        onClick={checkAnswer}
        className="w-full rounded-full bg-gradient-primary text-primary-foreground shadow-ambient disabled:opacity-40"
      >
        {!checked ? "Kiểm tra" : currentIdx < MOCK_EXERCISES.length - 1 ? "Tiếp tục" : "Hoàn thành"}
        <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

// ─── Exercise sub-components ──────────────────────────────────────────────────

function MultipleChoice({
  exercise,
  selected,
  onSelect,
  checked,
}: {
  exercise: Extract<Exercise, { type: "multiple-choice" }>;
  selected: number | null;
  onSelect: (i: number) => void;
  checked: boolean;
}) {
  return (
    <>
      <h2 className="mb-6 font-serif text-2xl font-semibold">{exercise.question}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {exercise.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = checked && i === exercise.correct;
          const isWrong = checked && isSelected && i !== exercise.correct;
          return (
            <button
              key={i}
              disabled={checked}
              onClick={() => onSelect(i)}
              className={cn(
                "rounded-2xl border-2 px-5 py-4 text-left text-sm font-medium transition",
                isCorrect && "border-success bg-success/10 text-success",
                isWrong && "border-destructive bg-destructive/10 text-destructive",
                !checked && isSelected && "border-primary bg-primary/10",
                !checked && !isSelected && "border-border bg-surface-lowest hover:border-primary/60",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </>
  );
}

function TranslateExercise({
  exercise,
  value,
  onChange,
  checked,
}: {
  exercise: Extract<Exercise, { type: "translate" }>;
  value: string;
  onChange: (v: string) => void;
  checked: boolean;
}) {
  return (
    <>
      <div className="mb-2 flex items-center gap-2">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20">
          <Volume2 className="h-4 w-4" />
        </button>
        <p className="font-serif text-xl font-semibold">{exercise.prompt}</p>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={checked}
        placeholder="Nhập bản dịch của bạn..."
        rows={3}
        className="mt-4 w-full rounded-2xl border border-border bg-surface-lowest px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
      />
    </>
  );
}
