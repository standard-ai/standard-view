// SetShadows.tsx
import * as React from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import { useViewContext } from "../utils";

const { useEffect, memo } = React;

function SetShadows({ shadowMapEnabled, shadowType }): null {
  const { gl } = useViewContext();

  useEffect(
    function updateShadowMap() {
      gl.shadowMap.enabled = shadowMapEnabled;
      if (!shadowMapEnabled) {
        return;
      }

      switch (shadowType) {
        case "basic":
          gl.shadowMap.type = THREE.BasicShadowMap;
          break;
        case "pcf":
          gl.shadowMap.type = THREE.PCFShadowMap;
          break;
        case "pcfsoft":
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          break;
        default:
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }
    },
    [shadowMapEnabled, shadowType, gl]
  );

  useEffect(function initRectAreaLightUniforms() {
    RectAreaLightUniformsLib.init();
  }, []);

  return null;
}

const SetShadowsMemo = memo(SetShadows);
SetShadowsMemo.displayName = "SetShadows";
export default SetShadowsMemo;
