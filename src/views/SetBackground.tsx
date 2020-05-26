// SetBackground.tsx
import * as React from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { PMREMGenerator } from "three/src/extras/PMREMGenerator";
import { useViewContext } from "../utils";

const { useEffect, memo } = React;

function SetBackground({
  backgroundColor,
  backgroundTextureURL,
  backgroundEquirectangularTextureURL,
  backgroundEquirectangularRGBEURL
}): null {
  const { gl, scene, setViewContext } = useViewContext();
  const pmremGenerator = new PMREMGenerator(gl);
  pmremGenerator.compileEquirectangularShader();

  useEffect(
    function updateBackground() {
      if (backgroundEquirectangularRGBEURL != null) {
        // RGBE Equirectangular Skybox
        const path = backgroundEquirectangularRGBEURL;

        const rgbeLoader = new RGBELoader();
        rgbeLoader.setDataType(THREE.UnsignedByteType).load(path, texture => {
          const options = {
            minFilter: texture.minFilter,
            magFilter: texture.magFilter
          };
          scene.background = new THREE.WebGLCubeRenderTarget(
            2048,
            options
          ).fromEquirectangularTexture(gl, texture);
          // Using Prefiltered Mipmapped Radiance Environment Map for much smoother envmaps
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;
          setViewContext({ envMap });
          pmremGenerator.dispose();
        });
      } else if (backgroundEquirectangularTextureURL != null) {
        // Equirectangular Skybox
        const path = backgroundEquirectangularTextureURL;

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(path, texture => {
          const options = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter
          };
          scene.background = new THREE.WebGLCubeRenderTarget(
            2048,
            options
          ).fromEquirectangularTexture(gl, texture);
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;
          setViewContext({ envMap });
          pmremGenerator.dispose();
        });
      } else if (backgroundTextureURL != null) {
        // Background Image
        const path = backgroundTextureURL;
        scene.background = new THREE.TextureLoader().load(path);
      } else if (backgroundColor != null) {
        // Background Color
        gl.setClearColor(backgroundColor);
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
      backgroundColor
    ]
  );

  return null;
}

const SetBackgroundMemo = memo(SetBackground);
SetBackgroundMemo.displayName = "SetBackground";
export default SetBackgroundMemo;
