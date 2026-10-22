import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.tsx' },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2020',
  treeshake: true,
  // Peer deps are provided by the consumer — never bundle them.
  // Regexes also cover subpaths (react/jsx-runtime, three/examples/jsm/*).
  external: [
    /^react($|\/)/,
    /^three($|\/)/,
    '@react-three/fiber',
    '@react-three/drei',
  ],
});
