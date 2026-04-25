import { guardOnboardingStep } from "../_guard"
import LevelSelectClient from "./level-select-client"

export default async function LevelSelectPage() {
  const state = await guardOnboardingStep("level_select")
  const answers = state.answers as {
    level?:        string
    dailyMins?:    number
    reminderTime?: string
  }
  return (
    <LevelSelectClient
      defaultLevel={answers.level ?? ""}
      defaultDailyMins={answers.dailyMins ?? 10}
      defaultReminderTime={answers.reminderTime ?? "20:00"}
    />
  )
}
