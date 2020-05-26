// PCD.tsx
import * as React from "react";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Label from "../primitives/Label";
import Group, { GroupProps, GroupPropTypes } from "./Group";

const { useRef, useEffect, useMemo, memo } = React;

function loadPCD(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  group: React.MutableRefObject<any>,
  pcdPath: string,
  pcdURL: string,
  pointSize: number
): void {
  // No PCD
  if (pcdURL == null) {
    /* eslint-disable-next-line no-console */
    console.warn("[PCD] No pcdURL");
  }

  // PCD
  const pcdLoader = new PCDLoader();
  pcdLoader.setPath(pcdPath);
  pcdLoader.load(pcdURL, pcd => {
    if (group.current) {
      // Remove Loading Label or Previous PCD
      if (group.current.children) {
        group.current.children.map(child => group.current.remove(child));
      }

      // Material Props
      if (pcd.material) {
        /* eslint-disable no-param-reassign */
        // @ts-ignore:TS2339 size does not exist
        pcd.material.size = pointSize;
        /* eslint-enable no-param-reassign */
      }

      // Add PCD
      group.current.add(pcd);
    }
  });
}

interface PCDProps extends GroupProps {
  pcdPath: string;
  pcdURL: string;
  pointSize: number;
}

const PCD: React.FunctionComponent<PCDProps> = function PCD({
  pcdPath = "",
  pcdURL,
  pointSize = 0.01,
  ...otherProps
}) {
  const group = useRef();

  const loadingText = useMemo(
    function updateLoadText() {
      return pcdURL || "No pcdURL";
    },
    [pcdURL]
  );

  // Load PCD
  useEffect(
    function updatePCD() {
      if (group) {
        loadPCD(group, pcdPath, pcdURL, pointSize);
      }
    },
    [group, pcdPath, pcdURL, pointSize]
  );

  return (
    <Group ref={group} {...otherProps}>
      <Label text={loadingText} textColor="red" />
    </Group>
  );
};

PCD.propTypes = exact({
  pcdPath: PropTypes.string,
  pcdURL: PropTypes.string,
  pointSize: PropTypes.number,
  ...GroupPropTypes
});

const PCDMemo = memo(PCD);
PCDMemo.displayName = "PCD";
export default PCDMemo;
