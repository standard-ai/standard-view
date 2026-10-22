/**
 * The material helper the loaders share: which props are picked, how they are
 * applied to a loaded model's materials, and the hover tint's save / restore.
 */
import * as THREE from 'three';
import {
  applyModelMaterialProps,
  pickModelMaterialProps,
  setModelHoverTint,
} from '../../src/utils/modelMaterials';

function model() {
  const root = new THREE.Group();
  const shared = new THREE.MeshStandardMaterial({ color: 'blue' });
  const a = new THREE.Mesh(new THREE.BoxGeometry(), shared);
  const b = new THREE.Mesh(new THREE.BoxGeometry(), shared);
  const multi = new THREE.Mesh(new THREE.BoxGeometry(), [
    new THREE.MeshBasicMaterial({ color: 'green' }),
    new THREE.MeshNormalMaterial(),
  ]);
  const points = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({ color: 'white', size: 1 })
  );
  const inner = new THREE.Group();
  inner.add(b, points);
  root.add(a, multi, inner);
  return { root, shared, multi, points };
}

describe('pickModelMaterialProps', () => {
  test('drops unset props, keeps false and 0, returns undefined when empty', () => {
    expect(
      pickModelMaterialProps({ color: undefined, side: null })
    ).toBeUndefined();
    expect(
      pickModelMaterialProps({
        color: 'red',
        wireframe: false,
        opacity: 0,
        transparent: undefined,
        foo: 'ignored',
      })
    ).toEqual({ color: 'red', wireframe: false, opacity: 0 });
  });
});

describe('applyModelMaterialProps', () => {
  test('applies to every material under the root, only where the prop exists', () => {
    const { root, shared, multi, points } = model();
    applyModelMaterialProps(root, {
      color: 'red',
      side: 'double',
      wireframe: true,
      opacity: 0.5,
      transparent: true,
      depthWrite: false,
    });

    expect(shared.color.getHex()).toBe(0xff0000);
    expect(shared.side).toBe(THREE.DoubleSide);
    expect(shared.wireframe).toBe(true);
    expect(shared.opacity).toBe(0.5);
    expect(shared.transparent).toBe(true);
    expect(shared.depthWrite).toBe(false);

    const [basic, normal] = multi.material;
    expect(basic.color.getHex()).toBe(0xff0000);
    expect(normal.side).toBe(THREE.DoubleSide);
    expect(normal.wireframe).toBe(true);
    expect(normal.color).toBeUndefined();

    expect(points.material.color.getHex()).toBe(0xff0000);
    expect(points.material.opacity).toBe(0.5);
    expect('wireframe' in points.material).toBe(false);
    expect(points.material.size).toBe(1);
  });

  test('does nothing without props', () => {
    const { root, shared } = model();
    applyModelMaterialProps(root, undefined);
    expect(shared.color.getHex()).toBe(0x0000ff);
  });
});

describe('setModelHoverTint', () => {
  test('tints every colored material once, keeps the original, and restores it', () => {
    const { root, shared, multi, points } = model();
    const [basic] = multi.material;

    setModelHoverTint(root, 'yellow');
    expect(shared.color.getHex()).toBe(0xffff00);
    expect(basic.color.getHex()).toBe(0xffff00);
    expect(points.material.color.getHex()).toBe(0xffff00);
    expect(shared.userData.standardViewBaseColor.getHex()).toBe(0x0000ff);

    // A second tint while hovered keeps the original, not the first tint.
    setModelHoverTint(root, 'magenta');
    expect(shared.color.getHex()).toBe(0xff00ff);
    expect(shared.userData.standardViewBaseColor.getHex()).toBe(0x0000ff);

    setModelHoverTint(root, null);
    expect(shared.color.getHex()).toBe(0x0000ff);
    expect(basic.color.getHex()).toBe(0x008000); // CSS green
    expect(points.material.color.getHex()).toBe(0xffffff);
    expect(shared.userData.standardViewBaseColor).toBeUndefined();

    // Restoring again is a no-op.
    setModelHoverTint(root, null);
    expect(shared.color.getHex()).toBe(0x0000ff);
  });
});
