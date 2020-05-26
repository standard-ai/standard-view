// ContextBridge.tsx
import * as React from "react";
import { useFrame } from "react-three-fiber";

const { useState, useContext, memo } = React;

type ContextListenerProps = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  context: React.Context<any>;
  values: Array<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  index: number;
};

/**
 * ContextListener
 */
function ContextListener({
  context,
  values,
  index
}: ContextListenerProps): null {
  /* eslint-disable no-param-reassign */
  values[index] = useContext(context);
  /* eslint-enable no-param-reassign */
  return null;
}

/**
 * GeneraterContextListeners
 *
 * Create a ContextListener for each context in the given contexts array.
 * Each ContextListener must be a outside the react-three-fiber's Canvas
 * component to detect the context values ContextListener and changes
 * the value in the values array.
 * the useContext hook in each ContextListener.
 * This allows the context changes to be captured and passed into the
 * ContextBridge.
 */
export function GenerateContextListeners(
  /* eslint-disable @typescript-eslint/no-explicit-any */
  contexts: Array<React.Context<any>>,
  values: Array<any>
  /* eslint-enable @typescript-eslint/no-explicit-any */
): Array<React.ReactNode> {
  /* eslint-disable react/no-array-index-key */
  const contextListeners: Array<React.ReactNode> = contexts.map(
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (context: React.Context<any>, index: number) => (
      <ContextListener
        context={context}
        values={values}
        index={index}
        key={index}
      />
    )
  );
  /* eslint-enable react/no-array-index-key */
  return contextListeners;
}

type ContextBridgeProps = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  contexts?: Array<React.Context<any>>;
  values?: Array<any>;
  children?: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
};

/**
 * ContextBridge
 */
export const ContextBridge = memo(function ContextBridge({
  contexts,
  values,
  children
}: ContextBridgeProps) {
  const [, update] = useState();
  // Context Updater
  // Always trigger a rerender here and trust that
  // Context.Provider will only rerender when value
  // has changed
  useFrame(() => update({}));

  if (!contexts || !values) {
    return <>{children}</>;
  }

  return contexts.reduce(
    (child, Context, index) => (
      <Context.Provider value={values[index]}>{child}</Context.Provider>
    ),
    children
  );
});
ContextBridge.displayName = "ContextBridge";
