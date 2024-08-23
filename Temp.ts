{
  "root": "apps/my-app",
  "sourceRoot": "apps/my-app/src",
  "projectType": "application",
  "targets": {
    "build": {
      "executor": "@nrwl/web:build",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/apps/my-app",
        "index": "apps/my-app/src/index.html",
        "main": "apps/my-app/src/main.tsx",
        "tsConfig": "apps/my-app/tsconfig.app.json",
        "assets": ["apps/my-app/src/favicon.ico", "apps/my-app/src/assets"],
        "styles": ["apps/my-app/src/styles.css"],
        "scripts": []
      }
    }
  }
}

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),  // Adjust to your entry point
      name: 'MyPackage',
      fileName: (format) => `my-package.${format}.js`,
    },
    rollupOptions: {
      // Make sure to externalize dependencies that you do not want to bundle
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});