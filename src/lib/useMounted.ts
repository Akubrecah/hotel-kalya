import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Hydration-safe hook that returns true only after the component has mounted on the client.
 * Uses useSyncExternalStore to eliminate SSR/client hydration mismatches without cascading render warnings.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
