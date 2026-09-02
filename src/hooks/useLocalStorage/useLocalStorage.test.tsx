import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import useLocalStorage from "./useLocalStorage";

class LocalStorageMock {
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

Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
});

describe("useLocalStorage()", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("initial state is in the returned state", () => {
    const { result } = renderHook(() => useLocalStorage("key", "value"));

    expect(result.current[0]).toBe("value");
  });

  test("Initial state is a callback function", () => {
    const { result } = renderHook(() => useLocalStorage("key", () => "value"));

    expect(result.current[0]).toBe("value");
  });

  test("Initial state is an array", () => {
    const { result } = renderHook(() => useLocalStorage("digits", [1, 2]));

    expect(result.current[0]).toEqual([1, 2]);
  });

  test("Update the state", () => {
    const { result } = renderHook(() => useLocalStorage("key", "value"));

    act(() => {
      const setState = result.current[1];
      setState("edited");
    });

    expect(result.current[0]).toBe("edited");
  });

  test("Update the state writes localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("key", "value"));

    act(() => {
      const setState = result.current[1];
      setState("edited");
    });

    expect(window.localStorage.getItem("key")).toBe(JSON.stringify("edited"));
  });

  test("Update the state with undefined", () => {
    const { result } = renderHook(() => useLocalStorage<string | undefined>("key", "value"));

    act(() => {
      const setState = result.current[1];
      setState(undefined);
    });

    expect(result.current[0]).toBeUndefined();
  });

  test("Update the state with null", () => {
    const { result } = renderHook(() => useLocalStorage<string | null>("key", "value"));

    act(() => {
      const setState = result.current[1];
      setState(null);
    });

    expect(result.current[0]).toBeNull();
  });

  test("Update the state with a callback function", () => {
    const { result } = renderHook(() => useLocalStorage("count", 2));

    act(() => {
      const setState = result.current[1];
      setState((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(3);
    expect(window.localStorage.getItem("count")).toEqual("3");
  });

  test("[Event] Update one hook updates the others", () => {
    const initialValues: [string, unknown] = ["key", "initial"];
    const { result: A } = renderHook(() => useLocalStorage(...initialValues));
    const { result: B } = renderHook(() => useLocalStorage(...initialValues));

    act(() => {
      const setState = A.current[1];
      setState("edited");
    });

    expect(B.current[0]).toBe("edited");
  });

  test("[Event] A functional update reads what storage holds, not the hook's own copy", () => {
    const { result } = renderHook(() => useLocalStorage("count", 1));

    // Storage written behind the hook's back, as another instance of the same key does when it
    // commits a value this one has not re-rendered with yet
    window.localStorage.setItem("count", JSON.stringify(10));

    act(() => {
      const setState = result.current[1];
      setState((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(11);
    expect(window.localStorage.getItem("count")).toEqual("11");
  });

  test("[Event] A functional update never writes a stale value over another hook's update", () => {
    const initialValues: [string, { permissions: string[]; user: string }] = ["session", { permissions: [], user: "a" }];
    const { result: A } = renderHook(() => useLocalStorage(...initialValues));
    const { result: B } = renderHook(() => useLocalStorage(...initialValues));

    // A switches the stored user, then B merges a field in: B must build on A's user, not on its own
    act(() => {
      const setState = A.current[1];
      setState({ permissions: [], user: "b" });
    });

    act(() => {
      const setState = B.current[1];
      setState((previous) => ({ ...previous, permissions: ["read"] }));
    });

    expect(B.current[0]).toEqual({ permissions: ["read"], user: "b" });
    expect(A.current[0]).toEqual({ permissions: ["read"], user: "b" });
  });

  test("setValue is referentially stable", () => {
    const { result } = renderHook(() => useLocalStorage("count", 1));

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
    const { result } = renderHook(() => useLocalStorage("test", ""));

    expect(result.current[0]).toBe("");
  });

  test("without initial state", () => {
    const { result } = renderHook(() => useLocalStorage("test"));

    expect(result.current[0]).toBe(null);
  });

  test("Update the state without initial state", () => {
    const { result } = renderHook(() => useLocalStorage("key"));

    act(() => {
      const setState = result.current[1];
      setState("edited");
    });

    expect(result.current[0]).toBe("edited");
  });
});
