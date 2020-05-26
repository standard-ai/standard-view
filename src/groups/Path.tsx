// Path.tsx
import * as React from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Group, { GroupProps, GroupPropTypes, generateGroupProps } from "./Group";
import { Sphere, Cylinder, Text } from "../primitives";
import { areArraysEqual, propTypeNumberArrayOfLength } from "../utils/util";

const { useRef, useMemo, memo } = React;

interface PathProps extends GroupProps {
  points?: Array<Array<number>>;
  frames?: Array<number>;
  thickness?: number;
  lineThickness?: number;
  pointRadius?: number;
  pointColor?: string;
  lineColor?: string;
  frame?: number;
  point?: Array<number>;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  lineProps?: any;
  pointProps?: any;
  textProps?: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  enumerate?: boolean;
}

/**
 * Path
 *
 * In Standard View, Path is a Group comprised of Spheres and Cylinders which
 * update based on the array of points prop. Path will keep a hashset of
 * frames and append a new point if frame and point props are both new and
 * the frame number is greater than the last given frame. The new point will
 * have a Cylinder connecting from the last given point in chronological by
 * frame order, thus creating a chronological 3D path.
 */
const Path: React.FunctionComponent<PathProps> = function Path({
  points,
  frames,
  thickness = 0.1,
  lineThickness,
  pointRadius,
  pointColor,
  lineColor,
  frame,
  point,
  enumerate = false,
  ...otherProps
}) {
  const { cleanedProps, groupProps } = generateGroupProps(otherProps);
  const {
    color,
    hoverColor,
    lineProps,
    pointProps,
    textProps,
    children,
    ...otherCleanedProps
  } = cleanedProps;
  const _points: React.MutableRefObject<Array<Array<number>>> = useRef([]);

  useMemo(
    function updatePoints() {
      // Add point
      if (!points) {
        // No point or frame
        if (!point || !frame) {
          return;
        }

        // Only add points for frames that do not already have a point
        if (!_points.current[frame]) {
          _points.current[frame] = point;
        }

        return;
      }

      const _frames = frames || Array.from(Array(points.length).keys());
      // Validate Arrays
      if (
        !Array.isArray(points) ||
        !Array.isArray(_frames) ||
        points.length !== _frames.length
      ) {
        console.warn(
          `[Path] number of elements in frames must match number of elements in points. points.length (${points &&
            points.length}) =/= frames.length (${_frames && _frames.length})`
        );
        return;
      }

      // Load _points
      if (points.length <= _points.current.length) {
        _points.current = _points.current.slice(0, points.length);
      }

      /* eslint-disable-next-line no-shadow */
      _frames.map((frame, index) => {
        // frames number check
        if (Number.isNaN(frame)) {
          console.warn(
            `[Path] frames must be Array<number>. frame[${index}] = ${frame}`
          );
          return null;
        }

        // points array check
        if (!Array.isArray(points[index]) || points[index].length !== 3) {
          console.warn(
            `[Path] points must be Array<Array<number>> where each point has 3 number elements. points[${index}] = ${points[index]}`
          );
        }

        // diff check
        const prevPoint = _points.current[frame];
        const newPoint = points[index];
        if (!areArraysEqual(prevPoint, newPoint)) {
          _points.current[frame] = newPoint;
        }

        return null;
      });
    },
    [points, frames, point, frame]
  );

  const _pointRadius = useMemo(
    function updatePointRadius() {
      return pointRadius || thickness;
    },
    [pointRadius, thickness]
  );

  const _pointProps = useMemo(
    function updatePointProps() {
      return pointProps != null ? pointProps : otherCleanedProps;
    },
    [pointProps, otherCleanedProps]
  );

  const _lineProps = useMemo(
    function updateLineProps() {
      return lineProps != null ? lineProps : otherCleanedProps;
    },
    [lineProps, otherCleanedProps]
  );

  return (
    <Group color={color} hoverColor={hoverColor} {...groupProps}>
      {_points.current
        .filter(p => !!p)
        /* eslint-disable-next-line no-shadow */
        .map((point, index) => {
          return (
            /* eslint-disable react/no-array-index-key */
            <Sphere
              key={`Sphere${index}`}
              track={false}
              position={point}
              radius={_pointRadius}
              color={pointColor}
              {..._pointProps}
            >
              {enumerate && (
                <Text
                  text={`${index}`}
                  align="bottom"
                  position={[0, 1.2, 0]}
                  color="white"
                  {...textProps}
                />
              )}
            </Sphere>
            /* eslint-enable react/no-array-index-key */
          );
        })}
      {_points.current
        .filter(p => !!p)
        /* eslint-disable-next-line no-shadow */
        .map((point, index, points) => {
          // No Cylinder for first point
          if (points.length <= 1) {
            return null;
          }

          // No invalid points nor collapsed
          const prevPoint = points[index - 1];
          if (
            !Array.isArray(point) ||
            point.length !== 3 ||
            !Array.isArray(prevPoint) ||
            prevPoint.length !== 3 ||
            areArraysEqual(point, prevPoint)
          ) {
            return null;
          }

          return (
            /* eslint-disable react/no-array-index-key */
            <Cylinder
              key={`Cylinder${index}`}
              track={false}
              start={points[index - 1]}
              end={point}
              radius={lineThickness || thickness}
              color={lineColor}
              {..._lineProps}
            />
            /* eslint-enable react/no-array-index-key */
          );
        })}
      {children}
    </Group>
  );
};

// -----  PropTypes   ----- //
/* eslint-disable react/forbid-prop-types */
Path.propTypes = exact({
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  frames: PropTypes.arrayOf(PropTypes.number),
  thickness: PropTypes.number,
  lineThickness: PropTypes.number,
  pointRadius: PropTypes.number,
  pointColor: PropTypes.string,
  lineColor: PropTypes.string,
  frame: PropTypes.number,
  point: propTypeNumberArrayOfLength(3),
  lineProps: PropTypes.any,
  pointProps: PropTypes.any,
  textProps: PropTypes.any,
  enumerate: PropTypes.bool,
  ...GroupPropTypes
});
/* eslint-enable react/forbid-prop-types */

const PathMemo = memo(Path);
PathMemo.displayName = "Path";
export default PathMemo;
