import useStorage, { SetValue, UseStorageOptions } from "@/hooks/useStorage/useStorage";

export type UseLocalStorageOptions<T> = UseStorageOptions<T>;

const useLocalStorage = <T>(key: string, initialValue?: T, options?: UseLocalStorageOptions<T>): [T, SetValue<T>, () => void] =>
  useStorage("localStorage", key, initialValue, options);

export default useLocalStorage;
