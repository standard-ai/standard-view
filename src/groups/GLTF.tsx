// GLTF.tsx
import * as React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF as GLTFResult } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import Label from '../primitives/Label';
import Group, { GroupProps } from './Group';
import { useViewContext } from '../utils/hooks';

const { useCallback, useEffect, useMemo, useRef, memo } = React;

const DRACO_DECODER_SOURCE =
  'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/libs/draco/';

interface GLTFProps extends GroupProps {
  gltfPath?: string;
  gltfURL: string;
  dracoDecoderPath?: string;
  loadingLabel?: boolean;
  /** Called once the loaded scene has been added to the group. */
  onLoad?: (gltf: GLTFResult) => void;
  /** Called once with the loader's error when the file cannot be loaded. */
  onError?: (error: unknown) => void;
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
    if (object.constructor.name === 'Group' && object.children) {
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
  onLoad: (gltf: GLTFResult) => void;
  onError: (error: unknown) => void;
}

/**
 * loadGLTF
 *
 * Loads the file into the group and returns a cancel function. Once cancelled
 * (the URL changed, or the component unmounted), a load that completes or
 * fails afterwards touches nothing, so a slow earlier file never lands on top
 * of a newer one. A failed load never throws: it is logged with the URL,
 * nothing is drawn, and onError is called once.
 */
function loadGLTF({
  group,
  gltfPath,
  gltfURL,
  dracoDecoderPath,
  envMap,
  castShadow,
  receiveShadow,
  materialProps,
  onLoad,
  onError,
}: LoadGLTFProps): () => void {
  let cancelled = false;
  const cancel = (): void => {
    cancelled = true;
  };

  // No GLTF
  if (gltfURL == null) {
    /* eslint-disable no-console */
    console.warn('[GLTF] No gltfURL');
    /* eslint-enable no-console */
    return cancel;
  }

  // GLTF
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(dracoDecoderPath);
  gltfLoader.setDRACOLoader(dracoLoader);

  gltfLoader.setPath(gltfPath);
  gltfLoader.load(
    gltfURL,
    gltf => {
      if (cancelled) {
        return;
      }

      if (group.current && gltf.scene && gltf.scene.children) {
        // Remove Loading Label or Previous GLTF
        removeChildren(group);

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
        onLoad(gltf);
      }
    },
    undefined,
    error => {
      if (cancelled) {
        return;
      }

      // Load Failure: log, draw nothing, report. Never throw.
      /* eslint-disable-next-line no-console */
      console.error(`[GLTF] Failed to load ${gltfPath}${gltfURL}`, error);
      removeChildren(group);
      onError(error);
    }
  );

  return cancel;
}

const GLTF: React.FunctionComponent<GLTFProps> = function GLTF({
  gltfPath = '',
  gltfURL,
  dracoDecoderPath = DRACO_DECODER_SOURCE,
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
  const handleLoad = useCallback(function handleLoad(gltf: GLTFResult): void {
    if (onLoadRef.current) {
      onLoadRef.current(gltf);
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
      return gltfURL || 'No gltfURL';
    },
    [gltfURL]
  );

  // Load GLTF
  useEffect(
    function updateGLTF() {
      return loadGLTF({
        group,
        gltfPath,
        gltfURL,
        dracoDecoderPath,
        envMap: _envMap,
        castShadow,
        receiveShadow,
        materialProps,
        onLoad: handleLoad,
        onError: handleError,
      });
    },
    [
      group,
      gltfPath,
      gltfURL,
      dracoDecoderPath,
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

const GLTFMemo = memo(GLTF);
GLTFMemo.displayName = 'GLTF';
export default GLTFMemo;
