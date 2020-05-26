// Label.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Plane from "./Plane";
import { MeshProps, MeshPropTypes } from "./Mesh";
import { nextPowerOfTwo, EPS } from "../utils/math";
import {
  getAlignmentOffset,
  billboard as billboardAnimation
} from "../utils/util";

const { useRef, useEffect, useMemo, memo } = React;

interface LabelProps extends MeshProps {
  text?: string;
  fontName?: string;
  fontStyle?: string;
  backgroundColor?: string;
  noBackground?: boolean;
  borderColor?: string;
  borderThickness?: number; // pixels
  noBorder?: boolean;
  textColor?: string;
  resolution?: number;
  align?: string;
  billboard?: boolean;
}

/**
 * Label
 *
 * Label is composed within a Plane. The text is drawn on a canvas element
 * which is then converted to a texture for a plane. Unlike Text, the
 * geometric complexity of Label does not increase with the number of
 * letters in the text, since there is always just a plane segment rendered.
 * There is a slight overhead for creating the canvas and applying it as
 * a texture. Label may accept any HTML canvas fontName and fontStyle.
 * The resolution of the texture may also be controlled. Keep in mind that
 * higher resolution does look crisp even at high zooms, but requires more memory
 * for storing the texture.
 *
 * The Label's position may be aligned to a specific anchor point of the label
 * with the align prop. The anchor point of the label is what the position refers to.
 *
 * The ◼'s represent the anchor points.
 *
 *    ◼----◼----◼
 *    |         |
 *    ◼    ◼    ◼
 *    |         |
 *    ◼----◼----◼
 *
 * @param {LabelProps} props
 */
const Label: React.FunctionComponent<LabelProps> = function Label({
  text = "Label",
  fontName = "san-serif",
  fontStyle = "",
  color = "white",
  backgroundColor = "black",
  noBackground = false,
  borderColor = "white",
  borderThickness = 10,
  noBorder = false,
  transparent,
  opacity = 1,
  textColor = "white",
  anisotropy = 16,
  resolution = 32,
  align = "center",
  billboard = false,
  children,
  ...otherProps
}) {
  let _transparent = transparent != null ? transparent : opacity < 1 - EPS;
  _transparent = noBackground ? true : _transparent;

  // Font
  const font = useMemo(
    function updateFont() {
      return `${fontStyle} ${resolution}px ${fontName}`;
    },
    [fontStyle, resolution, fontName]
  );

  const [texture, aspect] = useMemo(
    function updateTexture() {
      // Init Canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        /* eslint-disable-next-line no-console */
        console.warn('[Label] Failed to getContext("2d") of canvas');
        return [undefined, 1];
      }
      canvas.width = 2;
      canvas.height = 2;

      // Label Width
      ctx.font = font;
      const textWidth = ctx.measureText(text).width;
      const width = nextPowerOfTwo(textWidth);
      const height = nextPowerOfTwo(resolution) * 2;
      const asp = width / height;

      // Resize Canvas to Fit Label
      canvas.width = width;
      canvas.height = height;
      ctx.font = font; // Reset font

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Background
      if (!noBackground) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      // Border
      if (!noBorder) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderThickness;
        ctx.strokeRect(0, 0, width, height);
      }

      // Fill Text
      ctx.fillStyle = textColor;
      ctx.fillText(text, (width - textWidth) / 2, height * 0.666);

      // Label Texture
      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = anisotropy;

      return [tex, asp];
    },
    [
      text,
      resolution,
      font,
      backgroundColor,
      noBackground,
      borderColor,
      borderThickness,
      noBorder,
      textColor,
      anisotropy
    ]
  );

  // Label Geometry
  const labelGeometry = useRef(new THREE.PlaneBufferGeometry());

  // Align
  const prevAspect = useRef(1);
  const prevAlign = useRef(Label.defaultProps.align);
  useEffect(
    function updateAlign() {
      // Align
      const diagonal = [prevAspect.current, 1, 1];
      const alignmentOffset = getAlignmentOffset(
        prevAlign.current,
        align,
        diagonal
      );
      // @ts-ignore:TS2556 // spread
      labelGeometry.current.translate(...alignmentOffset);
      prevAlign.current = align;
    },
    [labelGeometry, align]
  );

  // Aspect
  useEffect(
    function updateScale() {
      // Scale Plane to Label Text Width (textwidth x 1 x 1)
      // Reset
      labelGeometry.current.scale(1 / prevAspect.current, 1, 1);
      // Aspect
      labelGeometry.current.scale(aspect, 1, 1);
      prevAspect.current = aspect;
    },
    [labelGeometry, aspect]
  );

  return (
    <Plane
      map={texture}
      transparent={_transparent}
      opacity={opacity}
      color={color}
      geometry={labelGeometry.current}
      animation={billboard ? billboardAnimation : undefined}
      {...otherProps}
    >
      {children}
    </Plane>
  );
};

// -----  Default Props   ----- //
Label.defaultProps = {
  align: "center"
};

// -----  PropTypes   ----- //
Label.propTypes = exact({
  text: PropTypes.string,
  fontName: PropTypes.string,
  fontStyle: PropTypes.string,
  backgroundColor: PropTypes.string,
  noBackground: PropTypes.bool,
  borderColor: PropTypes.string,
  borderThickness: PropTypes.number,
  noBorder: PropTypes.bool,
  textColor: PropTypes.string,
  resolution: PropTypes.number,
  align: PropTypes.string,
  billboard: PropTypes.bool,
  ...MeshPropTypes
});

const LabelMemo = memo(Label);
LabelMemo.displayName = "Label";
export default LabelMemo;
