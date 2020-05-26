// LineSegment.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import { EPS } from "../utils/math";
import { DEFAULT_COLOR } from "../utils/styles";
import { propTypeNumberArrayOfLength } from "../utils/util";

const { useState, useEffect, useMemo, memo } = React;
export interface LineProps {
  start?: Array<number>;
  end?: Array<number>;
  points?: Array<Array<number>>;
  color?: string | THREE.Color;
  hoverColor?: string;
  hoverable?: boolean;
  opacity?: number;
  transparent?: boolean;
  groupMember?: boolean;
  castShadow?: boolean;
  geometry?: THREE.Geometry;
  material?: THREE.Material;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  children?: any;
}

/**
 * Line
 *
 * Unlike most 3D objects that are meshes underneath, Line is another
 * type of object. Line is a wrapper component of
 * react-three-fiber/three.js's Line.
 *
 * In Standard View, Lines may be defined with a start and end position.
 * A line may also have more than just the end points. If an array of
 * points are provided, the start and end points are ignored and the line
 * is createed as an ordered path from the first point to the last.
 *
 * If no geometry nor material is passed in, default geometry and
 * lineBasicMaterial will be generated based on the properties provided.
 *
 * @param {LineProps} props
 */
const Line: React.FunctionComponent<LineProps> = function Line({
  start = [0, 0, 0],
  end = [1, 0, 0],
  points = [],
  color = DEFAULT_COLOR,
  hoverColor,
  hoverable = true,
  transparent,
  opacity = 1,
  castShadow = false,
  geometry,
  material,
  children,
  ...otherProps
}) {
  // Color
  const [_color, setColor] = useState(color);
  useEffect(
    function updateColor() {
      setColor(color);
    },
    [color]
  );

  // Vertices
  const vertices = useMemo(
    function updateVertices() {
      const v = [];
      if (points == null || points.length === 0) {
        // @ts-ignore:2345 // spread
        v.push(new THREE.Vector3(...start));
        // @ts-ignore:2345 // spread
        v.push(new THREE.Vector3(...end));
      } else {
        // @ts-ignore:2345 // spread
        points.map(point => v.push(new THREE.Vector3(...point)));
      }

      return v;
    },
    [start, end, points]
  );

  // Geometry Component
  const GeometryComponent = memo(function GeometryComponent() {
    if (geometry) {
      // @ts-ignore:2339 property primitive does not exist
      return <primitive object={geometry} />;
    }

    return <geometry attach="geometry" vertices={vertices} />;
  });
  GeometryComponent.displayName = "GeometryComponent";

  // Material Props
  const materialProps = useMemo(
    function updateMaterialProps() {
      return {
        material,
        color: _color,
        transparent: transparent != null ? transparent : opacity < 1 - EPS,
        opacity
      };
    },
    [material, _color, transparent, opacity]
  );

  return (
    // @ts-ignore:TS2322 line type clash
    <line
      onPointerOver={function setHover(): void {
        if (hoverable && hoverColor != null) {
          setColor(hoverColor);
        }
      }}
      onPointerOut={function unsetHover(): void {
        if (hoverable && hoverColor != null) {
          setColor(color);
        }
      }}
      castShadow={castShadow}
      {...otherProps}
    >
      <GeometryComponent />
      <MaterialComponent {...materialProps} />
      {children}
    </line>
  );
};

// -----  PropTypes   ----- //
/* eslint-disable react/forbid-prop-types */
Line.propTypes = exact({
  start: propTypeNumberArrayOfLength(3),
  end: propTypeNumberArrayOfLength(3),
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  color: PropTypes.string,
  hoverColor: PropTypes.string,
  hoverable: PropTypes.bool,
  opacity: PropTypes.number,
  transparent: PropTypes.bool,
  groupMember: PropTypes.bool,
  castShadow: PropTypes.bool,
  geometry: PropTypes.object, // THREE.Geometry
  material: PropTypes.object, // THREE.Material
  children: PropTypes.any
});
/* eslint-enable react/forbid-prop-types */
/* eslint-disable react/forbid-foreign-prop-types */
export const LinePropTypes = Line.propTypes;
/* eslint-enable react/forbid-foreign-prop-types */

const LineMemo = memo(Line);
LineMemo.displayName = "Line";
export default LineMemo;

type MaterialComponentProps = {
  material?: THREE.Material;
  color: string | THREE.Color;
  transparent: boolean;
  opacity: number;
};

const MaterialComponent = memo(function MaterialComponent({
  material,
  color,
  transparent,
  opacity
}: MaterialComponentProps) {
  if (material) {
    // @ts-ignore:2339 property primitive does not exist
    return <primitive object={material} />;
  }

  return (
    <lineBasicMaterial
      attach="material"
      color={color}
      transparent={transparent}
      opacity={opacity}
    />
  );
});
MaterialComponent.displayName = "MaterialComponent";
