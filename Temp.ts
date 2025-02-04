import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'YourLibrary',
      fileName: (format) => `your-library.${format}.js`,
    },
    rollupOptions: {
      external: [], // Ensure React is bundled
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Ensure React is bundled
  },
});