// Plane.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Mesh, { MeshProps, MeshPropTypes } from "./Mesh";
import { billboard as billboardAnimation } from "../utils/util";

const { useMemo, memo } = React;

interface PlaneProps extends MeshProps {
  billboard?: boolean;
}

/**
 * Plane
 *
 * In Standard View, the Plane mesh is rotated to match the normal
 * property if provided. This allows for easier create of Planes.
 * All other properties are pass along to the Plane's Mesh.
 *
 * @param {PlaneProps} props
 */
const Plane: React.FunctionComponent<PlaneProps> = function Plane({
  side = "double",
  billboard,
  children,
  ...otherProps
}) {
  // Plane Buffer Geometry
  const geometry = useMemo(function initGeometry() {
    return new THREE.PlaneBufferGeometry(1, 1, 1);
  }, []);

  return (
    <Mesh
      side={side}
      geometry={geometry}
      animation={billboard ? billboardAnimation : undefined}
      {...otherProps}
    >
      {children}
    </Mesh>
  );
};

// -----  PropTypes   ----- //
Plane.propTypes = exact({
  billboard: PropTypes.bool,
  ...MeshPropTypes
});

const PlaneMemo = memo(Plane);
PlaneMemo.displayName = "Plane";
export default PlaneMemo;
