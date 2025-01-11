The error "rollupOptions.output is not available" occurs because the rollupOptions configuration for Vite is not structured correctly or because certain fields are not supported in a particular context.

In the case of building a library using Vite, the rollupOptions configuration needs to be set correctly. Here's how to resolve this issue:


---

Updated Configuration

Modify your vite.config.ts file as follows:

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/index.ts', // Entry point of your library
      name: 'ValpreDataTable', // Global variable name for UMD builds
      fileName: (format) => `valpre-data-table.${format}.js`, // Output filenames
      formats: ['es', 'umd'], // Output formats: ES modules and UMD
    },
    rollupOptions: {
      // External dependencies that should not be bundled
      external: ['react', 'react-dom', '@barclays/blueprint-react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@barclays/blueprint-react': 'BlueprintReact',
        },
      },
    },
  },
});


---

Explanation of Changes

1. lib Section:

entry: Specifies the entry point of your library.

name: The global variable name for UMD builds.

fileName: Defines the naming convention for output files.

formats: Specifies the output formats (es for ES modules and umd for Universal Module Definition).



2. rollupOptions Section:

external: Marks dependencies (like react, react-dom, and @barclays/blueprint-react) as external, so they are not bundled with your library.

output.globals: Provides the global variable names for these dependencies in UMD builds.





---

Verify Vite Version

Ensure you're using a compatible version of Vite (at least 2.8.0 or newer) that supports library builds. You can check your Vite version with:

npm list vite

If it's outdated, update it:

npm install vite@latest


---

Testing the Build

After updating your vite.config.ts, test your build by running:

npm run build

This should generate your library in the dist directory without bundling external dependencies.


---

Common Pitfalls

Misplaced Configurations: Ensure that rollupOptions is under the build key.

Incorrect Globals: The globals key must map external dependencies to their global variable names correctly (e.g., React, ReactDOM).


If the issue persists, let me know the exact Vite version and error details so I can provide more specific guidance.

{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@barclays/blueprint-react": "^1.0.0"
  },
  "devDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@barclays/blueprint-react": "^1.2.3"
  }
}