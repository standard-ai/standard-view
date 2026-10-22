// SetBackground.tsx
import * as React from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { PMREMGenerator } from 'three';
import { useViewContext } from '../utils';

const { useEffect, memo } = React;

function SetBackground({
  backgroundColor,
  backgroundTextureURL,
  backgroundEquirectangularTextureURL,
  backgroundEquirectangularRGBEURL,
}): null {
  const { gl, scene, setViewContext } = useViewContext();

  useEffect(
    function updateBackground() {
      const pmremGenerator = new PMREMGenerator(gl);
      pmremGenerator.compileEquirectangularShader();

      if (backgroundEquirectangularRGBEURL) {
        // HDR
        // RGBE Equirectangular Skybox
        const path = backgroundEquirectangularRGBEURL;

        new RGBELoader().setDataType(THREE.FloatType).load(path, texture => {
          // Mark as equirectangular
          texture.mapping = THREE.EquirectangularReflectionMapping;
          // For HDR normally keep colorSpace as Linear
          texture.colorSpace = THREE.LinearSRGBColorSpace;
          scene.background = texture;

          // Using Prefiltered Mipmapped Radiance Environment Map for much smoother envmaps
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;

          scene.environment = envMap;
          setViewContext({ envMap });

          texture.dispose();
          pmremGenerator.dispose();
        });
      } else if (backgroundEquirectangularTextureURL) {
        // LDR
        // Equirectangular Skybox
        const path = backgroundEquirectangularTextureURL;

        new THREE.TextureLoader().load(path, texture => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          texture.colorSpace = THREE.SRGBColorSpace;
          scene.background = texture;

          const envMap = pmremGenerator.fromEquirectangular(texture).texture;

          scene.environment = envMap;
          setViewContext({ envMap });

          texture.dispose();
          pmremGenerator.dispose();
        });
      } else if (backgroundTextureURL) {
        // 2D Background
        // Background Image
        const path = backgroundTextureURL;
        new THREE.TextureLoader().load(path, texture => {
          texture.colorSpace = THREE.SRGBColorSpace;
          scene.background = texture;
        });
      } else if (backgroundColor != null) {
        // Solid Color
        // Background Color
        gl.setClearColor(backgroundColor);
        scene.background = null;
      }
    },
    // setViewContext causes useState to update setViewContexValue
    // in ViewContextProvider this triggers an update in useViewContext,
    // hence a endless update cycle will occur if updateBackground depended on setViewContext
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [
      gl,
      scene,
      backgroundEquirectangularRGBEURL,
      backgroundEquirectangularTextureURL,
      backgroundTextureURL,
      backgroundColor,
    ]
  );

  return null;
}

const SetBackgroundMemo = memo(SetBackground);
SetBackgroundMemo.displayName = 'SetBackground';
export default SetBackgroundMemo;
