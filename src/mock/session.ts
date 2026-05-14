import { STORAGE_KEYS } from "./constants";

export type MockSession = {
  loggedIn: boolean;
  email: string;
};

export function readSession(): MockSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.session);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MockSession;
    if (!parsed || typeof parsed.loggedIn !== "boolean" || !parsed.email) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeSession(session: MockSession): void {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.session);
}

export function isSessionActive(): boolean {
  const s = readSession();
  return !!(s && s.loggedIn && s.email.trim());
}
