// Libraries
import {
  useState,
  useCallback
} from "react";

/**
 * Here's how this Hook works. If the throttle is set to 500ms,
 * here are the callbacks that will execute in a range of a 500ms interval:
 * - Callback executed at 0ms: Will execute.
 * - Callback executed at 200ms: Will not execute.
 * - Callback executed at 300ms: Will execute **(after 500ms pass)**
 *
 * This behavior is intented to not lose the last callback.
 *
 * @param callback Callback function.
 * @param limit Throttle limit between callback executions.
 */
export const useThrottle = (
  callback: (...args: any[]) => void,
  limit: number
): ((...args: any[]) => void) => {
  /**
   * - `callbackTimeoutId` timeout ID to be able to clear any existing ones.
   */
  const [callbackTimeoutId, setCallbackTimeoutId] = useState<NodeJS.Timeout | number>();
  const [lastCallbackRunDate, setLastCallbackRunDate] = useState<NodeJS.Timeout | number>();

  /**
   * Memoize the returned callback to avoid unnecessary re-renders.
   */
  return useCallback((...args) => {
    // If no `lastCallbackRunDate`, set one now.
    if (!lastCallbackRunDate) {
      setLastCallbackRunDate(Date.now());
    } else {
      // Clears the current timeout.
      clearTimeout(Number(callbackTimeoutId));
      // Calculate a delay for the timeout that evaluates if the throttled callback
      // shoul be executed.
      const timeoutDelay = limit - (Date.now() - Number(lastCallbackRunDate));
      /**
       * The last callback **WILL** be executed after the `timeoutDelay` is over, even
       * if the callback was executed before it was allowed to run.
       * This is intended.
       */
      setCallbackTimeoutId(setTimeout(() => {
        // Calculate if enough time has passed since the last execution of the callback.
        const isPastThrottleLimit = Date.now() - Number(lastCallbackRunDate) >= limit;
        if (isPastThrottleLimit && callback) {
          setLastCallbackRunDate(Date.now());
          callback(...args);
        }
      }, timeoutDelay));
    }
  }, [callbackTimeoutId, lastCallbackRunDate, limit, callback]);
};
