// RectAreaLight.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Plane from "../primitives/Plane";
import Cylinder from "../primitives/Cylinder";
import { EPS } from "../utils/math";
import { propTypeNumberArrayOfLength } from "../utils/util";

const { useEffect, useMemo, memo } = React;

interface RectAreaLightHelperProps {
  position: Array<number>;
  target: Array<number>;
  width: number;
  height: number;
  helperColor: string;
}

/**
 * RectAreaLightHelper
 *
 * During a re-render, react-three-fiber's reconciler executes a switchInstance
 * function if a component has new arguments. This switchInstance basically creates
 * a newInstance with the new arguments and removes old instance.
 *
 * The old instance of the component is removed via a removeChild function which
 * also invokes a removeRecursive function that also removes children of the child,
 * recursively. This ensures all nested children are removed.
 *
 * Unfortunately, react-three-fiber's removeChild function first removes the child,
 * then recursively removes its children, and then checks if the child has a
 * dispose function and calls it--which allows for three.js cleanup code to execute
 * upon removal, and finally deletes the reference.
 *
 * Due to this order of remove, recursively remove, dispose, and delete,
 * an invalid reference crash occurs.
 *
 * This bug is due to the fact that three.js normally stores the geometry and material
 * of a Mesh/Object3D in class variables named geometry and material.
 * However, for RectAreaLightHelper, the Line's (outlining the plane of the helper) has
 * its geometry and material stored in variables of those names, but another Mesh (of
 * the quad) is stored as a child.
 *
 * Normally this is fine, since all children are recursively removed by react-three-fiber,
 * but unfortunatley, RectAreaLightHelper's dispose function spefically calls:
 *    this.children[0].geometry.dispose()
 *    this.children[0].material.dispose()
 * refering to the quad mesh as `this.children[0]`. By the time RectAreaLightHelper's
 * dispose function is called, react-three-fiber has already recursively removed the
 * children, hence this.childern is an empty array, resulting in an array reference crash.
 *
 * For other light helpers, the geometry and material are not stored in the children
 * property of the helper, but just in the named variables such as
 *    PointLight: `geometry`, `material`,
 *    SpotLight: `cone.geometry`, `cone.material`,
 *    DirectionalLight:   `lightPlane.geometry`, `lightPlane.material`,
 *                        `targetLine.geometry`, `targetLine.material`,
 * and those helpers' dispose function does not reference any children.
 *
 * Therefore, THREE.RectAreaLightHelper / rectAreaLightHelper cannot safely re-render
 * through react-three-fiber's reconciler.
 *
 * This is the custom RectAreaLightHelper.
 */
function RectAreaLightHelper({
  position,
  target,
  width,
  height,
  helperColor
}): React.ClassicElement<RectAreaLightHelperProps> {
  const dist = useMemo(
    function updateDist() {
      const posVec = new THREE.Vector3(...position);
      const targetVec = new THREE.Vector3(...target);
      return posVec.distanceTo(targetVec);
    },
    [position, target]
  );

  return (
    <>
      <Plane
        scale={[width, height, 1]}
        color={helperColor}
        side={THREE.FrontSide}
        wireframe
      />
      <Plane
        scale={[width, height, 1]}
        color={helperColor}
        side={THREE.BackSide}
      />
      <Cylinder
        start={[0, 0, 0]}
        end={[0, 0, -dist]}
        radius={0.02}
        color={helperColor}
      />
    </>
  );
}

RectAreaLightHelper.propTypes = exact({
  position: propTypeNumberArrayOfLength(3),
  target: propTypeNumberArrayOfLength(3),
  width: PropTypes.number,
  height: PropTypes.number,
  helperColor: PropTypes.string
});

interface RectAreaLightProps {
  position?: Array<number>;
  intensity?: number;
  color?: string;
  target?: Array<number>;
  width?: number;
  height?: number;
  helper?: boolean;
  helperColor?: string;
}

/**
 * RectAreaLight
 */
const RectAreaLight: React.FunctionComponent<
  RectAreaLightProps
> = function RectAreaLight({
  position = [0, 10, 0],
  target = [0, 0, 0],
  color = "white",
  intensity = 1,
  width = 1,
  height = 1,
  helper = false,
  helperColor,
  ...otherProps
}) {
  const _helperColor = useMemo(
    function updateHelperColor() {
      return helperColor || color;
    },
    [helperColor, color]
  );

  const { _width, _height } = useMemo(
    function updateDimensions() {
      return { _width: Math.max(width, EPS), _height: Math.max(height, EPS) };
    },
    [width, height]
  );

  const light = useMemo(function createLight() {
    return new THREE.RectAreaLight(color, intensity, _width, _height);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const helperProps = useMemo(
    function updateHelperProps() {
      return {
        position,
        target,
        width: _width,
        height: _height,
        helperColor: _helperColor
      };
    },
    [position, target, _width, _height, _helperColor]
  );

  useEffect(
    function updateColor() {
      light.color.set(color);
    },
    [light, color]
  );

  useEffect(
    function updateIntensity() {
      light.intensity = intensity;
    },
    [light, intensity]
  );

  useEffect(
    function updateDimensions() {
      light.width = _width;
      light.height = _height;
    },
    [light, _width, _height]
  );

  useEffect(
    function updatePosition() {
      // @ts-ignore:TS2556 // sphread
      light.position.set(...position);
    },
    [light, position]
  );

  useEffect(
    function updateTarget() {
      // @ts-ignore:TS2556 spread
      light.lookAt(...target);
    },
    [light, target]
  );

  return (
    // @ts-ignore:2339 property primitive does not exist
    <primitive object={light} {...otherProps}>
      {helper && <RectAreaLightHelper {...helperProps} />}
      {/*
    // @ts-ignore:2339 property primitive does not exist */}
    </primitive>
  );
};

// -----  PropTypes   ----- //
RectAreaLight.propTypes = exact({
  position: propTypeNumberArrayOfLength(3),
  target: propTypeNumberArrayOfLength(3),
  color: PropTypes.string,
  intensity: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  helper: PropTypes.bool,
  helperColor: PropTypes.string
});

const RectAreaLightMemo = memo(RectAreaLight);
RectAreaLightMemo.displayName = "RectAreaLight";
export default RectAreaLightMemo;
