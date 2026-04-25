"use client"

import { use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  Headphones,
  Mic,
  PenLine,
  Clock,
  Target,
  TrendingUp,
  CheckCircle2,
  Play,
  Lock,
  ChevronRight,
  Trophy,
  Sparkles,
  FileText,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const examData: Record<
  string,
  {
    name: string
    fullName: string
    targetScore: string
    currentScore: string
    daysLeft: number
    skills: { name: string; icon: typeof BookOpen; score: number; target: number; color: string }[]
    studyPlan: { week: number; focus: string; hours: number; completed: boolean; active?: boolean }[]
    mockExams: { id: string; name: string; date: string; score?: number; duration: string; locked?: boolean }[]
    resources: { type: string; title: string; count: number; href: string }[]
  }
> = {
  ielts: {
    name: "IELTS",
    fullName: "International English Language Testing System",
    targetScore: "7.0",
    currentScore: "6.0",
    daysLeft: 45,
    skills: [
      { name: "Reading", icon: BookOpen, score: 6.5, target: 7.0, color: "from-[#5352a5] to-[#a19ff9]" },
      { name: "Listening", icon: Headphones, score: 6.0, target: 7.0, color: "from-[#702ae1] to-[#b48bff]" },
      { name: "Writing", icon: PenLine, score: 5.5, target: 7.0, color: "from-[#983772] to-[#d56ba6]" },
      { name: "Speaking", icon: Mic, score: 6.0, target: 7.0, color: "from-[#2e9e6a] to-[#5cc29a]" },
    ],
    studyPlan: [
      { week: 1, focus: "Reading Strategies & Vocabulary", hours: 10, completed: true },
      { week: 2, focus: "Listening Section 1-2", hours: 10, completed: true },
      { week: 3, focus: "Writing Task 1 (Academic)", hours: 12, completed: false, active: true },
      { week: 4, focus: "Writing Task 2 (Essay)", hours: 12, completed: false },
      { week: 5, focus: "Speaking Part 1 & 2", hours: 8, completed: false },
      { week: 6, focus: "Speaking Part 3 & Mock Test", hours: 10, completed: false },
    ],
    mockExams: [
      { id: "m1", name: "Mock Test 1", date: "15 Jan", score: 6.0, duration: "2h 45m" },
      { id: "m2", name: "Mock Test 2", date: "22 Jan", score: 6.5, duration: "2h 45m" },
      { id: "m3", name: "Mock Test 3", date: "Sẵn sàng", duration: "2h 45m" },
      { id: "m4", name: "Full Practice Test", date: "Sắp mở", duration: "2h 45m", locked: true },
    ],
    resources: [
      { type: "lessons", title: "Bài học", count: 48, href: "/learn" },
      { type: "practice", title: "Bài tập", count: 120, href: "/practice" },
      { type: "vocabulary", title: "Từ vựng", count: 2500, href: "/practice/vocabulary" },
      { type: "templates", title: "Mẫu Writing", count: 24, href: "/writing-center" },
    ],
  },
  toefl: {
    name: "TOEFL iBT",
    fullName: "Test of English as a Foreign Language",
    targetScore: "100",
    currentScore: "82",
    daysLeft: 60,
    skills: [
      { name: "Reading", icon: BookOpen, score: 22, target: 26, color: "from-[#5352a5] to-[#a19ff9]" },
      { name: "Listening", icon: Headphones, score: 20, target: 25, color: "from-[#702ae1] to-[#b48bff]" },
      { name: "Writing", icon: PenLine, score: 19, target: 24, color: "from-[#983772] to-[#d56ba6]" },
      { name: "Speaking", icon: Mic, score: 21, target: 25, color: "from-[#2e9e6a] to-[#5cc29a]" },
    ],
    studyPlan: [
      { week: 1, focus: "Integrated Writing Skills", hours: 12, completed: true },
      { week: 2, focus: "Independent Writing Practice", hours: 12, completed: false, active: true },
      { week: 3, focus: "Speaking Tasks 1-2", hours: 10, completed: false },
      { week: 4, focus: "Speaking Tasks 3-4", hours: 10, completed: false },
      { week: 5, focus: "Listening & Note-taking", hours: 8, completed: false },
      { week: 6, focus: "Full Practice Tests", hours: 15, completed: false },
    ],
    mockExams: [
      { id: "tm1", name: "Mock Test 1", date: "10 Jan", score: 75, duration: "3h" },
      { id: "tm2", name: "Mock Test 2", date: "Sẵn sàng", duration: "3h" },
      { id: "tm3", name: "Mock Test 3", date: "Sắp mở", duration: "3h", locked: true },
      { id: "tm4", name: "Adaptive Test", date: "Sắp mở", duration: "3h", locked: true },
    ],
    resources: [
      { type: "lessons", title: "Bài học", count: 52, href: "/learn" },
      { type: "practice", title: "Bài tập", count: 140, href: "/practice" },
      { type: "vocabulary", title: "Academic Words", count: 3000, href: "/practice/vocabulary" },
      { type: "templates", title: "Mẫu Writing", count: 32, href: "/writing-center" },
    ],
  },
  toeic: {
    name: "TOEIC",
    fullName: "Test of English for International Communication",
    targetScore: "900",
    currentScore: "720",
    daysLeft: 50,
    skills: [
      { name: "Listening", icon: Headphones, score: 380, target: 470, color: "from-[#702ae1] to-[#b48bff]" },
      { name: "Reading", icon: BookOpen, score: 340, target: 430, color: "from-[#5352a5] to-[#a19ff9]" },
      { name: "Speaking", icon: Mic, score: 150, target: 180, color: "from-[#2e9e6a] to-[#5cc29a]" },
      { name: "Writing", icon: PenLine, score: 140, target: 180, color: "from-[#983772] to-[#d56ba6]" },
    ],
    studyPlan: [
      { week: 1, focus: "Part 1-2: Photo & Q&A", hours: 8, completed: true },
      { week: 2, focus: "Part 3-4: Conversations", hours: 10, completed: true },
      { week: 3, focus: "Part 5-6: Grammar & Cloze", hours: 10, completed: false, active: true },
      { week: 4, focus: "Part 7: Reading Comprehension", hours: 12, completed: false },
      { week: 5, focus: "Business Vocabulary", hours: 8, completed: false },
      { week: 6, focus: "Mock Tests & Review", hours: 10, completed: false },
    ],
    mockExams: [
      { id: "toeic-m1", name: "Mock Test 1", date: "08 Jan", score: 680, duration: "2h" },
      { id: "toeic-m2", name: "Mock Test 2", date: "Sẵn sàng", duration: "2h" },
      { id: "toeic-m3", name: "Speaking Mock", date: "Sẵn sàng", duration: "20m" },
      { id: "toeic-m4", name: "Writing Mock", date: "Sắp mở", duration: "60m", locked: true },
    ],
    resources: [
      { type: "lessons", title: "Bài học", count: 40, href: "/learn" },
      { type: "practice", title: "Bài tập", count: 200, href: "/practice" },
      { type: "vocabulary", title: "Business English", count: 1800, href: "/practice/vocabulary" },
      { type: "templates", title: "Mẫu Email", count: 20, href: "/writing-center" },
    ],
  },
  cambridge: {
    name: "Cambridge FCE/CAE/CPE",
    fullName: "Cambridge English Qualifications",
    targetScore: "CAE - Grade A",
    currentScore: "FCE - Grade B",
    daysLeft: 90,
    skills: [
      { name: "Reading & UoE", icon: BookOpen, score: 65, target: 80, color: "from-[#5352a5] to-[#a19ff9]" },
      { name: "Listening", icon: Headphones, score: 70, target: 82, color: "from-[#702ae1] to-[#b48bff]" },
      { name: "Writing", icon: PenLine, score: 60, target: 78, color: "from-[#983772] to-[#d56ba6]" },
      { name: "Speaking", icon: Mic, score: 68, target: 80, color: "from-[#2e9e6a] to-[#5cc29a]" },
    ],
    studyPlan: [
      { week: 1, focus: "Use of English: Transformations", hours: 10, completed: true },
      { week: 2, focus: "Reading: Multiple Matching", hours: 10, completed: false, active: true },
      { week: 3, focus: "Writing: Essay & Report", hours: 12, completed: false },
      { week: 4, focus: "Listening: Part 3 Multiple Choice", hours: 8, completed: false },
      { week: 5, focus: "Speaking: Collaborative Task", hours: 10, completed: false },
      { week: 6, focus: "Full Mock & Review", hours: 12, completed: false },
    ],
    mockExams: [
      { id: "cam-m1", name: "FCE Mock 1", date: "12 Jan", score: 72, duration: "3h 30m" },
      { id: "cam-m2", name: "CAE Mock 1", date: "Sẵn sàng", duration: "4h" },
      { id: "cam-m3", name: "CAE Mock 2", date: "Sắp mở", duration: "4h", locked: true },
      { id: "cam-m4", name: "CPE Mock", date: "Sắp mở", duration: "4h", locked: true },
    ],
    resources: [
      { type: "lessons", title: "Bài học", count: 60, href: "/learn" },
      { type: "practice", title: "Bài tập", count: 180, href: "/practice" },
      { type: "vocabulary", title: "Từ vựng C1-C2", count: 3500, href: "/practice/vocabulary" },
      { type: "templates", title: "Mẫu Writing", count: 28, href: "/writing-center" },
    ],
  },
  jlpt: {
    name: "JLPT (N5-N1)",
    fullName: "Japanese-Language Proficiency Test",
    targetScore: "N2",
    currentScore: "N3",
    daysLeft: 75,
    skills: [
      { name: "文字・語彙", icon: BookOpen, score: 42, target: 55, color: "from-[#5352a5] to-[#a19ff9]" },
      { name: "文法", icon: FileText, score: 38, target: 52, color: "from-[#702ae1] to-[#b48bff]" },
      { name: "読解", icon: BookOpen, score: 45, target: 58, color: "from-[#983772] to-[#d56ba6]" },
      { name: "聴解", icon: Headphones, score: 40, target: 55, color: "from-[#2e9e6a] to-[#5cc29a]" },
    ],
    studyPlan: [
      { week: 1, focus: "N3 Kanji 500 từ đầu", hours: 12, completed: true },
      { week: 2, focus: "N2 Kanji 300 từ mới", hours: 12, completed: false, active: true },
      { week: 3, focus: "Ngữ pháp N3-N2 cầu nối", hours: 10, completed: false },
      { week: 4, focus: "Đọc hiểu ngắn", hours: 8, completed: false },
      { week: 5, focus: "Đọc hiểu dài", hours: 10, completed: false },
      { week: 6, focus: "Luyện nghe N2", hours: 10, completed: false },
    ],
    mockExams: [
      { id: "jlpt-m1", name: "N3 Full Mock", date: "05 Jan", score: 125, duration: "2h 20m" },
      { id: "jlpt-m2", name: "N2 Mock 1", date: "Sẵn sàng", duration: "2h 35m" },
      { id: "jlpt-m3", name: "N2 Mock 2", date: "Sắp mở", duration: "2h 35m", locked: true },
      { id: "jlpt-m4", name: "N1 Sample", date: "Sắp mở", duration: "2h 45m", locked: true },
    ],
    resources: [
      { type: "lessons", title: "Bài học Kanji", count: 80, href: "/learn" },
      { type: "practice", title: "Drills ngữ pháp", count: 240, href: "/practice" },
      { type: "vocabulary", title: "Từ vựng N2", count: 4000, href: "/practice/vocabulary" },
      { type: "templates", title: "Câu mẫu", count: 60, href: "/writing-center" },
    ],
  },
  hsk: {
    name: "HSK (1-6)",
    fullName: "Hanyu Shuiping Kaoshi",
    targetScore: "HSK 5",
    currentScore: "HSK 4",
    daysLeft: 60,
    skills: [
      { name: "听力", icon: Headphones, score: 70, target: 85, color: "from-[#702ae1] to-[#b48bff]" },
      { name: "阅读", icon: BookOpen, score: 68, target: 85, color: "from-[#5352a5] to-[#a19ff9]" },
      { name: "写作", icon: PenLine, score: 55, target: 78, color: "from-[#983772] to-[#d56ba6]" },
      { name: "口语", icon: Mic, score: 60, target: 80, color: "from-[#2e9e6a] to-[#5cc29a]" },
    ],
    studyPlan: [
      { week: 1, focus: "HSK 4 - 600 từ ôn lại", hours: 10, completed: true },
      { week: 2, focus: "HSK 5 - 1300 từ mới (P1)", hours: 14, completed: false, active: true },
      { week: 3, focus: "HSK 5 - 1300 từ mới (P2)", hours: 14, completed: false },
      { week: 4, focus: "Ngữ pháp 离合词 & 把字句", hours: 10, completed: false },
      { week: 5, focus: "Đọc hiểu văn bản dài", hours: 10, completed: false },
      { week: 6, focus: "Viết 写作 80 chữ", hours: 8, completed: false },
    ],
    mockExams: [
      { id: "hsk-m1", name: "HSK 4 Mock", date: "03 Jan", score: 245, duration: "1h 45m" },
      { id: "hsk-m2", name: "HSK 5 Mock 1", date: "Sẵn sàng", duration: "2h 5m" },
      { id: "hsk-m3", name: "HSK 5 Mock 2", date: "Sắp mở", duration: "2h 5m", locked: true },
      { id: "hsk-m4", name: "HSKK Speaking", date: "Sắp mở", duration: "25m", locked: true },
    ],
    resources: [
      { type: "lessons", title: "Bài học", count: 48, href: "/learn" },
      { type: "practice", title: "Bài tập", count: 180, href: "/practice" },
      { type: "vocabulary", title: "Từ vựng HSK 5", count: 1300, href: "/practice/vocabulary" },
      { type: "templates", title: "Bài viết mẫu", count: 20, href: "/writing-center" },
    ],
  },
  delf: {
    name: "DELF/DALF",
    fullName: "Diplôme d'études en langue française",
    targetScore: "DELF B2",
    currentScore: "DELF B1",
    daysLeft: 80,
    skills: [
      { name: "Compréhension orale", icon: Headphones, score: 18, target: 22, color: "from-[#702ae1] to-[#b48bff]" },
      { name: "Compréhension écrite", icon: BookOpen, score: 20, target: 22, color: "from-[#5352a5] to-[#a19ff9]" },
      { name: "Production écrite", icon: PenLine, score: 16, target: 21, color: "from-[#983772] to-[#d56ba6]" },
      { name: "Production orale", icon: Mic, score: 17, target: 21, color: "from-[#2e9e6a] to-[#5cc29a]" },
    ],
    studyPlan: [
      { week: 1, focus: "Subjonctif présent & passé", hours: 10, completed: true },
      { week: 2, focus: "Production écrite: Essai argumentatif", hours: 12, completed: false, active: true },
      { week: 3, focus: "Compréhension orale B2", hours: 10, completed: false },
      { week: 4, focus: "Exposé oral & Débat", hours: 10, completed: false },
      { week: 5, focus: "Lecture articles de presse", hours: 8, completed: false },
      { week: 6, focus: "Examen blanc complet", hours: 12, completed: false },
    ],
    mockExams: [
      { id: "delf-m1", name: "DELF B1 Examen blanc", date: "10 Jan", score: 72, duration: "1h 45m" },
      { id: "delf-m2", name: "DELF B2 Mock 1", date: "Sẵn sàng", duration: "2h 30m" },
      { id: "delf-m3", name: "DELF B2 Mock 2", date: "Sắp mở", duration: "2h 30m", locked: true },
      { id: "delf-m4", name: "DALF C1 Sample", date: "Sắp mở", duration: "4h", locked: true },
    ],
    resources: [
      { type: "lessons", title: "Bài học", count: 44, href: "/learn" },
      { type: "practice", title: "Bài tập", count: 160, href: "/practice" },
      { type: "vocabulary", title: "Vocabulaire B2", count: 2200, href: "/practice/vocabulary" },
      { type: "templates", title: "Essais modèles", count: 18, href: "/writing-center" },
    ],
  },
  testdaf: {
    name: "TestDaF / Goethe",
    fullName: "Test Deutsch als Fremdsprache",
    targetScore: "TDN 4",
    currentScore: "TDN 3",
    daysLeft: 70,
    skills: [
      { name: "Leseverstehen", icon: BookOpen, score: 3, target: 4, color: "from-[#5352a5] to-[#a19ff9]" },
      { name: "Hörverstehen", icon: Headphones, score: 3, target: 4, color: "from-[#702ae1] to-[#b48bff]" },
      { name: "Schriftlicher Ausdruck", icon: PenLine, score: 3, target: 4, color: "from-[#983772] to-[#d56ba6]" },
      { name: "Mündlicher Ausdruck", icon: Mic, score: 3, target: 4, color: "from-[#2e9e6a] to-[#5cc29a]" },
    ],
    studyPlan: [
      { week: 1, focus: "Konjunktiv I & II Review", hours: 10, completed: true },
      { week: 2, focus: "Schriftlicher Ausdruck: Aufgabe 2", hours: 12, completed: false, active: true },
      { week: 3, focus: "Leseverstehen LV2 & LV3", hours: 10, completed: false },
      { week: 4, focus: "Hörverstehen HV3 komplex", hours: 10, completed: false },
      { week: 5, focus: "Mündlicher Ausdruck A1-A7", hours: 12, completed: false },
      { week: 6, focus: "Full Test & Review", hours: 10, completed: false },
    ],
    mockExams: [
      { id: "tdaf-m1", name: "TestDaF Mock 1", date: "07 Jan", score: 14, duration: "3h 10m" },
      { id: "tdaf-m2", name: "TestDaF Mock 2", date: "Sẵn sàng", duration: "3h 10m" },
      { id: "tdaf-m3", name: "Goethe C1 Sample", date: "Sắp mở", duration: "3h", locked: true },
      { id: "tdaf-m4", name: "Goethe C2 Sample", date: "Sắp mở", duration: "3h 40m", locked: true },
    ],
    resources: [
      { type: "lessons", title: "Unterricht", count: 46, href: "/learn" },
      { type: "practice", title: "Übungen", count: 170, href: "/practice" },
      { type: "vocabulary", title: "Wortschatz B2-C1", count: 2400, href: "/practice/vocabulary" },
      { type: "templates", title: "Aufsatz Muster", count: 22, href: "/writing-center" },
    ],
  },
  topik: {
    name: "TOPIK (I & II)",
    fullName: "Test of Proficiency in Korean",
    targetScore: "Level 5",
    currentScore: "Level 4",
    daysLeft: 65,
    skills: [
      { name: "듣기 (Nghe)", icon: Headphones, score: 72, target: 88, color: "from-[#702ae1] to-[#b48bff]" },
      { name: "읽기 (Đọc)", icon: BookOpen, score: 70, target: 85, color: "from-[#5352a5] to-[#a19ff9]" },
      { name: "쓰기 (Viết)", icon: PenLine, score: 55, target: 75, color: "from-[#983772] to-[#d56ba6]" },
      { name: "말하기 (Nói)", icon: Mic, score: 60, target: 78, color: "from-[#2e9e6a] to-[#5cc29a]" },
    ],
    studyPlan: [
      { week: 1, focus: "TOPIK II 문법 trung-cao cấp", hours: 10, completed: true },
      { week: 2, focus: "Từ vựng Level 5 (1200 từ)", hours: 12, completed: false, active: true },
      { week: 3, focus: "듣기 hiểu bài giảng", hours: 10, completed: false },
      { week: 4, focus: "읽기 văn bản dài", hours: 10, completed: false },
      { week: 5, focus: "쓰기 bài luận 600-700 chữ", hours: 12, completed: false },
      { week: 6, focus: "Mock Test & Review", hours: 10, completed: false },
    ],
    mockExams: [
      { id: "topik-m1", name: "TOPIK II Mock 1", date: "09 Jan", score: 156, duration: "3h" },
      { id: "topik-m2", name: "TOPIK II Mock 2", date: "Sẵn sàng", duration: "3h" },
      { id: "topik-m3", name: "Speaking Mock", date: "Sẵn sàng", duration: "30m" },
      { id: "topik-m4", name: "Full TOPIK Mock 3", date: "Sắp mở", duration: "3h", locked: true },
    ],
    resources: [
      { type: "lessons", title: "Bài học", count: 48, href: "/learn" },
      { type: "practice", title: "Bài tập", count: 180, href: "/practice" },
      { type: "vocabulary", title: "Từ vựng Level 5", count: 1200, href: "/practice/vocabulary" },
      { type: "templates", title: "Bài luận mẫu", count: 24, href: "/writing-center" },
    ],
  },
  cefr: {
    name: "CEFR General",
    fullName: "Common European Framework of Reference",
    targetScore: "C1",
    currentScore: "B2",
    daysLeft: 100,
    skills: [
      { name: "Listening", icon: Headphones, score: 68, target: 85, color: "from-[#702ae1] to-[#b48bff]" },
      { name: "Reading", icon: BookOpen, score: 72, target: 88, color: "from-[#5352a5] to-[#a19ff9]" },
      { name: "Writing", icon: PenLine, score: 60, target: 82, color: "from-[#983772] to-[#d56ba6]" },
      { name: "Speaking", icon: Mic, score: 65, target: 83, color: "from-[#2e9e6a] to-[#5cc29a]" },
    ],
    studyPlan: [
      { week: 1, focus: "Review B2 core grammar", hours: 10, completed: true },
      { week: 2, focus: "C1 vocabulary - Academic topics", hours: 12, completed: false, active: true },
      { week: 3, focus: "Reading: Complex texts & inference", hours: 10, completed: false },
      { week: 4, focus: "Listening: Lectures & debates", hours: 10, completed: false },
      { week: 5, focus: "Writing: Argumentative essay C1", hours: 12, completed: false },
      { week: 6, focus: "Speaking: Extended monologue", hours: 10, completed: false },
    ],
    mockExams: [
      { id: "cefr-m1", name: "CEFR Placement", date: "08 Jan", score: 72, duration: "1h 30m" },
      { id: "cefr-m2", name: "C1 Mock Full", date: "Sẵn sàng", duration: "3h" },
      { id: "cefr-m3", name: "Speaking Mock", date: "Sẵn sàng", duration: "20m" },
      { id: "cefr-m4", name: "C2 Sample", date: "Sắp mở", duration: "3h 30m", locked: true },
    ],
    resources: [
      { type: "lessons", title: "Lessons", count: 56, href: "/learn" },
      { type: "practice", title: "Exercises", count: 220, href: "/practice" },
      { type: "vocabulary", title: "C1 Word List", count: 2800, href: "/practice/vocabulary" },
      { type: "templates", title: "Essay Templates", count: 30, href: "/writing-center" },
    ],
  },
  goethe: {
    name: "Goethe-Zertifikat",
    fullName: "Goethe-Zertifikat Deutsch A1-C2",
    targetScore: "C1",
    currentScore: "B2",
    daysLeft: 85,
    skills: [
      { name: "Leseverstehen", icon: BookOpen, score: 65, target: 82, color: "from-[#5352a5] to-[#a19ff9]" },
      { name: "Hörverstehen", icon: Headphones, score: 68, target: 83, color: "from-[#702ae1] to-[#b48bff]" },
      { name: "Schreiben", icon: PenLine, score: 58, target: 78, color: "from-[#983772] to-[#d56ba6]" },
      { name: "Sprechen", icon: Mic, score: 62, target: 80, color: "from-[#2e9e6a] to-[#5cc29a]" },
    ],
    studyPlan: [
      { week: 1, focus: "B2 Grammatik Review", hours: 10, completed: true },
      { week: 2, focus: "C1 Wortschatz - Wissenschaft", hours: 12, completed: false, active: true },
      { week: 3, focus: "Leseverstehen C1 Texte", hours: 10, completed: false },
      { week: 4, focus: "Hörverstehen Vorträge", hours: 10, completed: false },
      { week: 5, focus: "Schreiben: Erörterung C1", hours: 12, completed: false },
      { week: 6, focus: "Sprechen: Prüfungsteil", hours: 10, completed: false },
    ],
    mockExams: [
      { id: "goethe-m1", name: "B2 Mock 1", date: "06 Jan", score: 78, duration: "3h 10m" },
      { id: "goethe-m2", name: "C1 Mock 1", date: "Sẵn sàng", duration: "3h 40m" },
      { id: "goethe-m3", name: "C1 Mock 2", date: "Sắp mở", duration: "3h 40m", locked: true },
      { id: "goethe-m4", name: "C2 Sample", date: "Sắp mở", duration: "4h", locked: true },
    ],
    resources: [
      { type: "lessons", title: "Unterricht", count: 52, href: "/learn" },
      { type: "practice", title: "Übungen", count: 190, href: "/practice" },
      { type: "vocabulary", title: "Wortschatz C1", count: 2600, href: "/practice/vocabulary" },
      { type: "templates", title: "Textmuster", count: 26, href: "/writing-center" },
    ],
  },
}

export default function TestPrepDetailPage({
  params,
}: {
  params: Promise<{ examType: string }>
}) {
  const { examType } = use(params)
  const exam = examData[examType.toLowerCase()] ?? examData.ielts

  const completedWeeks = exam.studyPlan.filter((w) => w.completed).length
  const progress = Math.round((completedWeeks / exam.studyPlan.length) * 100)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Hero */}
      <section
        data-aos="fade-up"
        className="relative overflow-hidden rounded-3xl bg-gradient-primary p-7 text-primary-foreground shadow-hover sm:p-9"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative">
          <Link
            href="/test-prep"
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            Tất cả kỳ thi
          </Link>

          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <Trophy className="h-7 w-7" />
              </span>
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  <Sparkles className="h-3 w-3" />
                  Còn {exam.daysLeft} ngày tới kỳ thi
                </span>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Luyện thi {exam.name}
                </h1>
                <p className="mt-1 max-w-xl text-sm text-white/85">
                  {exam.fullName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur">
              <div className="rounded-xl bg-white/10 px-4 py-2.5 text-center">
                <p className="text-2xl font-extrabold leading-none">
                  {exam.currentScore}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/70">
                  Hiện tại
                </p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-2.5 text-center">
                <p className="text-2xl font-extrabold leading-none">
                  {exam.targetScore}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/70">
                  Mục tiêu
                </p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-2.5 text-center">
                <p className="text-2xl font-extrabold leading-none">
                  {progress}%
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/70">
                  Progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills grid */}
      <section data-aos="fade-up">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <Target className="h-5 w-5 text-accent" />
          Điểm từng kỹ năng
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {exam.skills.map((s) => {
            const pct = Math.round((s.score / s.target) * 100)
            return (
              <div
                key={s.name}
                className="rounded-3xl bg-surface-lowest p-5 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-ambient`}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-accent-container px-2.5 py-1 text-[11px] font-bold text-on-accent-container">
                    Target {s.target}
                  </span>
                </div>
                <h3 className="mt-4 font-bold">{s.name}</h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">{s.score}</span>
                  <span className="text-xs text-muted-foreground">
                    / {s.target}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-low">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Còn {(s.target - s.score).toFixed(1)} để đạt mục tiêu
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Study plan */}
        <section
          data-aos="fade-up"
          className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
        >
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <GraduationCap className="h-5 w-5 text-accent" />
              Lộ trình 6 tuần
            </h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {completedWeeks}/{exam.studyPlan.length} tuần
            </span>
          </div>

          <ol className="relative mt-5 space-y-3 before:absolute before:left-6 before:top-0 before:h-full before:w-px before:bg-border">
            {exam.studyPlan.map((w) => (
              <li
                key={w.week}
                className={`relative flex items-center gap-4 rounded-2xl p-3 transition-all ${
                  w.active
                    ? "bg-accent-container"
                    : w.completed
                      ? "bg-success/5"
                      : "bg-surface-low"
                }`}
              >
                <span
                  className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold shadow-ambient ${
                    w.completed
                      ? "bg-success text-white"
                      : w.active
                        ? "bg-gradient-primary text-white"
                        : "bg-surface-lowest text-muted-foreground"
                  }`}
                >
                  {w.completed ? <CheckCircle2 className="h-5 w-5" /> : w.week}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Tuần {w.week}
                    </p>
                    {w.active && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        Đang học
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate font-semibold">{w.focus}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {w.hours}h
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Resources */}
        <section
          data-aos="fade-up"
          className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
        >
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <FileText className="h-5 w-5 text-accent" />
            Tài liệu & bài tập
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {exam.resources.map((r) => (
              <Link
                key={r.type}
                href={r.href}
                className="group rounded-2xl bg-surface-low p-4 transition-all hover:shadow-ambient"
              >
                <p className="text-3xl font-extrabold text-primary">
                  {r.count}
                </p>
                <p className="mt-1 text-sm font-semibold">{r.title}</p>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                  Mở thư viện
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-gradient-fluency p-4 text-primary-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <p className="text-sm font-bold">AI Score Predictor</p>
            </div>
            <p className="mt-1 text-xs text-white/85">
              Dự đoán điểm dựa trên pattern hiện tại — cập nhật realtime mỗi khi bạn làm bài.
            </p>
            <Button
              size="sm"
              className="mt-3 w-full rounded-full bg-white text-accent hover:bg-white/90 shadow-ambient"
            >
              Xem phân tích
            </Button>
          </div>
        </section>
      </div>

      {/* Mock exams */}
      <section data-aos="fade-up">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Trophy className="h-5 w-5 text-accent" />
            Mock exams
          </h2>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="rounded-full text-sm text-accent hover:bg-accent-container/60"
          >
            <Link href="/test-prep">
              Xem tất cả
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {exam.mockExams.map((m) => (
            <div
              key={m.id}
              className={`relative overflow-hidden rounded-3xl p-5 shadow-ambient transition-all ${
                m.locked
                  ? "bg-surface-low"
                  : m.score
                    ? "bg-surface-lowest hover:-translate-y-1 hover:shadow-hover"
                    : "bg-gradient-primary text-primary-foreground hover:-translate-y-1 hover:shadow-hover"
              }`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-ambient ${
                    m.locked
                      ? "bg-surface-lowest text-muted-foreground"
                      : m.score
                        ? "bg-success/15 text-success"
                        : "bg-white/15 backdrop-blur"
                  }`}
                >
                  {m.locked ? (
                    <Lock className="h-5 w-5" />
                  ) : m.score ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 fill-current" />
                  )}
                </span>
                {m.score && (
                  <span className="rounded-full bg-success px-2.5 py-1 text-xs font-bold text-white">
                    {m.score}
                  </span>
                )}
              </div>

              <h3 className="mt-4 font-bold leading-snug">{m.name}</h3>
              <p
                className={`mt-1 text-xs ${m.locked || m.score ? "text-muted-foreground" : "text-white/80"}`}
              >
                {m.date} · {m.duration}
              </p>

              <Button
                size="sm"
                disabled={m.locked}
                className={`mt-4 w-full rounded-full ${
                  m.locked
                    ? "bg-muted text-muted-foreground"
                    : m.score
                      ? "bg-surface-low text-foreground hover:bg-surface-high"
                      : "bg-white text-primary hover:bg-white/90 shadow-ambient"
                }`}
              >
                {m.locked
                  ? "Đang khóa"
                  : m.score
                    ? "Xem kết quả"
                    : "Bắt đầu"}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
