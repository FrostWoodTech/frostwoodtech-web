import { useEffect, useRef } from "react";
import {
  useForm,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";

function readDraft<T>(storageKey: string): Partial<T> | null {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as Partial<T>) : null;
  } catch {
    return null;
  }
}

/**
 * `useForm` with a localStorage draft that survives a refresh. The draft is cleared on unmount
 * (modal close or navigation), which a browser refresh doesn't trigger.
 */
export function usePersistedForm<T extends FieldValues>(
  storageKey: string,
  options: UseFormProps<T>,
): UseFormReturn<T> & { clearPersisted: () => void } {
  const draft = useRef(readDraft<T>(storageKey)).current;

  const form = useForm<T>({
    ...options,
    defaultValues: {
      ...options.defaultValues,
      ...draft,
    } as UseFormProps<T>["defaultValues"],
  });

  const clearPersisted = useRef(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Storage can be unavailable; losing the draft is harmless.
    }
  }).current;

  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(values));
      } catch {
        // Persistence is best-effort.
      }
    });
    return () => subscription.unsubscribe();
  }, [form, storageKey]);

  useEffect(() => {
    return () => clearPersisted();
    // Mount/unmount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...form, clearPersisted };
}
