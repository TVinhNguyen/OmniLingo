"use client";

import { useState, useRef, useEffect, useActionState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, Send, Mic, Volume2, BookOpen,
  MessageSquare, Languages, Lightbulb, Copy, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { sendMessageAction, type SendMessageState } from "./actions";

const SUGGESTIONS = [
  { icon: MessageSquare, label: "Roleplay: ordering food at a café" },
  { icon: BookOpen, label: "Explain past perfect with examples" },
  { icon: Languages, label: "Translate: 'Tôi muốn đặt bàn cho hai người'" },
  { icon: Lightbulb, label: "Quiz me on 10 travel words" },
];

type Message = {
  id: number;
  role: "user" | "ai";
  content: string;
};

const WELCOME: Message = {
  id: 0,
  role: "ai",
  content:
    "Xin chào! Tôi là Lumi, trợ giảng AI của bạn. Chúng ta có thể trò chuyện bằng tiếng Anh hoặc bất kỳ ngôn ngữ nào bạn đang học. Bạn muốn luyện gì hôm nay?",
};

interface AiTutorClientProps {
  initialQuota: number;
}

export default function AiTutorClient({ initialQuota }: AiTutorClientProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [quotaRemaining, setQuotaRemaining] = useState(initialQuota);
  const scrollRef = useRef<HTMLDivElement>(null);

  const initialState: SendMessageState = {};
  const [state, formAction, isPending] = useActionState(sendMessageAction, initialState);

  // Append AI reply when server action resolves
  useEffect(() => {
    if (state.reply) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "ai", content: state.reply! },
      ]);
      if (state.conversationId) setConversationId(state.conversationId);
      if (state.quotaRemaining !== undefined) setQuotaRemaining(state.quotaRemaining);
    }
  }, [state]);

  // Optimistic user message append on pending
  const pendingRef = useRef<string>("");

  const handleSubmit = (text: string) => {
    if (!text.trim() || isPending) return;
    pendingRef.current = text;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: text },
    ]);
    setInput("");
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isPending]);

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-5xl flex-col">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              <Sparkles className="mr-1 size-3" />
              AI Tutor
            </Badge>
            <Badge variant="outline" className="rounded-full text-xs">
              {quotaRemaining} lượt còn lại hôm nay
            </Badge>
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Lumi</h1>
          <p className="text-sm text-muted-foreground">
            Trợ giảng AI 24/7 — luyện hội thoại, ngữ pháp và từ vựng
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-full bg-transparent"
          onClick={() => {
            setMessages([WELCOME]);
            setConversationId(undefined);
          }}
        >
          Cuộc hội thoại mới
        </Button>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden border-border/60 bg-card/80 shadow-soft">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
                >
                  <Avatar className="size-9 shrink-0">
                    {m.role === "ai" ? (
                      <AvatarFallback className="bg-primary/15 text-primary">
                        <Sparkles className="size-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-accent text-foreground">You</AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      m.role === "ai"
                        ? "rounded-tl-sm bg-accent/60 text-foreground"
                        : "rounded-tr-sm bg-primary text-primary-foreground",
                    )}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    {m.role === "ai" && (
                      <div className="mt-3 flex gap-1">
                        <button className="inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
                          <Volume2 className="size-3" />
                          Nghe
                        </button>
                        <button className="inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
                          <Languages className="size-3" />
                          Dịch
                        </button>
                        <button
                          onClick={() => navigator.clipboard.writeText(m.content)}
                          className="inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="size-3" />
                          Sao chép
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator while pending */}
            {isPending && (
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary/15 text-primary">
                    <Sparkles className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-accent/60 px-4 py-3">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <motion.span
                      key={i}
                      className="size-2 rounded-full bg-primary/60"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error banner */}
        {state.error && (
          <div className="border-t border-border/60 px-6 py-3">
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {state.error}
            </div>
          </div>
        )}

        {/* Suggestions (first message only) */}
        {messages.length === 1 && (
          <div className="border-t border-border/60 px-6 py-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Thử hỏi
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSubmit(s.label)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary"
                >
                  <s.icon className="size-3.5" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer — Server Action form */}
        <form
          action={(formData) => {
            handleSubmit(input);
            formAction(formData);
          }}
          className="border-t border-border/60 bg-card/60 p-4"
        >
          {/* Hidden fields for Server Action */}
          <input type="hidden" name="message" value={input} />
          {conversationId && (
            <input type="hidden" name="conversationId" value={conversationId} />
          )}
          <input type="hidden" name="language" value="en" />

          <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-background p-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const form = e.currentTarget.closest("form") as HTMLFormElement;
                  form?.requestSubmit();
                }
              }}
              rows={1}
              placeholder="Hỏi bất cứ điều gì về ngôn ngữ bạn đang học..."
              className="min-h-9 resize-none border-0 bg-transparent p-2 shadow-none focus-visible:ring-0"
            />
            <Button variant="ghost" size="icon" className="rounded-full" type="button">
              <Mic className="size-4" />
            </Button>
            <Button
              type="submit"
              disabled={!input.trim() || isPending || quotaRemaining === 0}
              size="icon"
              className="rounded-full"
            >
              <Send className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Lumi có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
          </p>
        </form>
      </Card>
    </div>
  );
}
