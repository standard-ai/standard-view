/**
 * Load-failure reporting for the model loaders.
 *
 * A failed load must never throw: it logs a console error naming the URL,
 * draws nothing, and fires onError exactly once. A load that completes or
 * fails after the component has unmounted touches nothing.
 *
 * The three.js example loaders are ESM-only and fetch over the network, so
 * they are mocked outright; FBX is not covered here because it calls fiber's
 * useFrame, which needs a Canvas that jsdom cannot provide.
 */
import * as React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import GLTF from '../../src/groups/GLTF';
import OBJ from '../../src/groups/OBJ';
import PCD from '../../src/groups/PCD';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const mockGLTFLoad = jest.fn();
const mockOBJLoad = jest.fn();
const mockPCDLoad = jest.fn();

jest.mock('three/examples/jsm/loaders/GLTFLoader.js', () => ({
  GLTFLoader: jest.fn().mockImplementation(() => ({
    setPath: jest.fn(),
    setDRACOLoader: jest.fn(),
    load: mockGLTFLoad,
  })),
}));
jest.mock('three/examples/jsm/loaders/DRACOLoader.js', () => ({
  DRACOLoader: jest
    .fn()
    .mockImplementation(() => ({ setDecoderPath: jest.fn() })),
}));
jest.mock('three/examples/jsm/loaders/OBJLoader.js', () => ({
  OBJLoader: jest.fn().mockImplementation(() => ({
    setPath: jest.fn(),
    setMaterials: jest.fn(),
    load: mockOBJLoad,
  })),
}));
jest.mock('three/examples/jsm/loaders/MTLLoader.js', () => ({
  MTLLoader: jest.fn().mockImplementation(() => ({
    setPath: jest.fn(),
    setResourcePath: jest.fn(),
    load: jest.fn(),
  })),
}));
jest.mock('three/examples/jsm/loaders/PCDLoader.js', () => ({
  PCDLoader: jest.fn().mockImplementation(() => ({
    setPath: jest.fn(),
    load: mockPCDLoad,
  })),
}));

function mount(element) {
  const container = document.createElement('div');
  const root = createRoot(container);
  act(() => {
    root.render(element);
  });
  return root;
}

function unmount(root) {
  act(() => {
    root.unmount();
  });
}

// React DOM also warns through console.error about the three.js-only props
// on the group element, so look for the loader's own line.
function loggedFailureNaming(spy, text) {
  return spy.mock.calls.some(
    call =>
      typeof call[0] === 'string' &&
      call[0].startsWith('[') &&
      call[0].includes(text)
  );
}

const failNow = failure => (url, onLoad, onProgress, onError) =>
  onError(failure);

describe('loader load failures', () => {
  let consoleError;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
    jest.clearAllMocks();
  });

  test.each([
    [
      'GLTF',
      GLTF,
      mockGLTFLoad,
      { gltfPath: 'models/', gltfURL: 'missing.glb' },
      'models/missing.glb',
    ],
    [
      'OBJ',
      OBJ,
      mockOBJLoad,
      { objPath: 'models/', objURL: 'missing.obj' },
      'models/missing.obj',
    ],
    [
      'PCD',
      PCD,
      mockPCDLoad,
      { pcdPath: 'clouds/', pcdURL: 'missing.pcd' },
      'clouds/missing.pcd',
    ],
  ])(
    '%s: a failed load logs the URL, reports once and never throws',
    (name, Loader, load, props, url) => {
      const failure = new Error('404 Not Found');
      load.mockImplementation(failNow(failure));
      const onError = jest.fn();
      const onLoad = jest.fn();

      let root;
      expect(() => {
        root = mount(
          React.createElement(Loader, {
            ...props,
            loadingLabel: false,
            onError,
            onLoad,
          })
        );
      }).not.toThrow();

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(failure);
      expect(onLoad).not.toHaveBeenCalled();
      expect(loggedFailureNaming(consoleError, url)).toBe(true);

      unmount(root);
    }
  );

  test.each([
    ['GLTF', GLTF, mockGLTFLoad, { gltfURL: 'slow.glb' }],
    ['OBJ', OBJ, mockOBJLoad, { objURL: 'slow.obj' }],
    ['PCD', PCD, mockPCDLoad, { pcdURL: 'slow.pcd' }],
  ])(
    '%s: a load that ends after unmount is ignored',
    (name, Loader, load, props) => {
      let pendingOnLoad;
      let pendingOnError;
      load.mockImplementation((url, onLoad, onProgress, onError) => {
        pendingOnLoad = onLoad;
        pendingOnError = onError;
      });
      const onError = jest.fn();
      const onLoad = jest.fn();

      const root = mount(
        React.createElement(Loader, {
          ...props,
          loadingLabel: false,
          onError,
          onLoad,
        })
      );
      unmount(root);

      expect(() => {
        pendingOnError(new Error('late failure'));
        pendingOnLoad({
          scene: { children: [], traverse: () => {} },
          traverse: () => {},
          material: {},
        });
      }).not.toThrow();

      expect(onError).not.toHaveBeenCalled();
      expect(onLoad).not.toHaveBeenCalled();
      expect(loggedFailureNaming(consoleError, 'slow.')).toBe(false);
    }
  );

  test('a missing URL warns and never reports a load failure', () => {
    const consoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const onError = jest.fn();

    const root = mount(
      React.createElement(PCD, {
        pcdURL: undefined,
        loadingLabel: false,
        onError,
      })
    );

    expect(mockPCDLoad).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(consoleWarn).toHaveBeenCalledWith('[PCD] No pcdURL');

    consoleWarn.mockRestore();
    unmount(root);
  });
});
