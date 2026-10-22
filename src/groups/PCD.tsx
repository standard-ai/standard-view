// PCD.tsx
import * as React from 'react';
import * as THREE from 'three';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';
import Label from '../primitives/Label';
import Group, { GroupProps } from './Group';
import {
  ModelMaterialProps,
  applyModelMaterialProps,
  pickModelMaterialProps,
  setModelHoverTint,
} from '../utils/modelMaterials';

const { useCallback, useRef, useEffect, useMemo, useState, memo } = React;

/**
 * removeChildren
 *
 * Empties the group: the loading Label, or the previous point cloud.
 * Object3D.remove mutates the children array, so iterate over a copy.
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function removeChildren(group: React.MutableRefObject<any>): void {
  if (group.current && Array.isArray(group.current.children)) {
    group.current.children.slice().map(child => group.current.remove(child));
  }
}

interface LoadPCDProps {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  group: React.MutableRefObject<any>;
  pcdPath: string;
  pcdURL: string;
  pointSize: number;
  materialProps?: ModelMaterialProps;
  onLoad: (pcd: THREE.Points) => void;
  onError: (error: unknown) => void;
}

/**
 * loadPCD
 *
 * Loads the file into the group and returns a cancel function. Once cancelled
 * (the URL changed, or the component unmounted), a load that completes or
 * fails afterwards touches nothing, so a slow earlier file never lands on top
 * of a newer one. A failed load never throws: it is logged with the URL,
 * nothing is drawn, and onError is called once.
 */
function loadPCD({
  group,
  pcdPath,
  pcdURL,
  pointSize,
  materialProps,
  onLoad,
  onError,
}: LoadPCDProps): () => void {
  let cancelled = false;
  const cancel = (): void => {
    cancelled = true;
  };

  // No PCD
  if (pcdURL == null) {
    /* eslint-disable-next-line no-console */
    console.warn('[PCD] No pcdURL');
    return cancel;
  }

  // PCD
  const pcdLoader = new PCDLoader();
  pcdLoader.setPath(pcdPath);
  pcdLoader.load(
    pcdURL,
    pcd => {
      if (cancelled) {
        return;
      }

      if (group.current) {
        // Remove Loading Label or Previous PCD
        removeChildren(group);

        // Material Props
        // The points material takes the ones it has (color, opacity, ...).
        if (pcd.material) {
          /* eslint-disable no-param-reassign */
          // @ts-ignore:TS2339 size does not exist
          pcd.material.size = pointSize;
          /* eslint-enable no-param-reassign */
        }
        applyModelMaterialProps(pcd, materialProps);

        // Add PCD
        group.current.add(pcd);
        onLoad(pcd);
      }
    },
    undefined,
    error => {
      if (cancelled) {
        return;
      }

      // Load Failure: log, draw nothing, report. Never throw.
      /* eslint-disable-next-line no-console */
      console.error(`[PCD] Failed to load ${pcdPath}${pcdURL}`, error);
      removeChildren(group);
      onError(error);
    }
  );

  return cancel;
}

interface PCDProps extends GroupProps {
  pcdPath: string;
  pcdURL: string;
  pointSize: number;
  loadingLabel?: boolean;
  /** Called once the loaded point cloud has been added to the group. */
  onLoad?: (pcd: THREE.Points) => void;
  /** Called once with the loader's error when the file cannot be loaded. */
  onError?: (error: unknown) => void;
}

const PCD: React.FunctionComponent<PCDProps> = function PCD({
  pcdPath = '',
  pcdURL,
  pointSize = 0.01,
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

  // Hover
  // The loaded point cloud is added to the group imperatively, so the hover
  // color Group clones onto its React children never reaches it. Track the
  // hover here (through the handlers Group calls) and tint its material.
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
  const handleLoad = useCallback(function handleLoad(pcd: THREE.Points): void {
    model.current = pcd;
    if (hoveredRef.current && hoverColorRef.current != null) {
      setModelHoverTint(pcd, hoverColorRef.current);
    }
    if (onLoadRef.current) {
      onLoadRef.current(pcd);
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

  const loadingText = useMemo(
    function updateLoadText() {
      return pcdURL || 'No pcdURL';
    },
    [pcdURL]
  );

  // Load PCD
  useEffect(
    function updatePCD() {
      return loadPCD({
        group,
        pcdPath,
        pcdURL,
        pointSize,
        materialProps,
        onLoad: handleLoad,
        onError: handleError,
      });
    },
    [group, pcdPath, pcdURL, pointSize, materialProps, handleLoad, handleError]
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

const PCDMemo = memo(PCD);
PCDMemo.displayName = 'PCD';
export default PCDMemo;
