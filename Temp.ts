import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' }), dts()],
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'YourLibrary',
      fileName: (format) => `your-library.${format}.js`,
    },
    rollupOptions: {
      external: [], // React is bundled, but ensure a single instance
    },
  },
});