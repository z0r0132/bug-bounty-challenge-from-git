import { useEffect, useMemo, useState } from "react";

/**
 * Counts down from `totalSeconds`; clears the interval when it hits zero.
 */
export function useChallengeCountdown(totalSeconds: number): {
  ended: boolean;
  minutesLabel: string;
  secondsLabel: string;
} {
  const [count, setCount] = useState(0);
  const ended = count >= totalSeconds;

  useEffect(() => {
    if (ended) return undefined;
    const intervalId = window.setInterval(() => {
      setCount((c) => {
        const next = Math.min(c + 1, totalSeconds);
        if (next >= totalSeconds) {
          window.clearInterval(intervalId);
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [ended, totalSeconds]);

  const remaining = useMemo(
    () => Math.max(0, totalSeconds - count),
    [count, totalSeconds]
  );

  const minutesLabel = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secondsLabel = String(remaining % 60).padStart(2, "0");

  return { ended, minutesLabel, secondsLabel };
}
