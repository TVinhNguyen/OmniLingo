"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowLeft, Mic, MicOff, Play, RotateCcw, Volume2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const prompts = [
  {
    phrase: "I'd like to make a reservation for two, please.",
    phonetic: "/aɪd laɪk tʊ meɪk ə rɛzərˈveɪʃən fɔr tuː pliːz/",
    context: "At a restaurant",
    scores: { pronunciation: 92, fluency: 85, accuracy: 88 },
  },
  {
    phrase: "Could you tell me where the nearest train station is?",
    phonetic: "/kʊd juː tɛl miː wɛr ðə ˈnɪərɪst treɪn ˈsteɪʃən ɪz/",
    context: "Asking for directions",
    scores: { pronunciation: 78, fluency: 80, accuracy: 75 },
  },
]

export default function SpeakingPage() {
  const [recording, setRecording] = useState(false)
  const [done, setDone] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [levels, setLevels] = useState<number[]>(Array(32).fill(10))
  const prompt = prompts[currentIdx]

  // Fake animated audio levels while recording
  useEffect(() => {
    if (!recording) {
      setLevels(Array(32).fill(10))
      return
    }
    const id = setInterval(() => {
      setLevels(Array.from({ length: 32 }, () => 20 + Math.random() * 80))
    }, 120)
    return () => clearInterval(id)
  }, [recording])

  const handleStop = () => {
    setRecording(false)
    setDone(true)
  }

  const overall = Math.round(
    (prompt.scores.pronunciation + prompt.scores.fluency + prompt.scores.accuracy) / 3,
  )

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/practice"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to practice
      </Link>

      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            Speaking
          </Badge>
          <Badge variant="outline" className="rounded-full">
            {prompt.context}
          </Badge>
        </div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Pronunciation coach</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Read the phrase out loud. Our AI will analyze your pronunciation, fluency and accuracy.
        </p>
      </div>

      <Card className="mb-6 border-border/60 bg-card/80 p-8 shadow-soft">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Say this phrase
          </span>
          <Button variant="ghost" size="sm" className="rounded-full">
            <Volume2 className="mr-1.5 size-4" />
            Listen to native
          </Button>
        </div>
        <p className="font-serif text-3xl font-semibold leading-snug text-foreground md:text-4xl">
          {prompt.phrase}
        </p>
        <p className="mt-3 font-mono text-sm text-muted-foreground">{prompt.phonetic}</p>
      </Card>

      {/* Recording area */}
      <Card className="mb-6 border-border/60 bg-card/80 p-8 shadow-soft">
        <div className="flex flex-col items-center">
          {/* Visualizer */}
          <div className="mb-6 flex h-24 items-center gap-1">
            {levels.map((l, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-1.5 rounded-full",
                  recording ? "bg-primary" : "bg-border",
                )}
                animate={{ height: `${l}%` }}
                transition={{ duration: 0.15 }}
              />
            ))}
          </div>

          {/* Mic button */}
          <motion.button
            onClick={() => {
              if (recording) handleStop()
              else {
                setRecording(true)
                setDone(false)
              }
            }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative flex size-20 items-center justify-center rounded-full text-primary-foreground shadow-lg transition",
              recording ? "bg-destructive" : "bg-primary",
            )}
          >
            {recording && (
              <>
                <span className="absolute inset-0 animate-ping rounded-full bg-destructive/40" />
                <span className="absolute inset-0 animate-pulse rounded-full bg-destructive/20" />
              </>
            )}
            {recording ? <MicOff className="relative size-8" /> : <Mic className="relative size-8" />}
          </motion.button>

          <p className="mt-4 text-sm text-muted-foreground">
            {recording ? "Recording… tap to stop" : done ? "Tap to try again" : "Tap the mic to start"}
          </p>
        </div>
      </Card>

      {/* Feedback */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <Card className="border-border/60 bg-card/80 p-6 shadow-soft">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-semibold">AI Feedback</h3>
                  <p className="text-sm text-muted-foreground">Overall pronunciation score</p>
                </div>
                <div className="text-right">
                  <div className="font-serif text-4xl font-bold text-primary">{overall}</div>
                  <div className="text-xs text-muted-foreground">out of 100</div>
                </div>
              </div>

              <div className="mb-6 space-y-4">
                {Object.entries(prompt.scores).map(([key, val]) => (
                  <div key={key}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium capitalize text-foreground">{key}</span>
                      <span className="font-semibold">{val}/100</span>
                    </div>
                    <Progress value={val} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-accent/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="size-4 text-success" />
                  Tips for improvement
                </div>
                <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Stress the word &quot;reservation&quot; on the third syllable: re-ser-VA-tion</li>
                  <li>Try to link &quot;make a&quot; more smoothly — it should sound like &quot;may-kuh&quot;</li>
                  <li>Your intonation rises naturally at &quot;please&quot; — good job!</li>
                </ul>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Button variant="outline" className="rounded-full bg-transparent">
                  <Play className="mr-2 size-4" />
                  Play your recording
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setDone(false)}
                    className="rounded-full bg-transparent"
                  >
                    <RotateCcw className="mr-2 size-4" />
                    Retry
                  </Button>
                  <Button
                    onClick={() => {
                      setDone(false)
                      setCurrentIdx((i) => (i + 1) % prompts.length)
                    }}
                    className="rounded-full"
                  >
                    Next phrase
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
