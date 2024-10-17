import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'), // Entry point of your library
      name: 'ValpreReactDataTable',
      formats: ['es', 'umd'], // Ensure compatibility with different module formats
      fileName: (format) => `valpre-react-data-table.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'], // Mark external dependencies to avoid bundling them
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/valpre-grid-theme-barclays.scss";`, // Adjust paths accordingly
      },
    },
  },
});