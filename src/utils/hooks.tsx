// hooks.ts
import {
  useState,
  useMemo,
  useCallback,
  useContext,
  useRef,
  useEffect
} from "react";
import { useFrame as r3rUseFrame, RenderCallback } from "react-three-fiber";
import { ViewContext } from "../views/ViewContext";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function useToggle(initialValue: any, alternate?: any): [any, Function] {
  const [value, setValue] = useState(initialValue);
  const alternateValue = useMemo(
    function initAlternateValue() {
      return alternate != null ? alternate : !initialValue;
    },
    [alternate, initialValue]
  );

  function toggleValue(): void {
    const newValue = value === initialValue ? alternateValue : initialValue;
    setValue(newValue);
  }

  return [value, toggleValue];
}

export function useFrame(
  f: RenderCallback,
  priority = 2,
  override = false
): void {
  let p = priority;
  if (!override) {
    p = p >= 2 ? p : 2;
  }
  r3rUseFrame(f, p);
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function useViewContext(): any {
  const { setViewContextValue, ...canvasProps } = useContext(ViewContext);

  const setViewContext = useCallback(
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    function updateSetViewContext(props: any): void {
      Object.entries(props).map(([key, value]) => {
        // Replace Existing Key-Value or Add New Key-Value
        canvasProps[key] = value;
        return null;
      });

      setViewContextValue(canvasProps);
    },
    [setViewContextValue, canvasProps]
  );

  return { setViewContext, ...canvasProps };
}

/**
 * useAnimationFrame
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const useAnimationFrame = (callback, dependencies?: any[]): void => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<number>();

  function animate(): void {
    callback();
    requestRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    animate();
    return (): void => {
      if (requestRef.current != null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, dependencies); // Make sure the effect runs only once
};
