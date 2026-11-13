import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * A device: touch or not, with the kinds of its media devices; without kinds, a page that exposes no media devices.
 * Returns what the test drives: the list of devices, read at each listing, and the listeners of their changes.
 */
const setDevice = ({ isTouch, kinds }: { isTouch: boolean; kinds?: string[] }) => {
  const device = { changeListeners: new Set<() => void>(), enumerate: vi.fn(), kinds: kinds ?? [] };

  device.enumerate.mockImplementation(() => Promise.resolve(device.kinds.map((kind) => ({ kind }))));
  vi.stubGlobal("matchMedia", () => ({ addEventListener: vi.fn(), matches: isTouch, removeEventListener: vi.fn() }));
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: kinds && {
      addEventListener: (_event: string, listener: () => void) => device.changeListeners.add(listener),
      enumerateDevices: device.enumerate,
      removeEventListener: (_event: string, listener: () => void) => device.changeListeners.delete(listener),
    },
  });

  return device;
};

/**
 * The hook on a fresh module: what it knows of the camera is shared, and must not leak from a test to the next.
 */
const loadHook = async () => {
  vi.resetModules();

  return (await import("@/hooks/useHasCamera/useHasCamera")).default;
};

/**
 * Lets the listing of the devices settle.
 */
const settle = () => act(() => new Promise<void>((resolve) => setTimeout(resolve)));

describe("useHasCamera", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("finds the camera of a touch device", async () => {
    setDevice({ isTouch: true, kinds: ["audioinput", "videoinput"] });
    const useHasCamera = await loadHook();
    const { result } = renderHook(() => useHasCamera());

    await waitFor(() => expect(result.current).toBe(true));
  });

  it("ignores a computer's webcam, without listing its devices", async () => {
    const device = setDevice({ isTouch: false, kinds: ["videoinput"] });
    const useHasCamera = await loadHook();
    const { result } = renderHook(() => useHasCamera());

    await settle();
    expect(result.current).toBe(false);
    expect(device.enumerate).not.toHaveBeenCalled();
  });

  it("finds none on a touch device without a camera", async () => {
    const device = setDevice({ isTouch: true, kinds: ["audioinput"] });
    const useHasCamera = await loadHook();
    const { result } = renderHook(() => useHasCamera());

    await settle();
    expect(device.enumerate).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(false);
  });

  it("finds none where the page exposes no media devices, or the DOM no media query", async () => {
    setDevice({ isTouch: true });
    const withoutDevices = renderHook(await loadHook());
    await settle();
    vi.stubGlobal("matchMedia", undefined);
    const withoutMediaQuery = renderHook(await loadHook());
    await settle();

    expect(withoutDevices.result.current).toBe(false);
    expect(withoutMediaQuery.result.current).toBe(false);
  });

  it("finds none when the devices cannot be listed", async () => {
    const device = setDevice({ isTouch: true, kinds: ["videoinput"] });
    device.enumerate.mockRejectedValue(new Error("NotAllowedError"));
    const useHasCamera = await loadHook();
    const { result } = renderHook(() => useHasCamera());

    await settle();
    expect(result.current).toBe(false);
  });

  it("follows a camera plugged in", async () => {
    const device = setDevice({ isTouch: true, kinds: [] });
    const useHasCamera = await loadHook();
    const { result } = renderHook(() => useHasCamera());
    await settle();
    expect(result.current).toBe(false);

    device.kinds = ["videoinput"];
    for (const notify of device.changeListeners) {
      notify();
    }

    await waitFor(() => expect(result.current).toBe(true));
  });

  it("answers a component mounted later at once, and stops following the devices once the last one leaves", async () => {
    const device = setDevice({ isTouch: true, kinds: ["videoinput"] });
    const useHasCamera = await loadHook();
    const first = renderHook(() => useHasCamera());
    await waitFor(() => expect(first.result.current).toBe(true));

    const second = renderHook(() => useHasCamera());
    expect(second.result.current).toBe(true);
    expect(device.enumerate).toHaveBeenCalledTimes(1);

    first.unmount();
    second.unmount();
    expect(device.changeListeners.size).toBe(0);
  });
});
