import { cn } from "@/lib/utils"

type LangCode =
  | "en"
  | "gb"
  | "us"
  | "ja"
  | "jp"
  | "zh"
  | "cn"
  | "ko"
  | "kr"
  | "fr"
  | "de"
  | "es"
  | "vi"
  | "vn"
  | "it"
  | "pt"
  | "br"
  | "ru"
  | "nl"
  | "sa"
  | "ar"
  | "th"
  | "id"
  | "tr"
  | "pl"
  | "se"
  | "no"
  | "dk"
  | "fi"
  | "gr"
  | "he"
  | "hi"
  | "in"

const flagMap: Record<LangCode, { emoji: string; name: string; native: string }> = {
  en: { emoji: "🇬🇧", name: "English", native: "English" },
  gb: { emoji: "🇬🇧", name: "English (UK)", native: "English" },
  us: { emoji: "🇺🇸", name: "English (US)", native: "English" },
  ja: { emoji: "🇯🇵", name: "Japanese", native: "日本語" },
  jp: { emoji: "🇯🇵", name: "Japanese", native: "日本語" },
  zh: { emoji: "🇨🇳", name: "Chinese", native: "中文" },
  cn: { emoji: "🇨🇳", name: "Chinese", native: "中文" },
  ko: { emoji: "🇰🇷", name: "Korean", native: "한국어" },
  kr: { emoji: "🇰🇷", name: "Korean", native: "한국어" },
  fr: { emoji: "🇫🇷", name: "French", native: "Français" },
  de: { emoji: "🇩🇪", name: "German", native: "Deutsch" },
  es: { emoji: "🇪🇸", name: "Spanish", native: "Español" },
  vi: { emoji: "🇻🇳", name: "Vietnamese", native: "Tiếng Việt" },
  vn: { emoji: "🇻🇳", name: "Vietnamese", native: "Tiếng Việt" },
  it: { emoji: "🇮🇹", name: "Italian", native: "Italiano" },
  pt: { emoji: "🇵🇹", name: "Portuguese", native: "Português" },
  br: { emoji: "🇧🇷", name: "Portuguese (Brazil)", native: "Português" },
  ru: { emoji: "🇷🇺", name: "Russian", native: "Русский" },
  nl: { emoji: "🇳🇱", name: "Dutch", native: "Nederlands" },
  sa: { emoji: "🇸🇦", name: "Arabic", native: "العربية" },
  ar: { emoji: "🇸🇦", name: "Arabic", native: "العربية" },
  th: { emoji: "🇹🇭", name: "Thai", native: "ไทย" },
  id: { emoji: "🇮🇩", name: "Indonesian", native: "Bahasa" },
  tr: { emoji: "🇹🇷", name: "Turkish", native: "Türkçe" },
  pl: { emoji: "🇵🇱", name: "Polish", native: "Polski" },
  se: { emoji: "🇸🇪", name: "Swedish", native: "Svenska" },
  no: { emoji: "🇳🇴", name: "Norwegian", native: "Norsk" },
  dk: { emoji: "🇩🇰", name: "Danish", native: "Dansk" },
  fi: { emoji: "🇫🇮", name: "Finnish", native: "Suomi" },
  gr: { emoji: "🇬🇷", name: "Greek", native: "Ελληνικά" },
  he: { emoji: "🇮🇱", name: "Hebrew", native: "עברית" },
  hi: { emoji: "🇮🇳", name: "Hindi", native: "हिन्दी" },
  in: { emoji: "🇮🇳", name: "Hindi", native: "हिन्दी" },
}

export function FlagIcon({
  code,
  size = 24,
  className,
}: {
  code: LangCode | string
  size?: number
  className?: string
}) {
  const entry = flagMap[code as LangCode] ?? { emoji: "🌐", name: code, native: code }
  return (
    <span
      aria-label={entry.name}
      role="img"
      className={cn("inline-flex items-center justify-center leading-none", className)}
      style={{ fontSize: size }}
    >
      {entry.emoji}
    </span>
  )
}

export { flagMap }
export type { LangCode }
