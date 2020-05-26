// Sphere.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Mesh, { MeshPropTypes, MeshProps } from "./Mesh";
import { EPS } from "../utils/math";
import { performanceStart, performanceEnd } from "../utils/performance";

const { useMemo, memo, forwardRef } = React;

interface SphereProps extends MeshProps {
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
  phiStart?: number;
  phiLength?: number;
  thetaStart?: number;
  thetaLength?: number;
  scale?: Array<number>;
}

/**
 * Sphere
 *
 * In Standard View, the radius property of Sphere is used to scale the
 * Mesh appropriately. The actual geometry is constructed with unit radius.
 * The number of widthSegments and heightSegments, however may be specified
 * to determine how smooth the sphere looks. More segments will incur
 * renderring more triangles.
 *
 * @param {SphereProps} props
 */
const Sphere: React.FunctionComponent<SphereProps> = forwardRef<
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  React.Ref<any>,
  SphereProps
>(function Sphere(
  {
    radius = 1,
    widthSegments = 32,
    heightSegments = 32,
    phiStart = 0,
    phiLength = Math.PI * 2,
    thetaStart = 0,
    thetaLength = Math.PI,
    scale,
    children,
    ...otherProps
  },
  ref
) {
  performanceStart("Sphere");

  // Radius
  const _scale = useMemo(
    function updateScale() {
      const r = Math.max(radius, EPS);

      // Zero Radius Warning
      if (r === EPS) {
        /* eslint-disable-next-line no-console */
        console.warn(`[Sphere] Zero radius!`);
      }

      return scale || [r, r, r];
    },
    [scale, radius]
  );

  // Sphere Arguments
  const sphereArgs = useMemo(
    function updateSphereArgs() {
      return [
        1,
        widthSegments,
        heightSegments,
        phiStart,
        phiLength,
        thetaStart,
        thetaLength
      ];
    },
    [
      widthSegments,
      heightSegments,
      phiStart,
      phiLength,
      thetaStart,
      thetaLength
    ]
  );

  // Sphere Buffer Geometry
  const geometry = useMemo(
    function initGeometry() {
      return new THREE.SphereBufferGeometry(...sphereArgs);
    },
    [sphereArgs]
  );

  performanceEnd("Sphere");
  return (
    <>
      {performanceStart("Around Mesh")}
      <Mesh ref={ref} scale={_scale} geometry={geometry} {...otherProps}>
        {children}
      </Mesh>
      {performanceEnd("Around Mesh")}
    </>
  );
});

// -----  PropTypes   ----- //
Sphere.propTypes = exact({
  radius: PropTypes.number,
  widthSegments: PropTypes.number,
  heightSegments: PropTypes.number,
  phiStart: PropTypes.number,
  phiLength: PropTypes.number,
  thetaStart: PropTypes.number,
  thetaLength: PropTypes.number,
  ...MeshPropTypes
});

const SphereMemo = memo(Sphere);
SphereMemo.displayName = "Sphere";
export default SphereMemo;
