"use server"

import { revalidatePath } from "next/cache"
import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { UPDATE_LEARNING_PREFERENCES_MUTATION } from "@/lib/api/mutations"
import type { LearningPreferencesResult } from "@/lib/api/types"

export async function updateLearningPreferencesAction(input: {
  dailyGoalMinutes?: number
  reminderTime?: string | null
  learningLanguages?: string[]
}): Promise<{ error?: string; success?: boolean }> {
  const token = await getAccessToken()
  if (!token) return { error: "Chưa đăng nhập" }

  try {
    await gql<{ updateLearningPreferences: LearningPreferencesResult }>(
      UPDATE_LEARNING_PREFERENCES_MUTATION,
      {
        dailyGoalMinutes: input.dailyGoalMinutes ?? null,
        reminderTime: input.reminderTime ?? null,
        learningLanguages: input.learningLanguages ?? null,
      },
      token,
    )
    revalidatePath("/settings/learning")
    revalidatePath("/settings/languages")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Lưu thất bại"
    return { error: msg }
  }
}
