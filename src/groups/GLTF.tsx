// GLTF.tsx
import * as React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Label from "../primitives/Label";
import Group, { GroupProps, GroupPropTypes } from "./Group";
import { useViewContext } from "../utils/hooks";

const { useEffect, useMemo, useRef, memo } = React;

const DRACO_DECODER_SOURCE =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/";

interface GLTFProps extends GroupProps {
  gltfPath?: string;
  gltfURL: string;
  dracoDecoderPath?: string;
}

function updateAllMaterials(
  color: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  children: any,
  materialProps: any
  /* eslint-enable @typescript-eslint/no-explicit-any */
): void {
  if (children == null) {
    return;
  }

  const _children = Array.isArray(children) ? children : [children];

  _children.map(object => {
    // Recurse into Groups
    if (object.constructor.name === "Group" && object.children) {
      updateAllMaterials(color, object.children, materialProps);
    }

    // @ts-ignore:TS2339 material does not exist on Object3D
    if (object.material) {
      if (color) {
        // @ts-ignore:TS2339 material does not exist on Object3D
        object.material.color.set(color);
      }
      Object.entries(materialProps).map(([propName, value]) => {
        /* eslint-disable no-param-reassign */
        // @ts-ignore:TS2339 material does not exist on Object3D
        object.material[propName] = value;
        /* eslint-enable no-param-reassign */
        return null;
      });
    }

    return null;
  });
}

interface LoadGLTFProps {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  group: React.MutableRefObject<any>;
  gltfPath: string;
  gltfURL: string;
  dracoDecoderPath: string;
  envMap: THREE.Texture;
  castShadow: boolean;
  receiveShadow: boolean;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  materialProps: any;
}

function loadGLTF({
  group,
  gltfPath,
  gltfURL,
  dracoDecoderPath,
  envMap,
  castShadow,
  receiveShadow,
  materialProps
}: LoadGLTFProps): void {
  // No GLTF
  if (gltfURL == null) {
    /* eslint-disable no-console */
    console.warn("[GLTF] No gltfURL");
    /* eslint-enable no-console */
    return;
  }

  // GLTF
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(dracoDecoderPath);
  gltfLoader.setDRACOLoader(dracoLoader);

  gltfLoader.setPath(gltfPath);
  gltfLoader.load(gltfURL, gltf => {
    if (group.current && gltf.scene && gltf.scene.children) {
      // Remove Loading Label or Previous OBJ
      if (group.current.children) {
        group.current.children.map(child => group.current.remove(child));
      }

      // Material Props
      if (materialProps) {
        const { color, ...otherMaterialProps } = materialProps;
        updateAllMaterials(color, gltf.scene.children, otherMaterialProps);
      }

      // Env Map + Shadows
      gltf.scene.traverse(mesh => {
        /* eslint-disable no-param-reassign */
        // @ts-ignore
        if (mesh.isMesh) {
          if (envMap) {
            // @ts-ignore
            mesh.material.envMap = envMap;
          }
          mesh.castShadow = castShadow;
          mesh.receiveShadow = receiveShadow;
        }
        /* eslint-enable no-param-reassign */
      });

      // Add GLTF
      group.current.add(gltf.scene);
    }
  });
}

const GLTF: React.FunctionComponent<GLTFProps> = function GLTF({
  gltfPath = "",
  gltfURL,
  dracoDecoderPath = DRACO_DECODER_SOURCE,
  view3DEnvMap = false,
  castShadow = false,
  receiveShadow = false,
  ...otherProps
}) {
  const group = useRef();
  const { envMap } = useViewContext();

  // Material Props
  const materialProps = useMemo(
    function updateMaterialProps() {
      // No Material Props
      if (!otherProps || Object.keys(otherProps).length === 0) {
        return undefined;
      }

      // Acceptable Material Props
      const materialPropsKeys = [
        "color",
        "wireframe",
        "opacity",
        "transparent",
        "side",
        "depthWrite",
        "depthTest"
      ];

      // Extract Acceptable Props
      const props = {};
      materialPropsKeys.map(propName => {
        if (otherProps[propName]) {
          props[propName] = otherProps[propName];
        }

        return null;
      });

      return Object.keys(props).length > 0 ? props : undefined;
    },
    [otherProps]
  );

  // Environment Map
  const _envMap = useMemo(
    function updateEnvMap() {
      if (view3DEnvMap) {
        return envMap;
      }

      return null;
    },
    [view3DEnvMap, envMap]
  );

  // Loading Text
  const loadingText = useMemo(
    function updateLoadText() {
      return gltfURL || "No gltfURL";
    },
    [gltfURL]
  );

  // Load GLTF
  useEffect(
    function updateGLTF() {
      if (group) {
        loadGLTF({
          group,
          gltfPath,
          gltfURL,
          dracoDecoderPath,
          envMap: _envMap,
          castShadow,
          receiveShadow,
          materialProps
        });
      }
    },
    [
      group,
      gltfPath,
      gltfURL,
      dracoDecoderPath,
      _envMap,
      castShadow,
      receiveShadow,
      materialProps
    ]
  );

  return (
    <Group ref={group} {...otherProps}>
      <Label text={loadingText} textColor="red" />
    </Group>
  );
};

GLTF.propTypes = exact({
  gltfPath: PropTypes.string,
  gltfURL: PropTypes.string,
  dracoDecoderPath: PropTypes.string,
  ...GroupPropTypes
});

const GLTFMemo = memo(GLTF);
GLTFMemo.displayName = "GLTF";
export default GLTFMemo;
