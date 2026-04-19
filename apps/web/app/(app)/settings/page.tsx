/**
 * /settings — async RSC
 * Fetches real user profile to pre-fill Account tab.
 * Logout calls logoutAction Server Action.
 */
import { cookies } from "next/headers";
import { gql } from "@/lib/api/client";
import { ME_QUERY } from "@/lib/api/queries";
import type { User } from "@/lib/api/types";
import SettingsClient from "./settings-client";

const MOCK_USER: User = {
  id: "mock",
  username: "Learner",
  avatarUrl: null,
  bio: "",
  createdAt: new Date().toISOString(),
};

async function fetchMe(): Promise<User> {
  try {
    const jar = await cookies();
    const token = jar.get("omni_at")?.value;
    if (!token) return MOCK_USER;

    const data = await gql<{ me: User }>(ME_QUERY, undefined, token);
    return data.me;
  } catch {
    return MOCK_USER;
  }
}

export default async function SettingsPage() {
  const user = await fetchMe();
  return <SettingsClient user={user} />;
}
