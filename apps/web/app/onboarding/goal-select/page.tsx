import { guardOnboardingStep } from "../_guard"
import GoalSelectClient from "./goal-select-client"

export default async function GoalSelectPage() {
  const state = await guardOnboardingStep("goal_select")
  const answers = state.answers as {
    goal?:        string
    cert?:        string
    targetScore?: string
  }
  return (
    <GoalSelectClient
      defaultGoal={answers.goal ?? ""}
      defaultCert={answers.cert ?? ""}
      defaultTargetScore={answers.targetScore ?? ""}
    />
  )
}
