// events.tsx
import * as React from "react";
import { RenderCallback } from "react-three-fiber";
import { useAnimationFrame } from "./util";

const { memo } = React;

// -----   Event Function Helpers   ----- //
// Check Mouse Propagation
export function checkPropagation(e, mousePropagation: boolean): void {
  if (!mousePropagation) {
    e.stopPropagation();
  }
}

// Handle Click and Double Click
interface HandleClickProps {
  mousePropagation: boolean;
  clickSensitivity: number;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  eventProps: any;
  onClick?: Function;
  onDoubleClick?: Function;
}
export function handleClick({
  mousePropagation,
  clickSensitivity,
  eventProps,
  onClick,
  onDoubleClick
}: HandleClickProps): React.MouseEventHandler {
  return (e): null => {
    // Mouse Propagation
    checkPropagation(e, mousePropagation);

    // No Click Functions
    if (!onClick && !onDoubleClick) {
      return null;
    }

    const state = eventProps.state;

    // No onDoubleClick
    if (onClick && !onDoubleClick) {
      // @ts-ignore TS2722 // Cannot invoke an object which is possible undefined
      onClick({ ...e, ...eventProps });
      return null;
    }

    // Click Time
    const currentTime = Date.now();

    // Double Click
    if (onDoubleClick) {
      if (currentTime - state.lastClickTime <= clickSensitivity) {
        // Set Last Click
        state.lastClickTime = currentTime;
        // @ts-ignore TS2722 // Cannot invoke an object which is possible undefined
        onDoubleClick({ ...e, ...eventProps });
        return null;
      }
    }

    // Single Click
    if (onClick) {
      // Waits to check for Double Click before executing
      setTimeout(() => {
        const initialClickTime = currentTime;
        if (state.lastClickTime === initialClickTime) {
          // @ts-ignore TS2722 // Cannot invoke an object which is possible undefined
          onClick({ ...e, ...eventProps });
        }

        return null;
      }, clickSensitivity + 1);
    }

    // Set Last Click
    state.lastClickTime = currentTime;

    return null;
  };
}

interface AnimationComponentProps {
  animation: RenderCallback;
}

/**
 * AnimationComponent
 *
 * Isolate react-three-fiber's useFrame hook to add animation
 * function to three's render loop.
 */
export const AnimationComponent = memo<AnimationComponentProps>(
  /* eslint-disable react/prop-types */
  function AnimationComponent({ animation }) {
    useAnimationFrame(animation, [animation]);
    return null;
  }
  /* eslint-enable react/prop-types */
);
AnimationComponent.displayName = "AnimationComponent";
