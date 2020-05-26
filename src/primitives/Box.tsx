// Box.tsx
import * as React from "react";
import * as THREE from "three";
import exact from "prop-types-exact";
import Mesh, { MeshProps, MeshPropTypes } from "./Mesh";

const { useMemo, memo } = React;

/* eslint-disable @typescript-eslint/no-empty-interface */
interface BoxProps extends MeshProps {}

/**
 * Box
 *
 * Nothing particularly special about boxes. All the properties of
 * Meshes can be applied and will be passed into the Box's Mesh.
 *
 * @param {BoxProps} props
 */
const Box: React.FunctionComponent<BoxProps> = function Box({
  children,
  ...otherProps
}) {
  // Box Buffer Geometry
  const geometry = useMemo(function initGeometry() {
    return new THREE.BoxBufferGeometry(1, 1, 1);
  }, []);

  return (
    <Mesh geometry={geometry} {...otherProps}>
      {children}
    </Mesh>
  );
};

// -----  PropTypes   ----- //
Box.propTypes = exact({
  ...MeshPropTypes
});

const BoxMemo = memo(Box);
BoxMemo.displayName = "Box";
export default BoxMemo;
