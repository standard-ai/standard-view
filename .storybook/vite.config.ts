import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts']
  },
  define: {
    'process.env.NODE_ENV': '"development"'
  }
}); 