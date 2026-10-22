# Changelog

# 2.0.6

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
