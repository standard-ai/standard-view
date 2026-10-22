# Changelog

# 2.1.1

- 🧹 `View3D`'s default `shadowType` is now `pcf`, and `pcfsoft` maps to the same PCF shadow map: three.js r182+ deprecates `PCFSoftShadowMap` (its `PCFShadowMap` is soft as well) and warned on every shadow pass, which every `View3D` re-render re-triggered

# 2.1.0

- 🐞 `View3D` applies changes to the camera's `fov`, `near`, `far`, `zoom` and orthographic bounds after mount: @react-three/fiber reads the `camera` prop only when it creates the camera, so until now only the position, target, up and roll could change later (`SetControls`)
- 💫 GLTF story: a `none` option for `gltfPath` so `gltfURL` can be a full URL, a `fitCamera` arg that frames the loaded model from its bounding sphere (so a model of any size is in view, such as the 7 cm ToyCar sample), and a directional light so a model is lit whatever its size

# 2.0.7

- 💫 `hoverColor` works on the loaders (`GLTF`, `OBJ`, `FBX`, `PCD`): the loaded model's materials are tinted while the pointer is over it and restored on pointer-out; `onPointerOver` and `onPointerOut` still fire
- 🐞 `color`, `wireframe`, `opacity`, `transparent`, `side`, `depthWrite` and `depthTest` now reach a loaded FBX model (they targeted a `.scene` the loader never returns), an OBJ loaded without an MTL, and a PCD point cloud; `false` and `0` values are applied, and `side` takes the same `front` / `back` / `double` names as `Mesh` (`src/utils/modelMaterials.ts`, with tests)
- 🧹 A loader no longer reloads its file on every parent re-render when a material prop is set: the material props are memoised on their values
- 🧹 `FBX` advances its animation mixer with the frame delta `useFrame` already passes instead of its own `THREE.Clock`, which three.js r183+ deprecates and warns about on every construction

# 2.0.6

- 🐞 FBX story: `sophia.fbx` rendered upside down with three.js 0.184, whose `FBXLoader` now rotates a Z-up file -90° about X on load; the story cancels that with +90° instead of adding its own -90°
- 💫 `onLoad` and `onError` on `GLTF`, `OBJ`, `FBX` and `PCD`: a failed load logs a console error naming the URL, draws nothing (the loading `Label` is removed)
- 🧹 A load that completes or fails after the URL changed or the component unmounted is ignored, so a slow earlier file never lands on top of a newer one
- 📖 Jest coverage of the failure path for `GLTF`, `OBJ` and `PCD` (`test/groups/loaders.test.js`)

# 2.0.5

- 🐞 `loadingLabel` now optional for all components

# 2.0.4

- 💫 Added `loadingLabel` for `FBX`, `GLTF`, `OBJ`, and `PCD`

# 2.0.3

- 🧹 Reverted Timer usage to Clock in `FBX.tsx`
- 🧹 Matched devDep with peerDep of three to prevent Timer bug from resurfacing

# 2.0.2

- 🧹 Fixed Timer bug in `FBX.tsx`
- 🧹 Fixed stale shadows bug

# 2.0.1

- 🎉 three.js 0.178.0 --> 0.184.0
  - 💫 Clock -> Timer in `FBX.tsx`
- 🧹 Added Peer Dependency @react-three/fiber
  - `Stats` in `util.tsx`
  - `Canvas, useThree` in `View3D.tsx`
- 🧹 Added Peer Dependency @react-three/drei
  - `PerspectiveCamera, OrthographicCamera` in `SceneCamera.tsx`
- 🧹 Updated build files to support types and properly import js files
- 🧹 Added vite and tsup build support

# 2.0.0

- 🎉 Added support for latest npm dependencies
  - 🧹 Removed webpack
  - 🧹 Fixed jest.config
  - 🧹 Fixed three.js dependencies
    - Fixed Camera
    - Fixed BufferGeometry
    - outputColorSpace --> outputEncoding
- 🧹 Fixed Broken Stories
  - 💫 Added gltf paths to three.js examples in GLTF Story
  - 💫 Converted Stories to TypeScript
  - 💫 Updated Light intensities
  - 💫 Updated Text Extrusion heights
  - 💫 Fixed Canvas size

# 1.0.6

- 🎉 Added support for legacy code paths

# 1.0.5

- 🎉 Added `FBX` which accepts the following props
  - `fbxPath`: string
  - `fbxURL`: string
  - `actionIndex`: number
  - all `Group` props
- 📖 Added `FBX` Story
- Fix [Issue #2](https://github.com/standard-ai/standard-view/issues/2)
- Fix bug in nested context story

# 1.0.2 - 1.0.4

- 🧹 Cleaned up readme and fix image links

# 1.0.0

- 🎊 Released this library as Open Source
