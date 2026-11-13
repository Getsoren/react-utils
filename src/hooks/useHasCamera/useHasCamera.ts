import { useSyncExternalStore } from "react";

const TOUCH_QUERY = "(pointer: coarse)";

/**
 * The touch media query; none where the DOM has no `matchMedia`, as in a test's.
 */
const touchQueryOf = () => (typeof window.matchMedia === "function" ? window.matchMedia(TOUCH_QUERY) : null);

const subscribeToTouch = (onChange: () => void) => {
  const query = touchQueryOf();

  // An old Safari's query has no `addEventListener`: it is read at each render, without following a change
  query?.addEventListener?.("change", onChange);

  return () => query?.removeEventListener?.("change", onChange);
};

const isTouchDevice = () => touchQueryOf()?.matches ?? false;

/**
 * What is known of the device's camera, shared by every component that asks: the devices are listed once, then again
 * when one is plugged in or out, and a component mounted later reads the answer at once.
 */
const camera = { isFound: false, listeners: new Set<() => void>() };

/**
 * Whether the device declares a camera. Listed without asking for the camera's permission; none on a page that is not
 * secure, where the browser exposes no media devices.
 */
const findCamera = async () => {
  const devices = (await navigator.mediaDevices?.enumerateDevices()) ?? [];

  return devices.some(({ kind }) => kind === "videoinput");
};

const refreshCamera = async () => {
  const isFound = await findCamera().catch(() => false);

  if (isFound === camera.isFound) {
    return;
  }

  camera.isFound = isFound;

  for (const notify of camera.listeners) {
    notify();
  }
};

const handleDeviceChange = () => void refreshCamera();

/**
 * The first component to ask lists the devices and starts following their changes; the last one to leave stops.
 */
const subscribeToCamera = (onChange: () => void) => {
  camera.listeners.add(onChange);

  if (camera.listeners.size === 1) {
    void refreshCamera();
    navigator.mediaDevices?.addEventListener?.("devicechange", handleDeviceChange);
  }

  return () => {
    camera.listeners.delete(onChange);

    if (camera.listeners.size === 0) {
      navigator.mediaDevices?.removeEventListener?.("devicechange", handleDeviceChange);
    }
  };
};

const subscribeToNothing = () => () => undefined;

const isCameraFound = () => camera.isFound;

const isAbsent = () => false;

/**
 * Hook that tells whether the device can take a photo from a file input (`<input type="file" capture>`): a phone or a
 * tablet (a touch screen) with a camera. A computer's webcam does not count: there, a browser ignores the input's
 * `capture` and opens the files instead.
 *
 * Best effort: a browser that hides its devices (an in-app web view, a frame without the camera's permission) answers
 * false although the capture would work.
 */
const useHasCamera = (): boolean => {
  const isTouch = useSyncExternalStore(subscribeToTouch, isTouchDevice, isAbsent);
  // A computer's devices are not listed at all
  const hasCamera = useSyncExternalStore(isTouch ? subscribeToCamera : subscribeToNothing, isCameraFound, isAbsent);

  return isTouch && hasCamera;
};

export default useHasCamera;
