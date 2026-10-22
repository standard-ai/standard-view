// OBJ.tsx
import * as React from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import Label from '../primitives/Label';
import Group, { GroupProps } from './Group';
import { useViewContext } from '../utils/hooks';
import {
  ModelMaterialProps,
  applyModelMaterialProps,
  pickModelMaterialProps,
  setModelHoverTint,
} from '../utils/modelMaterials';

const { useCallback, useEffect, useMemo, useRef, useState, memo } = React;

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
  envMap?: THREE.Texture;
  castShadow: boolean;
  receiveShadow: boolean;
  materialProps?: ModelMaterialProps;
  isCancelled: () => boolean;
  onLoad: (obj: THREE.Group) => void;
  onError: (error: unknown) => void;
}

/**
 * addOBJ
 *
 * Puts a loaded object into the group: clears the loading Label or the
 * previous model, applies the material props, the environment map and the
 * shadow flags, adds the object and reports it.
 */
function addOBJ(
  { group, envMap, castShadow, receiveShadow, materialProps, onLoad }: LoadOBJ,
  obj: THREE.Group
): void {
  if (!group.current) {
    return;
  }

  // Remove Loading Label or Previous OBJ
  removeChildren(group);

  // Material Props
  applyModelMaterialProps(obj, materialProps);

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

  // Add OBJ
  group.current.add(obj);
  onLoad(obj);
}

function loadOBJ(props: LoadOBJ): void {
  const { group, objPath, objURL, isCancelled, onError } = props;
  const loader = new OBJLoader();
  loader.setPath(objPath);
  loader.load(
    objURL,
    obj => {
      if (isCancelled()) {
        return;
      }

      addOBJ(props, obj);
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

  const loadProps: LoadOBJ = {
    group,
    objPath,
    objURL,
    envMap,
    castShadow,
    receiveShadow,
    materialProps,
    isCancelled,
    onLoad,
    onError,
  };

  // OBJ
  if (mtlPath == null || mtlURL == null) {
    loadOBJ(loadProps);
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

          addOBJ(loadProps, obj);
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
  hoverColor,
  onPointerOver,
  onPointerOut,
  ...otherProps
}) {
  const group = useRef<THREE.Group | null>(null);
  const model = useRef<THREE.Object3D | null>(null);
  const { envMap } = useViewContext();

  // Hover
  // The loaded model is added to the group imperatively, so the hover color
  // Group clones onto its React children never reaches it. Track the hover
  // here (through the handlers Group calls) and tint the model's materials.
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  const hoverColorRef = useRef(hoverColor);
  hoverColorRef.current = hoverColor;
  const handlePointerOver = useCallback(
    function handlePointerOver(eventProps: unknown): void {
      hoveredRef.current = true;
      setHovered(true);
      if (onPointerOver) {
        onPointerOver(eventProps);
      }
    },
    [onPointerOver]
  );
  const handlePointerOut = useCallback(
    function handlePointerOut(eventProps: unknown): void {
      hoveredRef.current = false;
      setHovered(false);
      if (onPointerOut) {
        onPointerOut(eventProps);
      }
    },
    [onPointerOut]
  );
  // Only attach handlers when something listens, so a loader inside a Group
  // keeps forwarding events to that Group as before.
  const hoverHandlers =
    hoverColor != null || onPointerOver || onPointerOut
      ? { onPointerOver: handlePointerOver, onPointerOut: handlePointerOut }
      : {};
  useEffect(
    function updateHoverTint() {
      if (model.current) {
        setModelHoverTint(
          model.current,
          hovered && hoverColor != null ? hoverColor : null
        );
      }
    },
    [hovered, hoverColor]
  );

  // Latest Callbacks
  // Read at load time through refs, so a new inline function on a re-render
  // never restarts the load.
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const handleLoad = useCallback(function handleLoad(obj: THREE.Group): void {
    model.current = obj;
    if (hoveredRef.current && hoverColorRef.current != null) {
      setModelHoverTint(obj, hoverColorRef.current);
    }
    if (onLoadRef.current) {
      onLoadRef.current(obj);
    }
  }, []);
  const handleError = useCallback(function handleError(error: unknown): void {
    model.current = null;
    if (onErrorRef.current) {
      onErrorRef.current(error);
    }
  }, []);

  // Material Props
  // Memoised on the values, not on the props object, so a re-render (a hover,
  // a parent update) never restarts the load.
  const {
    color,
    wireframe,
    opacity,
    transparent,
    side,
    depthWrite,
    depthTest,
  } = otherProps;
  const materialProps = useMemo(
    function updateMaterialProps() {
      return pickModelMaterialProps({
        color,
        wireframe,
        opacity,
        transparent,
        side,
        depthWrite,
        depthTest,
      });
    },
    [color, wireframe, opacity, transparent, side, depthWrite, depthTest]
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
    <Group
      ref={group}
      hoverColor={hoverColor}
      {...hoverHandlers}
      {...otherProps}
    >
      {loadingLabel && <Label text={loadingText} textColor="red" />}
    </Group>
  );
};

const OBJMemo = memo(OBJ);
OBJMemo.displayName = 'OBJ';
export default OBJMemo;
