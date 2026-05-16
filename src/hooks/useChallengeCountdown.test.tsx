import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { useChallengeCountdown } from "./useChallengeCountdown";

function CountdownProbe({ totalSeconds }: { totalSeconds: number }) {
  const { ended, minutesLabel, secondsLabel } =
    useChallengeCountdown(totalSeconds);
  return (
    <div
      data-ended={String(ended)}
      data-time={`${minutesLabel}:${secondsLabel}`}
    />
  );
}

describe("useChallengeCountdown", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    jest.useFakeTimers();
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    jest.useRealTimers();
  });

  it("counts down and ends at zero", () => {
    act(() => {
      ReactDOM.render(<CountdownProbe totalSeconds={2} />, container);
    });

    const node = () => container.firstChild as HTMLElement;

    expect(node().getAttribute("data-time")).toBe("00:02");
    expect(node().getAttribute("data-ended")).toBe("false");

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(node().getAttribute("data-time")).toBe("00:01");

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(node().getAttribute("data-time")).toBe("00:00");
    expect(node().getAttribute("data-ended")).toBe("true");
  });
});
