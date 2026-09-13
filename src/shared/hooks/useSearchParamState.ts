import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

interface PendingChange {
  readonly key: string;
  readonly value: string;
  readonly defaultValue: string;
}

/** Module-level so changes from every instance batch together (see below). */
let pendingChanges: PendingChange[] = [];
let flushScheduled = false;

/**
 * A filter value stored in the query string (replace navigation; omitted when it equals the default).
 * Updates are batched per microtask: separate `setSearchParams` calls in one handler would each
 * start from the same stale URL, and only the last one would survive.
 */
export function useSearchParamState<T extends string>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = (searchParams.get(key) as T | null) ?? defaultValue;

  // The flush must use the `setSearchParams` current at flush time.
  const setSearchParamsRef = useRef(setSearchParams);
  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);

  const setValue = useCallback(
    (next: T) => {
      pendingChanges.push({ key, value: next, defaultValue });

      if (!flushScheduled) {
        flushScheduled = true;
        queueMicrotask(() => {
          const changes = pendingChanges;
          pendingChanges = [];
          flushScheduled = false;

          setSearchParamsRef.current(
            (prev) => {
              const params = new URLSearchParams(prev);
              for (const change of changes) {
                if (change.value === change.defaultValue) {
                  params.delete(change.key);
                } else {
                  params.set(change.key, change.value);
                }
              }
              return params;
            },
            { replace: true },
          );
        });
      }
    },
    [key, defaultValue],
  );

  return [value, setValue];
}
