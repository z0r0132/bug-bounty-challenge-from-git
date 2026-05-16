import type { StoredProfile, User } from "../types/user";
import { STORAGE_KEYS } from "./constants";

export const DEFAULT_MOCK_USER: User = {
  firstName: "Aria",
  lastName: "Test",
  eMail: "linda.bolt@osapiens.com"
};

export type { StoredProfile };

export function readStoredProfile(): StoredProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.profile);
    if (!raw) return {};
    return JSON.parse(raw) as StoredProfile;
  } catch {
    return {};
  }
}

export function writeStoredProfile(profile: StoredProfile): void {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

/** Merge defaults, optional session email, and persisted profile */
export function buildUserFromSession(sessionEmail: string): User {
  const profile = readStoredProfile();
  return {
    ...DEFAULT_MOCK_USER,
    ...profile,
    eMail:
      profile.eMail?.trim() ||
      sessionEmail.trim() ||
      DEFAULT_MOCK_USER.eMail
  };
}
