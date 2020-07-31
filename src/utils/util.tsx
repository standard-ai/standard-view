// util.ts
import * as THREE from "three";
import React, { memo, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Stats from "stats.js";
import { useAnimationFrame } from "./hooks";
import { ANCHORS, ANCHOR_SYNONYMS } from "./constants";

/**
 * getAlignmentOffset
 *
 * Given an old anchor position and new anchor position as strings,
 * for example, oldAnchor: "right"  and newAnchor: "center",
 * and also optional current position, diagonal, and scale,
 * getAlignmentOffset will provide the new position.
 *
 * diagonal is the displacement between the boundingBox.min
 * and boundingBox.max or any other displacement between
 * the min and max corners. This is necessary for Labels and Text,
 * where the fundamental geometry is not to unit scale of [1, 1, 1].
 *
 * In general, it is better to apply getAlignmentOffset on
 * unit geometry before scaling.
 */
export function getAlignmentOffset(
  oldAnchor: string,
  newAnchor: string,
  diagonal: Array<number> = [1, 1, 1]
): Array<number> {
  const posVec = new THREE.Vector3();
  diagonal.map((val, index) => {
    /* eslint-disable-next-line no-param-reassign */
    diagonal[index] = Math.abs(val);
    return null;
  });
  const diagonalVec = new THREE.Vector3(...diagonal);
  const oldAnchorVec = ANCHORS[ANCHOR_SYNONYMS[oldAnchor]];
  const newAnchorVec = ANCHORS[ANCHOR_SYNONYMS[newAnchor]];
  const offset = oldAnchorVec.clone().sub(newAnchorVec);
  posVec.add(offset.multiply(diagonalVec));
  return [posVec.x, posVec.y, posVec.z];
}

/**
 * reconcileSynonymousProps
 *
 * Given the correct type, synonymous prop key value pairs are removed.
 * If correctly named prop does not exist, value is extracted from
 * synonymous props and assigned to the correctly named prop, then
 * synonymous props are removed.
 *
 * This functions mutates props!
 */
export function reconcileSynonymousProps(
  /* eslint-disable @typescript-eslint/no-explicit-any */
  props: any,
  synonymousProps: Record<string, string>[],
  /* eslint-enable @typescript-eslint/no-explicit-any */
  correctType: string,
  opposite = false
): void {
  synonymousProps.map(propNames => {
    const correctName = propNames[correctType];
    const synnonyms: string[] = Object.values(propNames).filter(
      name => name !== correctName
    );

    // Assign Synnonymous Prop
    if (props[correctName] == null) {
      /* eslint-disable no-restricted-syntax */ // loop
      for (const synnonym of synnonyms) {
        if (props[synnonym] != null) {
          /* eslint-disable-next-line no-param-reassign */
          props[correctName] = opposite ? !props[synnonym] : props[synnonym];
          break;
        }
      }
      /* eslint-enable no-restricted-syntax */
    }
    // Delete Synnonymous Props
    /* eslint-disable no-restricted-syntax */
    for (const synnonym of synnonyms) {
      /* eslint-disable-next-line no-param-reassign */
      delete props[synnonym];
    }
    /* eslint-enable no-restricted-syntax */

    return null;
  });
}

export function areArraysEqual(array1, array2): boolean {
  return (
    Array.isArray(array1) &&
    Array.isArray(array2) &&
    array1.length === array2.length &&
    array1[0] === array2[0] &&
    array1[1] === array2[1] &&
    array1[2] === array2[2]
  );
}

/**
 * FPS
 */
export const FPS = memo(function FPS() {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const ref: React.RefObject<any> = useRef();
  const s = new Stats();

  useEffect(() => {
    s.showPanel(0);
    ref.current.appendChild(s.dom);
  });

  useAnimationFrame(() => {
    s.begin();
    s.end();
  }, [ref, s]);

  return (
    <>
      <div ref={ref} />
    </>
  );
});

FPS.displayName = "FPS";

/**
 * RGBStringToNumber
 */
export function RGBStringToNumber(
  rgbString
): { r: number; g: number; b: number } {
  let [, r, g, b] = rgbString.split(/[,()]/);
  r = parseInt(r, 10);
  g = parseInt(g, 10);
  b = parseInt(b, 10);
  return { r, g, b };
}

/**
 * numberToRGBString
 */
export function numberToRGBString(r, g, b): string {
  return `RGB(${r}, ${g}, ${b})`;
}

/**
 * objectToArray
 * returns obj if already an array
 * default is [0, 0, 0]
 * default is array of all zeros for custom order with more than 3 components
 */
export function objectToArray(obj, order = "xyz"): Array<number> {
  // Object is an Array
  if (Array.isArray(obj)) {
    return obj;
  }

  // Convert object to array of numbers
  const array: Array<number> = [];
  /* eslint-disable no-restricted-syntax */
  for (const component of order.split("")) {
    // Object with any missing components yields default
    if (Number.isNaN(obj[component])) {
      return Array(order.length).fill(0);
    }

    array.push(obj[component]);
  }
  /* eslint-enable no-restricted-syntax */

  return array;
}

/**
 * arrayToObject
 * returns array if already an object with fields x, y, and z
 * default is { x: 0, y: 0, z: 0 }
 * default is an object with all zero value components for custom order
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function arrayToObject(array, order = "xyz"): any {
  const obj: any = {};
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // Not an Array or does not have enough elements
  if (!Array.isArray(array) || array.length < order.length) {
    order.split("").map(component => {
      obj[component] = 0;

      return null;
    });

    return obj;
  }

  // Convert array to object
  order.split("").map((component, index) => {
    obj[component] = array[index];

    return null;
  });
  return obj;
}

/**
 * arrayToQuaternion
 * return THREE.Quaternion if already THREE.Quaternion
 */
export function toQuaternion(obj, order = "xyzw"): THREE.Quaternion {
  const quaternion = { x: 0, y: 0, z: 0, w: 1 };

  if (Array.isArray(obj) && obj.length === 4) {
    // Array
    order.split("").map((component, i) => {
      quaternion[component] = obj[i];
      return null;
    });
  } else {
    // Object
    order.split("").map(component => {
      if (obj[component] == null) {
        console.warn(
          `[toQuaternion] argument does not have component: ${component}. Default Quaternion(0, 0, 0, 1) returned.`
        );
        return new THREE.Quaternion();
      }
      quaternion[component] = obj[component];

      return null;
    });
  }

  return new THREE.Quaternion(
    quaternion.x,
    quaternion.y,
    quaternion.z,
    quaternion.w
  );
}

/**
 * filterArrayLength
 */
export function filterArrayLength(
  array,
  length = 3,
  defaultArray = [0, 0, 0]
): Array<number> | undefined {
  return Array.isArray(array) && array.length === length ? array : defaultArray;
}

/**
 * billboard
 */
export function billboard({ mesh, camera }): void {
  mesh.current.lookAt(camera.position);
  /* eslint-disable-next-line no-param-reassign */
  mesh.current.up = camera.up;
}

// -----   Custom PropTypes   ----- //
/**
 * propTypeNumberArrayOfLength
 * Custom PropType Validation of Array<number> with specific length.
 */
export function propTypeNumberArrayOfLength(length) {
  return function customPropType(
    props,
    propName,
    componentName,
    location,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    propFullName
  ): Error | null {
    /* eslint-disable-next-line react/destructuring-assignment */
    if (!/matchme/.test(props[propName])) {
      const prop = props[propName];

      // No Prop
      if (prop == null) {
        return null;
      }

      // Array Check
      if (!Array.isArray(prop)) {
        return new Error(
          `Invalid prop \`${propName}\` of type \`${typeof prop}\` supplied to \`${componentName}\`, expected an array of length ${length}.`
        );
      }

      // Length Check
      if (prop.length !== length) {
        return new Error(
          `Invalid prop \`${propName}\` of type \`${typeof prop}\` of length ${
            prop.length
          } supplied to \`${componentName}\`, expected an array of length ${length}.`
        );
      }

      // Each Element Number Check
      const checkTypes = {};
      checkTypes[propName] = PropTypes.arrayOf(PropTypes.number);
      const checkProps = {};
      checkProps[propName] = prop;
      PropTypes.checkPropTypes(checkTypes, checkProps, location, componentName);
    }

    return null;
  };
}
