// Libraries
import {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect
} from "react";

// Dependencies
import IntervalTimer, { EState } from "../../dependencies/IntervalTimer";

// Typings
import { TAnyFunction } from "../../typings";

export const useCallbackQueue = (
  callback: TAnyFunction,
  interval: number,
  shouldPush: boolean = true
) => {
  /**
   * Mutable object of the TypeScript Queue `array`. It will live until unmounted.
   */
  const callbackQueueRef = useRef<TAnyFunction[]>([]);
  const callbackQueue = callbackQueueRef.current;

  /**
   * Caching the `handleQueue` functions based on the `callbackQueue`
   * arguments.
   */
  const handleQueue = useCallback(() => {
    if (
      callbackQueue.length &&
      callback &&
      typeof callback === 'function'
    ) {
      const callback = callbackQueue.shift();
      callback && callback();
      setLength(callbackQueue.length);
    }
  }, [callbackQueue]);

  /**
   * Mutable object of the `IntervalTimer` instance. It will live until unmounted.
   */
  const intervalCallbacksRef = useRef<IntervalTimer>(
    useMemo(() => {
      return new IntervalTimer(handleQueue, interval);
    }, [handleQueue, interval])
  );
  const intervalCallbacks = intervalCallbacksRef.current;

  /**
   * Declaring a state variable to trigger side effects when
   * pushing callbacks into `callbackQueue`. The side effects
   * are handled by a `useEffect`.
   */
  const [length, setLength] = useState<number>(callbackQueue.length);

  /**
   * Handling side effects when a callback is pushed into the `callbackQueue`.
   * - If the callback queue is running, then the `IntervalTimer` instance will
   * execute `handleQueue` until the length of the queue is `0`. If `0` is reached,
   * then the `IntervalTimer` instace is stopped.
   * - If the callback queue is idle, then the `callbackQueue` length is checked,
   * and if it's higher than `0` then start the queue.
   */
  useEffect(() => {
    switch (intervalCallbacks.state) {
      case EState.IDLE:
        if (length > 0) {
          intervalCallbacks.start();
        }
        break;
      case EState.RUNNING:
        if (length === 0) {
          intervalCallbacks.stop();
        }
        break;
    }
    // Stop the `IntervalTimer` instance when unmounting inside this return clause.
    return () => {
      intervalCallbacks.stop();
    }
  }, [length, intervalCallbacks, callbackQueue]);

  /**
   * If the `interval`, the time between executions of `handleQueue` change,
   * then we gotta set the new interval which will reset the Queue interval timers
   * after the current loop is over.
   */
  useEffect(() => {
    intervalCallbacks.setInterval(interval);
  }, [intervalCallbacks, interval]);

  /**
   * Returns a memoized callback, caching the `callback` arguments.
   */
  return useCallback((...args: any) => {
    if (shouldPush) {
      callbackQueue.push(() => callback(...args));
    }
    setLength(callbackQueue.length);
  }, [callback, shouldPush]);
};
