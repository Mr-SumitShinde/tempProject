import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react({ jsxRuntime: 'classic' }), // Use Classic JSX runtime
    dts(),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'YourLibrary',
      fileName: (format) => `your-library.${format}.js`,
    },
    rollupOptions: {
      external: [], // Ensures React is included in the bundle
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Ensures React is bundled inside the package
  },
});