"use server"

import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { UPDATE_PROFILE_MUTATION } from "@/lib/api/mutations"
import { logoutAction } from "@/lib/auth/actions"
import type { User } from "@/lib/api/types"
import { revalidatePath } from "next/cache"

export { logoutAction }

export async function updateProfileAction(
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const token = await getAccessToken()
  if (!token) return { error: "Chưa đăng nhập" }

  const displayName = formData.get("displayName") as string | null
  const bio = formData.get("bio") as string | null

  try {
    await gql<{ updateProfile: User }>(
      UPDATE_PROFILE_MUTATION,
      { displayName, bio },
      token,
    )
    revalidatePath("/settings")
    revalidatePath("/profile")
    return { success: true }
  } catch (e: any) {
    return { error: e?.message ?? "Lưu thất bại" }
  }
}
