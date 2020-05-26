# Standard View

# Usage

Install

```
$ npm install @standard/view
```

Place Views into your React App. For example:

```
import { View3D, Box } from '@standard/view';
.
.
.
<View3D>
  <Box position={[1, 0, 0]} color="green" />
  <Box position={[-1, 0, 0]} color="red" />
</View3D>
```

<img src="https://github.com/standard-ai/standard-view/blob/master/example-gifs/example.png?raw=true" width="250" height="200" />

For details about valid properties, look at the interfaces named `*Props`, where `*` is the component name, in `src/primitves/` and `src/groups/`.

## Stories

`yarn storybook` to see stories of each component in `standard-view`.
You may also visit [Standard View Storybook](https://standard-view.netlify.app/?path=/story) served with netlify.

### Examples

<p align="center">
<img src="https://github.com/standard-ai/standard-view/blob/master/example-gifs/sample-platter.gif?raw=true" width="800" height="400" />
<img src="https://github.com/standard-ai/standard-view/blob/master/example-gifs/standard-cube.gif?raw=true" width="400" height="400" />
</p>

## create-react-app to Standard View Project

<p align="center">
<img src="https://github.com/standard-ai/standard-view/blob/master/example-gifs/create-app-to-standard-view.gif?raw=true" />
</p>

## Fit to Window

<p align="center">
<img src="https://github.com/standard-ai/standard-view/blob/master/example-gifs/canvas-css.gif?raw=true" />
</p>

Set `.App canvas` in css file to adjust Standard View `View3D` canvas.

## Intellisense

<p align="center">
<img src="https://github.com/standard-ai/standard-view/blob/master/example-gifs/intellisense.gif?raw=true" />
</p>

For VSCode, press `ctrl + space` to force load intellisense at cursor location.

## Standard View Components

Primitives

- `Mesh`
- `Box`
- `Camera`
- `Circle`
- `Cylinder`
- `Plane`
- `Polygon`
- `Quad`
- `Sphere`
- `Triangle`

Groups

- `Group`
- `Arrow`
- `Axis`
- `Capsule`
- `GLTF`
- `OBJ`
- `PCD`

Lines

- `Line`
- `BoundingBox` (Group)

Texts

- `Text` (Mesh)
- `Label` (Mesh)

Lights

- `AmbientLight`
- `DirectionalLight`
- `HemisphereLight`
- `PointLight`
- `SpotLight`

Views

- `View3D`

## Mesh

All Standard View primitives are composed within `Mesh`,
with the exception of `Line`, `BoundingBox`, `Text`, and `Group`.
Therefore, properties of `Mesh` are common to nearly alll components.
Here is a list of explicitly managed `Mesh` properties in Standard View:

Mesh Properties

- position: Array\<number\>
- scale: Array\<number\>
- rotation: Array\<number\>
- quaternion: Array\<number\>

Material Properties

- color: string
- hoverColor: string
- opacity: number
- texturePath: string
- textureURL: string
- material: THREE.Material

Geometry Properties

- wireframe: boolean
- side: number
- geometry: THREE.Geometry

Animation Properties

- animation: Function
- state: Object

Event Properties

- onClick: Function
- onDoubleClick: Function
- onWheel: Function
- onPointerUp: Function
- onPointerDown: Function
- onPointerOver: Function
- onPointerOut: Function
- onPointerMove: Function

`Mesh` can also support animations via the animation property. A function with one argument that may be destructured to include `state`, `setState`, `mesh`, and any Canvas properties desired for the animation.
All primitives and shapes may have animation. These animations are reactive, so they incur many render calls, but also maintain `react-three-renderer`'s native raycasting for the event property functions.

`Mesh` also exposes `react-three-fiber`'s the event property functions but with a constrained argument set, similar to animation. All event property functions take one arguement that may be destructured to include `mesh`, `state`, `setState`, and any Canvas prop. The benefit of this design, just like animations, is that a reference to `mesh` is automatically provided. Moreover, `react-three-fiber`'s `Canvas` state properties are exposed. This allows event functions to reach right into the `react-three-fiber`/`three.js`'s `scene`, `camera`, `gl`, etc. Hence all shapes that are `Mesh`s may have these event property functions.

Of course, `Mesh` can accept properties handled by `react-three-fiber`/`three.js` as well.
After explicitly managing these properties, remaining properties are passed to `react-three-fiber`'s `mesh`.
(`Mesh` is a wrapper of `react-three-fiber`'s `mesh`, which is a wrapper of `THREE.Mesh`.)

## View3D

Here is a list of explicitly managed `View3D` properties in Standard View:

WebGLRenderer Properties

- background: string

Camera Control Properties

- trackballControls: boolean
- orbitControls: boolean
- mapControls: boolean

Of course, `View3D` can accept `Canvas` properties handled by `react-three-fiber` as well. The Standard View properties are handled and stripped away before passing the properties to `Canvas`.
(`View3D` is a wrapper of `react-three-fiber`'s `Canvas`.)

## Text

`Text` in Standard View is composed within a `Mesh`. So `Text` may accept all the same properties as a `Mesh`. `Text` also should have a `text` property with the desired string to be displayed and also a `font` or `fontName`. `font`s are typeface.json fonts and must be a `THREE.Font`. The default `three.js` fonts are also included in Standard View, so simply passing `fontName` with one of those fonts will work.

Fonts

- helvetiker
- helvetikerBold
- optimer
- optimerBold
- gentilis
- gentilisBold

In general `Text` will be much more computation expensive to render compared to `Label` which is just a `Plane` with a texture of the desired text.

## react-three-fiber

Checkout [`react-three-fiber`'s page](https://github.com/drcmda/react-three-fiber) for more details.
