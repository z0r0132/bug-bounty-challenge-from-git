import { STORAGE_KEYS } from "./constants";
import {
  clearSession,
  isSessionActive,
  readSession,
  writeSession
} from "./session";

describe("mock session", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when no session is stored", () => {
    expect(readSession()).toBeNull();
    expect(isSessionActive()).toBe(false);
  });

  it("round-trips a valid session", () => {
    writeSession({ loggedIn: true, email: "user@example.com" });
    expect(readSession()).toEqual({
      loggedIn: true,
      email: "user@example.com"
    });
    expect(isSessionActive()).toBe(true);
  });

  it("rejects invalid JSON shape", () => {
    localStorage.setItem(
      STORAGE_KEYS.session,
      JSON.stringify({ loggedIn: true })
    );
    expect(readSession()).toBeNull();
    expect(isSessionActive()).toBe(false);
  });

  it("clears session on logout helper", () => {
    writeSession({ loggedIn: true, email: "a@b.com" });
    clearSession();
    expect(localStorage.getItem(STORAGE_KEYS.session)).toBeNull();
  });
});
