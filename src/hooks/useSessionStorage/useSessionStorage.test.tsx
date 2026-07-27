import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import useSessionStorage from "./useSessionStorage";

class SessionStorageMock {
  store: Record<string, unknown> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: unknown) {
    this.store[key] = `${value}`;
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

Object.defineProperty(window, "sessionStorage", {
  value: new SessionStorageMock(),
});

describe("useSessionStorage()", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("initial state is in the returned state", () => {
    const { result } = renderHook(() => useSessionStorage("key", "value"));

    expect(result.current[0]).toBe("value");
  });

  test("Initial state is a callback function", () => {
    const { result } = renderHook(() => useSessionStorage("key", () => "value"));

    expect(result.current[0]).toBe("value");
  });

  test("Initial state is an array", () => {
    const { result } = renderHook(() => useSessionStorage("digits", [1, 2]));

    expect(result.current[0]).toEqual([1, 2]);
  });

  test("Update the state", () => {
    const { result } = renderHook(() => useSessionStorage("key", "value"));

    act(() => {
      const setState = result.current[1];
      setState("edited");
    });

    expect(result.current[0]).toBe("edited");
  });

  test("Update the state writes sessionStorage", () => {
    const { result } = renderHook(() => useSessionStorage("key", "value"));

    act(() => {
      const setState = result.current[1];
      setState("edited");
    });

    expect(window.sessionStorage.getItem("key")).toBe(JSON.stringify("edited"));
  });

  test("Update the state with undefined", () => {
    const { result } = renderHook(() => useSessionStorage<string | undefined>("key", "value"));

    act(() => {
      const setState = result.current[1];
      setState(undefined);
    });

    expect(result.current[0]).toBeUndefined();
  });

  test("Update the state with null", () => {
    const { result } = renderHook(() => useSessionStorage<string | null>("key", "value"));

    act(() => {
      const setState = result.current[1];
      setState(null);
    });

    expect(result.current[0]).toBeNull();
  });

  test("Update the state with a callback function", () => {
    const { result } = renderHook(() => useSessionStorage("count", 2));

    act(() => {
      const setState = result.current[1];
      setState((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(3);
    expect(window.sessionStorage.getItem("count")).toEqual("3");
  });

  test("[Event] Update one hook updates the others", () => {
    const initialValues: [string, unknown] = ["key", "initial"];
    const { result: A } = renderHook(() => useSessionStorage(...initialValues));
    const { result: B } = renderHook(() => useSessionStorage(...initialValues));

    act(() => {
      const setState = A.current[1];
      setState("edited");
    });

    expect(B.current[0]).toBe("edited");
  });

  test("Removing the item resets to the initial value", () => {
    const { result } = renderHook(() => useSessionStorage("key", "value"));

    act(() => {
      const setState = result.current[1];
      setState("edited");
    });

    act(() => {
      const removeItem = result.current[2];
      removeItem();
    });

    expect(result.current[0]).toBe("value");
    expect(window.sessionStorage.getItem("key")).toBeNull();
  });

  test("Does not leak into localStorage", () => {
    const { result } = renderHook(() => useSessionStorage("key", "value"));

    act(() => {
      const setState = result.current[1];
      setState("edited");
    });

    expect(window.localStorage.getItem("key")).toBeNull();
  });

  test("setValue is referentially stable", () => {
    const { result } = renderHook(() => useSessionStorage("count", 1));

    // Store a reference to the original setValue
    const originalCallback = result.current[1];

    // Now invoke a state update, if setValue is not referentially stable then this will cause the originalCallback
    // reference to not be equal to the new setValue function
    act(() => {
      const setState = result.current[1];
      setState((prev) => prev + 1);
    });

    expect(result.current[1] === originalCallback).toBe(true);
  });

  test("initial state empty string return string", () => {
    const { result } = renderHook(() => useSessionStorage("test", ""));

    expect(result.current[0]).toBe("");
  });

  test("without initial state", () => {
    const { result } = renderHook(() => useSessionStorage("test"));

    expect(result.current[0]).toBe(null);
  });

  test("Update the state without initial state", () => {
    const { result } = renderHook(() => useSessionStorage("key"));

    act(() => {
      const setState = result.current[1];
      setState("edited");
    });

    expect(result.current[0]).toBe("edited");
  });
});
