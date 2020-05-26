// ViewContext.tsx
import * as React from "react";

const { useState, createContext, memo } = React;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const ViewContext: React.Context<any> = createContext([]);

type ViewContextProviderProps = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  canvasProps: React.MutableRefObject<any>;
  children?: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
};

/**
 * ViewContextProvider
 *
 * Placing <ViewContext.Provider value={canvasProps.current}>
 * directly into the return statement of View3D does not wait for
 * canvasProps to be set by SetCanvasProps, and instead the
 * context value is set to null.
 *
 * Encapsulating <ViewContext.Provider> in a component delays the
 * creation of the provider, hence delays setting value until
 * after SetCanvasProps has been created.
 *
 * Cannot add ViewContext to contextListeners and apply in GenerateContexts
 * because canvasProps do not exist at that time.
 */
export const ViewContextProvider = memo(function ViewContextProvider({
  canvasProps,
  children
}: ViewContextProviderProps) {
  const [viewContextValue, setViewContextValue] = useState(canvasProps.current);
  const value = {
    setViewContextValue,
    ...viewContextValue
  };
  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
});
ViewContextProvider.displayName = "ViewContextProvider";
