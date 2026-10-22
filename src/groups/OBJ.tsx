// OBJ.tsx
import * as React from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import Label from '../primitives/Label';
import Group, { GroupProps } from './Group';
import { useViewContext } from '../utils/hooks';

const { useCallback, useEffect, useMemo, useRef, memo } = React;

interface OBJProps extends GroupProps {
  objPath: string;
  objURL: string;
  mtlPath?: string;
  mtlURL?: string;
  loadingLabel?: boolean;
  resourcePath?: string;
  /** Called once the loaded object has been added to the group. */
  onLoad?: (obj: THREE.Group) => void;
  /** Called once with the loader's error when the .obj or its .mtl cannot be loaded. */
  onError?: (error: unknown) => void;
}

/**
 * removeChildren
 *
 * Empties the group: the loading Label, or the previous model.
 * Object3D.remove mutates the children array, so iterate over a copy.
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function removeChildren(group: React.MutableRefObject<any>): void {
  if (group.current && Array.isArray(group.current.children)) {
    group.current.children.slice().map(child => group.current.remove(child));
  }
}

interface LoadOBJ {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  group: React.MutableRefObject<any>;
  objPath: string;
  objURL: string;
  castShadow: boolean;
  receiveShadow: boolean;
  isCancelled: () => boolean;
  onLoad: (obj: THREE.Group) => void;
  onError: (error: unknown) => void;
}

function loadOBJ({
  group,
  objPath,
  objURL,
  castShadow,
  receiveShadow,
  isCancelled,
  onLoad,
  onError,
}: LoadOBJ): void {
  const loader = new OBJLoader();
  loader.setPath(objPath);
  loader.load(
    objURL,
    obj => {
      if (isCancelled()) {
        return;
      }

      // Remove Loading Label or Previous OBJ
      if (group.current) {
        removeChildren(group);

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
        onLoad(obj);
      }
    },
    undefined,
    error => {
      if (isCancelled()) {
        return;
      }

      // Load Failure: log, draw nothing, report. Never throw.
      /* eslint-disable-next-line no-console */
      console.error(`[OBJ] Failed to load ${objPath}${objURL}`, error);
      removeChildren(group);
      onError(error);
    }
  );
}

interface LoadOBJAndMTL extends Omit<LoadOBJ, 'isCancelled'> {
  mtlPath?: string;
  mtlURL?: string;
  resourcePath?: string;
  envMap?: THREE.Texture;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  materialProps?: any;
}

/**
 * loadOBJAndMTL
 *
 * Loads the .obj (and its .mtl, when both mtlPath and mtlURL are given) into
 * the group and returns a cancel function. Once cancelled (the URL changed, or
 * the component unmounted), a load that completes or fails afterwards touches
 * nothing. A failed load of either file never throws: it is logged with the
 * URL, nothing is drawn, and onError is called once.
 */
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
  materialProps,
  onLoad,
  onError,
}: LoadOBJAndMTL): () => void {
  let cancelled = false;
  const cancel = (): void => {
    cancelled = true;
  };
  const isCancelled = (): boolean => cancelled;

  // No OBJ
  if (objURL == null) {
    /* eslint-disable-next-line no-console */
    console.warn('[OBJ] No objURL');
    return cancel;
  }

  // OBJ
  if (mtlPath == null || mtlURL == null) {
    loadOBJ({
      group,
      objPath,
      objURL,
      castShadow,
      receiveShadow,
      isCancelled,
      onLoad,
      onError,
    });
    return cancel;
  }

  // OBJ + MTL
  const mtlLoader = new MTLLoader();
  mtlLoader.setPath(mtlPath);
  if (resourcePath) {
    // @ts-ignore:TS2339 property setResourcePath does not exist in MTLLoader
    mtlLoader.setResourcePath(resourcePath);
  }
  mtlLoader.load(
    mtlURL,
    mtl => {
      if (cancelled) {
        return;
      }

      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.setPath(objPath);
      objLoader.load(
        objURL,
        obj => {
          if (cancelled) {
            return;
          }

          if (group.current) {
            // Remove Loading Label or Previous OBJ
            removeChildren(group);

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
                  Object.entries(otherMaterialProps).map(
                    ([propName, value]) => {
                      /* eslint-disable no-param-reassign */
                      // @ts-ignore:TS2339 material does not exist on Object3D
                      mesh.material[propName] = value;
                      /* eslint-enable no-param-reassign */
                      return null;
                    }
                  );
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
            onLoad(obj);
          }
        },
        undefined,
        error => {
          if (cancelled) {
            return;
          }

          // Load Failure: log, draw nothing, report. Never throw.
          /* eslint-disable-next-line no-console */
          console.error(`[OBJ] Failed to load ${objPath}${objURL}`, error);
          removeChildren(group);
          onError(error);
        }
      );
    },
    undefined,
    error => {
      if (cancelled) {
        return;
      }

      // Material Load Failure: the model is not drawn without its materials.
      /* eslint-disable-next-line no-console */
      console.error(
        `[OBJ] Failed to load materials ${mtlPath}${mtlURL}`,
        error
      );
      removeChildren(group);
      onError(error);
    }
  );

  return cancel;
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
  objPath = '',
  objURL,
  mtlPath,
  mtlURL,
  resourcePath,
  view3DEnvMap = false,
  castShadow = false,
  receiveShadow = false,
  loadingLabel = true,
  onLoad,
  onError,
  ...otherProps
}) {
  const group = useRef<THREE.Group | null>(null);
  const { envMap } = useViewContext();

  // Latest Callbacks
  // Read at load time through refs, so a new inline function on a re-render
  // never restarts the load.
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const handleLoad = useCallback(function handleLoad(obj: THREE.Group): void {
    if (onLoadRef.current) {
      onLoadRef.current(obj);
    }
  }, []);
  const handleError = useCallback(function handleError(error: unknown): void {
    if (onErrorRef.current) {
      onErrorRef.current(error);
    }
  }, []);

  // Material Props
  const materialProps = useMemo(
    function updateMaterialProps() {
      // No Material Props
      if (!otherProps || Object.keys(otherProps).length === 0) {
        return undefined;
      }

      // Acceptable Material Props
      const materialPropsKeys = [
        'color',
        'wireframe',
        'opacity',
        'transparent',
        'side',
        'depthWrite',
        'depthTest',
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
      return objURL || 'No objURL';
    },
    [objURL]
  );

  // Load OBJ + MTL
  useEffect(
    function updateOBJAndMTL() {
      return loadOBJAndMTL({
        group,
        objPath,
        objURL,
        mtlPath,
        mtlURL,
        envMap: _envMap,
        resourcePath,
        castShadow,
        receiveShadow,
        materialProps,
        onLoad: handleLoad,
        onError: handleError,
      });
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
      materialProps,
      handleLoad,
      handleError,
    ]
  );

  return (
    <Group ref={group} {...otherProps}>
      {loadingLabel && <Label text={loadingText} textColor="red" />}
    </Group>
  );
};

const OBJMemo = memo(OBJ);
OBJMemo.displayName = 'OBJ';
export default OBJMemo;
