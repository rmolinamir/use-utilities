import { useState, useCallback, useEffect } from "react";

// Dependencies
import { useThrottle } from "../../utils/useThrottle";

export const useOnScrollCallback = (
  // Minimum height offset (in pixels) to actually execute the callback.
  minimumOffset: number = 0,
  // Minimum time between calls in milliseconds, defaults to 25ms.
  throttleLimit: number = 25,
  // Callback function.
  callback: (event: any, scrollPosition: number, ...args: any[]) => void,
  // Possible extra arguments.
  args: any[] = []
) => {
  /**
   * State variable to keep track of the browser window scroll position.
   */
  const [scrollPosition, setScrollPosition] = useState<number>(
    window.pageYOffset
  );

  /**
   * Scroll event callback handler.
   */
  const onThrottledScrollHandler = useCallback((event) => {
    const currentScrollHeight = window.pageYOffset;
    setScrollPosition(currentScrollHeight);
    if (currentScrollHeight > minimumOffset) callback(event, scrollPosition, ...args);
  }, [minimumOffset, callback, scrollPosition]);

  /**
   * Throttled `onThrottledScrollHandler` callback because of the high amount of calls
   * a scroll event handler does by nature.
   */
  const throttled = useThrottle(onThrottledScrollHandler, throttleLimit);

  /**
   * Reapply `throttled` if it changes because of a change in the `throttleLimit`.
   */
  useEffect(() => {
    window.addEventListener("scroll", throttled);

    // Return clause.
    return () => window.removeEventListener("scroll", throttled);
  }, [throttled]);
};
