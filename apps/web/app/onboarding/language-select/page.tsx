import { guardOnboardingStep } from "../_guard"
import LanguageSelectClient from "./language-select-client"

export default async function LanguageSelectPage() {
  const state = await guardOnboardingStep("language_select")
  const answers = state.answers as { nativeLang?: string; targetLangs?: string[] }
  return (
    <LanguageSelectClient
      defaultNativeLang={answers.nativeLang ?? "vi"}
      defaultTargetLangs={answers.targetLangs ?? ["en"]}
    />
  )
}
