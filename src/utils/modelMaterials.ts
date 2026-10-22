// modelMaterials.ts
import * as THREE from 'three';
import { SIDE_TYPES } from './constants';

/**
 * The Mesh-style material props a loader (GLTF, OBJ, FBX, PCD) applies to
 * every material of the model it loads. A loaded model is added to the
 * loader's group imperatively, outside React, so these props cannot reach it
 * the way Group clones props onto its React children; the loaders apply them
 * here instead, once the model is in.
 */
export interface ModelMaterialProps {
  color?: string | THREE.Color;
  wireframe?: boolean;
  opacity?: number;
  transparent?: boolean;
  side?: string | THREE.Side;
  depthWrite?: boolean;
  depthTest?: boolean;
}

export const MODEL_MATERIAL_PROP_KEYS: Array<keyof ModelMaterialProps> = [
  'color',
  'wireframe',
  'opacity',
  'transparent',
  'side',
  'depthWrite',
  'depthTest',
];

const BASE_COLOR_KEY = 'standardViewBaseColor';

type ColoredMaterial = THREE.Material & { color: THREE.Color };

function hasColor(material: THREE.Material): material is ColoredMaterial {
  return (material as ColoredMaterial).color instanceof THREE.Color;
}

/**
 * pickModelMaterialProps
 *
 * Keeps the material props that are set (null and undefined are dropped,
 * false and 0 are kept) and returns undefined when none is.
 */
export function pickModelMaterialProps(
  props: Partial<Record<keyof ModelMaterialProps, unknown>>
): ModelMaterialProps | undefined {
  const picked: ModelMaterialProps = {};
  MODEL_MATERIAL_PROP_KEYS.forEach(key => {
    if (props[key] != null) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (picked as any)[key] = props[key];
    }
  });

  return Object.keys(picked).length > 0 ? picked : undefined;
}

/**
 * forEachMaterial
 *
 * Calls fn once per material under root (a material array counts once per
 * entry; a material shared by several objects is visited once per object).
 */
export function forEachMaterial(
  root: THREE.Object3D,
  fn: (material: THREE.Material) => void
): void {
  root.traverse(object => {
    const { material } = object as THREE.Mesh;
    if (!material) {
      return;
    }

    (Array.isArray(material) ? material : [material]).forEach(fn);
  });
}

/**
 * applyModelMaterialProps
 *
 * Sets the given props on every material under root that has them: color
 * through Color.set (strings, hex numbers and THREE.Color all work), side
 * through the same front / back / double names Mesh accepts, and the rest by
 * name, skipping a prop the material does not define (a PointsMaterial has no
 * wireframe). Materials are marked needsUpdate.
 */
export function applyModelMaterialProps(
  root: THREE.Object3D,
  props?: ModelMaterialProps
): void {
  if (!props) {
    return;
  }

  const { color, side, ...rest } = props;
  const resolvedSide = typeof side === 'string' ? SIDE_TYPES[side] : side;

  forEachMaterial(root, material => {
    if (color != null && hasColor(material)) {
      material.color.set(color);
    }

    if (resolvedSide != null) {
      /* eslint-disable-next-line no-param-reassign */
      material.side = resolvedSide;
    }

    Object.entries(rest).forEach(([key, value]) => {
      if (value != null && key in material) {
        /* eslint-disable-next-line no-param-reassign */
        material[key] = value;
      }
    });

    /* eslint-disable-next-line no-param-reassign */
    material.needsUpdate = true;
  });
}

/**
 * setModelHoverTint
 *
 * With a tint, saves each material's current color once (in its userData)
 * and sets the tint; with null, restores the saved color and forgets it.
 * Idempotent in both directions, and safe on materials shared between
 * objects: the first visit saves, the rest see the save.
 */
export function setModelHoverTint(
  root: THREE.Object3D,
  tint: string | THREE.Color | null
): void {
  forEachMaterial(root, material => {
    if (!hasColor(material)) {
      return;
    }

    const saved = material.userData[BASE_COLOR_KEY] as THREE.Color | undefined;

    if (tint != null) {
      if (!saved) {
        /* eslint-disable-next-line no-param-reassign */
        material.userData[BASE_COLOR_KEY] = material.color.clone();
      }
      material.color.set(tint);
    } else if (saved) {
      material.color.copy(saved);
      /* eslint-disable-next-line no-param-reassign */
      delete material.userData[BASE_COLOR_KEY];
    }
  });
}
