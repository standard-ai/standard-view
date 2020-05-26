// SetRenderer.tsx
import * as React from "react";
import * as THREE from "three";
import { useFrame, useViewContext } from "../utils/hooks";

const { useEffect, memo } = React;

interface GLProps {
  autoClear?: boolean;
  autoClearColor?: boolean;
  autoClearDepth?: boolean;
  autoClearStencil?: boolean;
  clippingPlanes?: Array<THREE.Plane>;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  domElement?: React.DOMElement<any, any>;
  gammaFactor?: number;
  outputEncoding?: number;
  localClippingEnabled?: boolean;
  maxMorphTargets?: number;
  maxMorphNormals?: number;
  physicallyCorrectLights?: boolean;
  sortObjects?: boolean;
  toneMapping?: number;
  toneMappingExposure?: number;
  toneMappingWhitePoint?: number;
}

function SetRenderer(glProps: GLProps): null {
  const { gl } = useViewContext();

  useEffect(
    function initRenderer() {
      gl.autoClear = false;
      gl.autoClearColor = false;
      gl.autoClearDepth = false;
      gl.autoClearStencil = false;

      Object.entries(glProps).map(([key, value]) => {
        gl[key] = value;
        return null;
      });
    },
    [glProps, gl]
  );

  // Render Loop Head
  useFrame(
    /* eslint-disable no-shadow */
    function renderLoopHead({ gl, scene }) {
      /* eslint-enable no-shadow */
      /* eslint-disable no-param-reassign */
      scene.overrideMaterial = null;
      // @ts-ignore:TS2339 cancelTailRender does not exist
      scene.cancelTailRender = false;
      gl.clear();
      gl.clippingPlanes = [];
      /* eslint-enable no-param-reassign */
    },
    1,
    true
  );

  // Render Loop Tail
  useFrame(
    /* eslint-disable-next-line no-shadow */
    function renderLoopTall({ gl, scene, camera }) {
      // @ts-ignore:TS2339 cancelTailRender does not exist
      if (!scene.cancelTailRender) {
        gl.render(scene, camera);
      }
    },
    1000,
    true
  );

  return null;
}

const SetRendererMemo = memo(SetRenderer);
SetRendererMemo.displayName = "SetRenderer";
export default SetRendererMemo;
