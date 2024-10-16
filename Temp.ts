import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),  // Plugin to inject CSS
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyComponentLibrary',
      fileName: 'my-component-library',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'ag-grid-react', 'ag-grid-enterprise'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'ag-grid-react': 'AgGridReact',
        },
      },
    },
  },
});