import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';  // Plugin for generating TypeScript declarations

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: 'src/index.ts',  // Entry point for your library
      name: 'MyComponentLibrary',
      formats: ['es'],        // Output as an ESM module
      fileName: 'my-library',
    },
    rollupOptions: {
      // External dependencies that shouldn't be bundled
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    cssCodeSplit: true,        // Ensure CSS is split into a separate file
  },
});