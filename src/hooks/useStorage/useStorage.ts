import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import useEventCallback from "@/hooks/useEventCallback/useEventCallback";
import useEventListener from "@/hooks/useEventListener/useEventListener";

declare global {
  interface WindowEventMap {
    "local-storage": CustomEvent;
    "session-storage": CustomEvent;
  }
}

export type StorageArea = "localStorage" | "sessionStorage";

export type UseStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
};

export type SetValue<T> = Dispatch<SetStateAction<T>>;

// Same-tab sync: native "storage" events only fire in other tabs, so each area
// dispatches its own custom event to keep hooks of the current tab in sync.
const STORAGE_CUSTOM_EVENT: Record<StorageArea, "local-storage" | "session-storage"> = {
  localStorage: "local-storage",
  sessionStorage: "session-storage",
};

const IS_SERVER_SIDE = typeof window === "undefined";

const parseJSON = <T>(value: string | null): T | undefined => {
  if (value === "undefined" || value === null) {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value as unknown as T;
  }
};

const useStorage = <T>(area: StorageArea, key: string, initialValue?: T, options?: UseStorageOptions<T>): [T, SetValue<T>, () => void] => {
  const customEvent = STORAGE_CUSTOM_EVENT[area];

  const serializer = useCallback<(value: T) => string>(
    (value) => (options?.serializer ? options.serializer(value) : JSON.stringify(value)),
    [options],
  );

  const deserializer = useCallback<(value: string) => T>(
    (value) => (options?.deserializer ? options.deserializer(value) : (parseJSON(value) as T)),
    [options],
  );

  const readValue = useCallback((): T => {
    if (IS_SERVER_SIDE) {
      return initialValue ?? (null as unknown as T);
    }

    try {
      const raw = window[area].getItem(key);
      return raw ? deserializer(raw) : (initialValue ?? (null as T));
    } catch {
      return initialValue ?? (null as T);
    }
  }, [area, key, initialValue, deserializer]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  /**
   * Return a wrapped version of useState's setter function that
   * persists the new value to storage.
   */
  const setValue: SetValue<T> = useEventCallback((value) => {
    if (IS_SERVER_SIDE) {
      console.warn(`Tried setting ${area} key “${key}” even though environment is not a client`);
    }

    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      window[area].setItem(key, serializer(newValue));
      setStoredValue(newValue);
      window.dispatchEvent(new CustomEvent(customEvent, { detail: key }));
    } catch (error) {
      console.warn(`Error setting ${area} key “${key}”:`, error);
    }
  });

  /**
   * Remove value from storage
   */
  const removeItem = useEventCallback(() => {
    if (IS_SERVER_SIDE) {
      console.warn(`Tried removing ${area} key “${key}” even though environment is not a client`);
    }

    try {
      window[area].removeItem(key);
      setStoredValue(initialValue ?? (null as T));
      window.dispatchEvent(new CustomEvent(customEvent, { detail: key }));
    } catch (error) {
      console.warn(`Error removing ${area} key “${key}”:`, error);
    }
  });

  /**
   * Read the value from storage event
   */
  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ("key" in event) {
        if (event.key !== key) {
          return;
        }

        // Native "storage" events fire for both areas: ignore the other one
        if (event.storageArea && event.storageArea !== window[area]) {
          return;
        }
      }

      setStoredValue(readValue());
    },
    [area, key, readValue],
  );

  /**
   * Set the value from storage
   */
  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEventListener("storage", handleStorageChange);
  useEventListener(customEvent, handleStorageChange);

  return [storedValue, setValue, removeItem];
};

export default useStorage;
