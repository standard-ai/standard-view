// SetControls.tsx
import * as React from 'react';
import { PerspectiveCamera, OrthographicCamera } from '@react-three/drei';

const { useEffect, useState, useMemo, memo } = React;

interface SceneCameraProps {
  camera?: any;
  orthographic?: boolean;
}

/**
 * SceneCamera
 *
 * @param {SceneCameraProps} props
 */
const SceneCamera: React.FunctionComponent<SceneCameraProps> =
  function SceneCamera({ camera, orthographic }) {
    const useCustomCamera = useMemo(
      function updateUpdateDefaultCamera() {
        // No Camera Props
        if (camera == null) {
          return true;
        }

        if (camera.updateDefaultCamera != null) {
          return camera.updateDefaultCamera;
        } else if (
          // Fixed orthographic left, right, top, bottom
          orthographic &&
          (camera.left != null ||
            camera.right != null ||
            camera.top != null ||
            camera.bottom != null)
        ) {
          return false;
        } else if (!orthographic && camera.aspect != null) {
          // Fixed aspect
          return false;
        } else {
          return true;
        }
      },
      [camera, orthographic]
    );

    return (
      <>
        {useCustomCamera && orthographic ? (
          <>
            Orthographics
            <OrthographicCamera
              makeDefault
              position={camera.position}
              {...camera}
            />
          </>
        ) : (
          <>
            Perspective
            <PerspectiveCamera
              makeDefault
              position={camera.position}
              {...camera}
            />
          </>
        )}
      </>
    );
  };

const SceneCameraMemo = memo(SceneCamera);
SceneCameraMemo.displayName = 'SceneCamera';
export default SceneCameraMemo;
