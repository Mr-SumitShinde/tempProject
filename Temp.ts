import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),  // Path to your entry file
      name: 'MyComponentLibrary',
      fileName: 'my-component-library',
      formats: ['es', 'umd'],  // Ensure you build for both ES and UMD formats
    },
    rollupOptions: {
      // Ensure dependencies are not bundled
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
  css: {
    // Enable CSS inlining, which bundles CSS with the JS
    preprocessorOptions: {
      css: {
        additionalData: '@import "path-to-your-css";', // Include your custom CSS if necessary
      },
    },
  },
});