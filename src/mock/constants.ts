/** localStorage keys — demo/mock only, no backend */
export const STORAGE_KEYS = {
  session: "osapiens-demo-session",
  profile: "osapiens-demo-profile",
  organization: "osapiens-demo-organization"
} as const;

/** Bug-bounty style countdown length (seconds) */
export const CHALLENGE_DURATION_SECONDS = 60 * 60;
