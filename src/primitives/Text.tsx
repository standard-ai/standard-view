// Text.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Mesh, { MeshProps, MeshPropTypes } from "./Mesh";
import {
  getAlignmentOffset,
  billboard as billboardAnimation
} from "../utils/util";
import { useToggle } from "../utils/hooks";

const { useRef, useEffect, useMemo, memo } = React;

// Available Fonts
const FONT_SOURCE =
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/";
const FONTS = {
  helvetiker: {
    name: "helvetiker_regular",
    typeface: null,
    threeFont: null
  },
  helvetikerBold: {
    name: "helvetiker_bold",
    typeface: null,
    threeFont: null
  },
  optimer: { name: "optimer_regular", typeface: null, threeFont: null },
  optimerBold: { name: "optimer_bold", typeface: null, threeFont: null },
  gentilis: { name: "gentilis_regular", typeface: null, threeFont: null },
  gentilisBold: { name: "gentilis_bold", typeface: null, threeFont: null }
};

interface GetFontProps {
  url: string;
  cacheFont: Function;
  loadFont: Function;
}
/**
 * getFont
 * Async Font File Fetcher
 * Font is cached and Text component is reloaded after font is acquired.
 */
async function getFont({
  url,
  cacheFont,
  loadFont
}: GetFontProps): Promise<void> {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      cacheFont(data);
      loadFont();
    })
    .catch(() => console.warn(`[Text] Font not found from path: ${url}`));
}

interface TextProps extends MeshProps {
  text?: string;
  fontName?: string;
  fontFile?: string;
  size?: number;
  height?: number;
  align?: string;
  curveSegments?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelOffset?: number;
  bevelSegments?: number;
  billboard?: boolean;
}

/**
 * Text
 *
 * Text is also composed within a Mesh. The 3D text is actually a set
 * of extrusions handled by react-three-fiber/three.js's textGeometry.
 * Materials are defaulted to meshBasicMaterials and accept the same
 * properties.
 *
 * Standard View supports loading the default fonts provided in three.js's examples,
 * helvetiker, optimer, and gentilis, as well as their bold version.
 * Passing a string fontName property will automatically load that font.
 * The loading is asynchronous as the font files are fetched from three's git repo.
 *
 * Other typeface.json fonts may also be loaded either from public/assets
 * or from url with fontFile
 *
 * Size is in the same 3D units as for all 3D Objects.
 *
 * @param {TextProps} props
 */
const Text: React.FunctionComponent<TextProps> = function Text({
  text = "Text",
  fontName = "helvetiker",
  fontFile,
  size = 1,
  height = 0.01,
  align = "bottom-left",
  curveSegments = 12,
  bevelEnabled = false,
  bevelThickness = 10,
  bevelSize = 8,
  bevelOffset = 0,
  bevelSegments = 3,
  billboard = false,
  children,
  ...otherProps
}) {
  // Loaded Flag
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [_, loadFont] = useToggle(false);

  // Font Name or Font File
  const _fontName = useMemo(
    function updateFontName() {
      // Default Font Name
      let name = "helvetiker";

      if (fontFile) {
        // Font File
        name = fontFile;

        // File is not cached
        if (FONTS[name] == null) {
          FONTS[name] = { name, typeface: null, threeFont: null };
        }
      } else if (Object.keys(FONTS).includes(fontName)) {
        // Font Name
        name = fontName;
      }

      return name;
    },
    [fontName, fontFile]
  );

  // FONTS cache check
  const _loaded = FONTS[_fontName].typeface != null;

  // Async Load Font
  if (!_loaded) {
    const url =
      fontFile || `${FONT_SOURCE}${FONTS[_fontName].name}.typeface.json`;

    const cacheFont = (data): void => {
      FONTS[_fontName].typeface = data;
    };

    getFont({ url, cacheFont, loadFont });
  }

  // Font
  const font = useMemo(
    function updateFont() {
      // Font Not Yet Loaded
      if (!_loaded) {
        return undefined;
      }

      // Load threeFont from FONTS cache
      if (FONTS[_fontName].threeFont != null) {
        return FONTS[_fontName].threeFont;
      }

      // Generate and cache threeFont
      FONTS[_fontName].threeFont = new THREE.Font(FONTS[_fontName].typeface);
      return FONTS[_fontName].threeFont;
    },
    [_loaded, _fontName]
  );

  // Text Geometry
  const prevAlign = useRef(align);
  const textGeometry = useMemo(
    function updateTextGeometry() {
      // Font Not Yet Loaded
      if (!_loaded) {
        return undefined;
      }

      const fontParams = {
        font,
        size,
        height,
        curveSegments,
        bevelEnabled,
        bevelThickness,
        bevelSize,
        bevelOffset,
        bevelSegments
      };

      // TextBufferGeometry cannot be modified after instantiation
      // Must be recreated
      const geometry = new THREE.TextBufferGeometry(text, fontParams);
      geometry.computeBoundingBox();

      // Reset Alignment
      const boundingBox = geometry.boundingBox;
      const max = boundingBox ? boundingBox.max : new THREE.Vector3(0, 0, 0);
      const min = boundingBox ? boundingBox.min : new THREE.Vector3(0, 0, 0);
      const diagonalVec = max.clone().sub(min);
      const diagonal = [diagonalVec.x, diagonalVec.y, diagonalVec.z];

      const alignmentOffset = getAlignmentOffset(
        Text.defaultProps.align,
        prevAlign.current,
        diagonal
      );

      // @ts-ignore:TS2556 // spread
      geometry.translate(...alignmentOffset);

      return geometry;
    },
    [
      _loaded,
      text,
      font,
      size,
      height,
      curveSegments,
      bevelEnabled,
      bevelThickness,
      bevelSize,
      bevelOffset,
      bevelSegments
    ]
  );

  // Align
  useEffect(
    function updateAlignment() {
      // Font Not Yet Loaded
      if (!_loaded || textGeometry === undefined) {
        return;
      }

      const boundingBox = textGeometry.boundingBox;
      const max = boundingBox ? boundingBox.max : new THREE.Vector3(0, 0, 0);
      const min = boundingBox ? boundingBox.min : new THREE.Vector3(0, 0, 0);

      const diagonalVec = max.clone().sub(min);
      const diagonal = [diagonalVec.x, diagonalVec.y, diagonalVec.z];

      // Align
      const alignmentOffset = getAlignmentOffset(
        prevAlign.current,
        align,
        diagonal
      );
      // @ts-ignore:TS2556 // spread
      textGeometry.translate(...alignmentOffset);
      prevAlign.current = align;
    },

    [_loaded, textGeometry, align]
  );

  return (
    <Mesh
      visible={_loaded}
      geometry={textGeometry}
      animation={billboard ? billboardAnimation : undefined}
      {...otherProps}
    >
      {children}
    </Mesh>
  );
};

// -----  Default Props   ----- //
Text.defaultProps = {
  align: "bottom-left"
};

// -----  PropTypes   ----- //
Text.propTypes = exact({
  text: PropTypes.string,
  fontName: PropTypes.string,
  fontFile: PropTypes.string,
  size: PropTypes.number,
  height: PropTypes.number,
  align: PropTypes.string,
  curveSegments: PropTypes.number,
  bevelEnabled: PropTypes.bool,
  bevelThickness: PropTypes.number,
  bevelSize: PropTypes.number,
  bevelOffset: PropTypes.number,
  bevelSegments: PropTypes.number,
  billboard: PropTypes.bool,
  ...MeshPropTypes
});

const TextMemo = memo(Text);
TextMemo.displayName = "Text";
export default TextMemo;
