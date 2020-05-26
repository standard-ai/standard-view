// OBJ.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import Label from "../primitives/Label";
import Group, { GroupProps, GroupPropTypes } from "./Group";
import { useViewContext } from "../utils/hooks";

const { useEffect, useMemo, useRef, memo } = React;

interface OBJProps extends GroupProps {
  objPath: string;
  objURL: string;
  mtlPath?: string;
  mtlURL?: string;
  resourcePath?: string;
}

interface LoadOBJ {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  group: React.MutableRefObject<any>;
  objPath: string;
  objURL: string;
  castShadow: boolean;
  receiveShadow: boolean;
}

function loadOBJ({ group, objPath, objURL, castShadow, receiveShadow }): void {
  const loader = new OBJLoader();
  loader.setPath(objPath);
  loader.load(objURL, obj => {
    // Remove Loading Label or Previous OBJ
    if (group.current) {
      if (group.current.children) {
        group.current.children.map(child => group.current.remove(child));
      }

      // Shadows
      obj.traverse(mesh => {
        /* eslint-disable no-param-reassign */
        // @ts-ignore:TS2339 isMesh does not exist on Object3D
        if (mesh.isMesh) {
          mesh.castShadow = castShadow;
          mesh.receiveShadow = receiveShadow;
        }
        /* eslint-enable no-param-reassign */
      });

      // Add OBJ
      group.current.add(obj);
    }
  });
}

interface LoadOBJAndMTL extends LoadOBJ {
  mtlPath?: string;
  mtlURL?: string;
  resourcePath?: string;
  envMap?: THREE.Texture;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  materialProps?: any;
}

function loadOBJAndMTL({
  group,
  objPath,
  objURL,
  mtlPath,
  mtlURL,
  envMap,
  resourcePath,
  castShadow,
  receiveShadow,
  materialProps
}: LoadOBJAndMTL): void {
  // No OBJ
  if (objURL == null) {
    /* eslint-disable-next-line no-console */
    console.warn("[OBJ] No objURL");
    return;
  }

  // OBJ
  if (mtlPath == null || mtlURL == null) {
    loadOBJ({ group, objPath, objURL, castShadow, receiveShadow });
    return;
  }

  // OBJ + MTL
  const mtlLoader = new MTLLoader();
  mtlLoader.setPath(mtlPath);
  if (resourcePath) {
    // @ts-ignore:TS2339 property setResourcePath does not exist in MTLLoader
    mtlLoader.setResourcePath(resourcePath);
  }
  mtlLoader.load(mtlURL, mtl => {
    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.setPath(objPath);
    objLoader.load(objURL, obj => {
      if (group.current) {
        // Remove Loading Label or Previous OBJ
        if (group.current.children) {
          group.current.children.map(child => group.current.remove(child));
        }

        // Material Props
        if (materialProps && obj.children) {
          const { color, ...otherMaterialProps } = materialProps;
          // Set Material Props for Each Mesh in OBJ Group of Meshes
          obj.children.map(mesh => {
            // @ts-ignore:TS2339 material does not exist on Object3D
            if (mesh.material) {
              if (color) {
                // @ts-ignore:TS2339 material does not exist on Object3D
                mesh.material.color.set(color);
              }
              Object.entries(otherMaterialProps).map(([propName, value]) => {
                /* eslint-disable no-param-reassign */
                // @ts-ignore:TS2339 material does not exist on Object3D
                mesh.material[propName] = value;
                /* eslint-enable no-param-reassign */
                return null;
              });
            }

            return null;
          });
        }

        // Env Map + Shadows
        obj.traverse(mesh => {
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

        // Add OBJ + MTL
        group.current.add(obj);
      }
    });
  });
}

/**
 * OBJ
 *
 * This component may render a textured mesh from a .obj, .mtl, and corresponding set of
 * image files. If mtlURL is not provided, only an untextured mesh from the .obj file
 * will be rendered.
 *
 * resourcePath allows the texture files to located in a directory different from the
 * mtlPath.
 */
const OBJ: React.FunctionComponent<OBJProps> = function OBJ({
  objPath = "",
  objURL,
  mtlPath,
  mtlURL,
  resourcePath,
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
      return objURL || "No objURL";
    },
    [objURL]
  );

  // Load OBJ + MTL
  useEffect(
    function updateOBJAndMTL() {
      if (group) {
        loadOBJAndMTL({
          group,
          objPath,
          objURL,
          mtlPath,
          mtlURL,
          envMap: _envMap,
          resourcePath,
          castShadow,
          receiveShadow,
          materialProps
        });
      }
    },
    [
      objPath,
      objURL,
      mtlPath,
      mtlURL,
      resourcePath,
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

// -----  PropTypes   ----- //
OBJ.propTypes = exact({
  objPath: PropTypes.string,
  objURL: PropTypes.string,
  mtlPath: PropTypes.string,
  mtlURL: PropTypes.string,
  resourcePath: PropTypes.string,
  ...GroupPropTypes
});

const OBJMemo = memo(OBJ);
OBJMemo.displayName = "OBJ";
export default OBJMemo;
