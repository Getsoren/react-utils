import { useEffect, useLayoutEffect } from "react";

/**
 * Use isomorphic layout effect
 * Signature is identical to useEffect, but it fires synchronously after all DOM mutations
 */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default useIsomorphicLayoutEffect;
