// FBX.tsx
import React, { useCallback, useEffect, useMemo, useRef, memo } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { useViewContext, useFrame } from '../utils/hooks';
import Group, { GroupProps } from './Group';
import { Label } from '../primitives';

interface FBXProps extends GroupProps {
  fbxPath?: string;
  fbxURL: string;
  loadingLabel?: boolean;
  actionIndex?: number;
  /** Called once the loaded group has been added, with its animation playing. */
  onLoad?: (fbx: THREE.Group) => void;
  /** Called once with the loader's error when the file cannot be loaded. */
  onError?: (error: unknown) => void;
}

function updateAllMaterials(
  color: string,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  children: any,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  materialProps: any
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

interface LoadFBXProps {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  group: React.MutableRefObject<any>;
  fbxPath: string;
  fbxURL: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  mixer: React.MutableRefObject<any>;
  envMap: THREE.Texture;
  castShadow: boolean;
  receiveShadow: boolean;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  materialProps: any;
  actionIndex?: number;
  onLoad: (fbx: THREE.Group) => void;
  onError: (error: unknown) => void;
}

/**
 * loadFBX
 *
 * Loads the file into the group and returns a cancel function. Once cancelled
 * (the URL changed, or the component unmounted), a load that completes or
 * fails afterwards touches nothing, so a slow earlier file never lands on top
 * of a newer one. A failed load never throws: it is logged with the URL,
 * nothing is drawn, and onError is called once.
 */
function loadFBX({
  group,
  fbxPath,
  fbxURL,
  mixer,
  envMap,
  castShadow,
  receiveShadow,
  materialProps,
  actionIndex = 0,
  onLoad,
  onError,
}: LoadFBXProps): () => void {
  let cancelled = false;
  const cancel = (): void => {
    cancelled = true;
  };

  // No FBX
  if (fbxURL == null) {
    /* eslint-disable no-console */
    console.warn('[FBX] No fbxURL');
    /* eslint-enable no-console */
    return cancel;
  }

  // FBX
  const fbxLoader = new FBXLoader();
  fbxLoader.setPath(fbxPath);
  fbxLoader.load(
    fbxURL,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (fbx: any) => {
      if (cancelled) {
        return;
      }

      if (group.current && fbx) {
        // Remove Loading Label or Previous FBX
        removeChildren(group);

        // Material Props
        if (materialProps) {
          const { color, ...otherMaterialProps } = materialProps;
          updateAllMaterials(color, fbx.scene.children, otherMaterialProps);
        }

        // Animation
        /* eslint-disable-next-line no-param-reassign */
        mixer.current = new THREE.AnimationMixer(fbx);
        if (fbx.animations && fbx.animations.length > 0) {
          const action = mixer.current.clipAction(fbx.animations[actionIndex]);
          action.play();
        }

        // Env Map + Shadows
        fbx.traverse(mesh => {
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

        // Add FBX
        group.current.add(fbx);
        onLoad(fbx);
      }
    },
    undefined,
    error => {
      if (cancelled) {
        return;
      }

      // Load Failure: log, draw nothing, report. Never throw.
      /* eslint-disable-next-line no-console */
      console.error(`[FBX] Failed to load ${fbxPath}${fbxURL}`, error);
      removeChildren(group);
      onError(error);
    }
  );

  return cancel;
}

const FBX: React.FunctionComponent<FBXProps> = function FBX({
  fbxPath = '',
  fbxURL,
  actionIndex = 0,
  view3DEnvMap = false,
  castShadow = false,
  receiveShadow = false,
  loadingLabel = true,
  onLoad,
  onError,
  ...otherProps
}) {
  const group = useRef<THREE.Group | null>(null);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const { envMap } = useViewContext();

  // Latest Callbacks
  // Read at load time through refs, so a new inline function on a re-render
  // never restarts the load.
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const handleLoad = useCallback(function handleLoad(fbx: THREE.Group): void {
    if (onLoadRef.current) {
      onLoadRef.current(fbx);
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
      return fbxURL || 'No fbxURL';
    },
    [fbxURL]
  );

  // Load FBX and Animation Mixer
  useEffect(
    function updateFBXandMixer() {
      return loadFBX({
        group,
        fbxPath,
        fbxURL,
        mixer,
        envMap: _envMap,
        castShadow,
        receiveShadow,
        materialProps,
        actionIndex,
        onLoad: handleLoad,
        onError: handleError,
      });
    },
    [
      group,
      fbxPath,
      fbxURL,
      actionIndex,
      _envMap,
      castShadow,
      receiveShadow,
      materialProps,
      handleLoad,
      handleError,
    ]
  );

  // Animation Mixer Update
  // @react-three/fiber passes every frame callback the seconds elapsed since
  // the previous frame, which is exactly what the mixer needs, so no clock of
  // our own: THREE.Clock is deprecated since three.js r183 and warns on every
  // construction.
  useFrame(function updateMixer(_state, delta: number) {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  return (
    <Group ref={group} {...otherProps}>
      {loadingLabel && <Label text={loadingText} textColor="red" />}
    </Group>
  );
};

const FBXMemo = memo(FBX);
FBXMemo.displayName = 'FBX';
export default FBXMemo;
