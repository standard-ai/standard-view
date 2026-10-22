// SetShadows.tsx
import * as React from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { useViewContext } from "../utils";

const { useEffect, memo } = React;

function SetShadows({ shadowMapEnabled, shadowType }): null {
  const { gl, scene } = useViewContext();

  useEffect(
    function updateShadowMap() {
      // @react-three/fiber's Canvas `shadows` prop already drives
      // gl.shadowMap.enabled/type (see View3D). What R3F does NOT do is
      // recompile existing materials when those change -- the shadow code is
      // baked into each material's shader, so without a recompile the shadows
      // stay frozen on the previous setting. Force the recompile (and a shadow
      // map re-render) here on every enable/type change.
      scene.traverse(object => {
        const { material } = object as THREE.Mesh;
        if (!material) {
          return;
        }
        const materials = Array.isArray(material) ? material : [material];
        materials.forEach(m => {
          m.needsUpdate = true;
        });
      });
      gl.shadowMap.needsUpdate = true;
    },
    [shadowMapEnabled, shadowType, gl, scene]
  );

  useEffect(function initRectAreaLightUniforms() {
    RectAreaLightUniformsLib.init();
  }, []);

  return null;
}

const SetShadowsMemo = memo(SetShadows);
SetShadowsMemo.displayName = "SetShadows";
export default SetShadowsMemo;
