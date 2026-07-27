import useStorage, { SetValue, UseStorageOptions } from "@/hooks/useStorage/useStorage";

export type UseSessionStorageOptions<T> = UseStorageOptions<T>;

/**
 * Same API as useLocalStorage but backed by sessionStorage: the value survives
 * component unmounts and page reloads, and dies with the tab.
 */
const useSessionStorage = <T>(key: string, initialValue?: T, options?: UseSessionStorageOptions<T>): [T, SetValue<T>, () => void] =>
  useStorage("sessionStorage", key, initialValue, options);

export default useSessionStorage;
