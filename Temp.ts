#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to execute shell commands
const executeCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
};

// Function to validate project name
const validateProjectName = (name) => {
  const validName = /^[a-zA-Z0-9_-]+$/.test(name);
  if (!name || !validName) {
    console.error('Invalid project name. Please use only letters, numbers, hyphens, or underscores.');
    process.exit(1);
  }
};

// Function to create the sonar-project.properties file
const createSonarProjectFile = (rootPath) => {
  const sonarConfig = `
sonar.projectKey=my-nx-monorepo
sonar.organization=my-org
sonar.sources=.
sonar.exclusions=**/node_modules/**,**/dist/**,**/*.spec.ts
sonar.tests=.
sonar.test.inclusions=**/*.spec.ts
sonar.javascript.lcov.reportPaths=coverage/lcov.info
`;
  fs.writeFileSync(path.join(rootPath, 'sonar-project.properties'), sonarConfig);
  console.log('Created sonar-project.properties file.');
};

// Function to create the new app
const createApp = (appName) => {
  validateProjectName(appName);

  const appPath = path.resolve(process.cwd(), appName);
  console.log(`Creating a new CLM Nx monorepo app in ${appPath}`);

  // Create the directory for the new app if it doesn't exist
  if (!fs.existsSync(appPath)) {
    fs.mkdirSync(appPath, { recursive: true });
  } else {
    console.error(`Directory ${appName} already exists. Please choose a different name or remove the existing directory.`);
    process.exit(1);
  }

  // Navigate to the new directory
  process.chdir(appPath);

  // Initialize a new Nx workspace
  executeCommand(`npx create-nx-workspace@latest ${appName} --preset=react-monorepo --appName=${appName} --style=css --nx-cloud=false`);

  // Change directory to the newly created workspace
  process.chdir(appName);

  console.log('Installing additional dependencies...');
  // Additional dependencies
  const dependencies = [
    'react@18.2.0',
    'react-dom@18.2.0',
    '@ag-grid-community/client-side-row-model@^31.3.2',
    '@ag-grid-community/core@^31.3.2',
    '@ag-grid-community/react@^31.3.2',
    '@barclays/blueprint-fonts-effra@^0.63.0',
    '@barclays/blueprint-fonts-expert-sans@^0.63.0',
    'ag-grid-react@^31.3.2',
    'react-hook-form@^7.51.5',
    'react-router-dom@6.11.2',
    'tslib@^2.3.0'
  ];
  executeCommand(`npm install ${dependencies.join(' ')}`);

  // Development dependencies
  const devDependencies = [
    'postcss-nesting@^12.1.4',
    '@babel/core@^7.14.5',
    '@babel/preset-react@^7.14.5',
    '@barclays/blueprint-icons@^0.63.0',
    '@barclays/blueprint-react@^0.63.0',
    '@nx/eslint@18.1.3',
    '@nx/eslint-plugin@18.1.3',
    '@nx/jest@18.1.3',
    '@nx/js@18.1.3',
    '@nx/react@^18.1.3',
    '@nx/vite@18.1.3',
    '@nx/web@18.1.3',
    '@swc-node/register@~1.8.0',
    '@swc/cli@~0.1.62',
    '@swc/core@~1.3.85',
    '@swc/helpers@~0.5.2',
    '@testing-library/react@14.0.0',
    '@types/jest@^29.4.0',
    '@types/node@18.16.9',
    '@types/react@18.2.33',
    '@types/react-dom@18.2.14',
    '@typescript-eslint/eslint-plugin@^6.13.2',
    '@typescript-eslint/parser@^6.13.2',
    '@vitejs/plugin-react@^4.2.0',
    '@vitest/ui@^1.3.1',
    'babel-jest@^29.4.1',
    'eslint@~8.48.0',
    'eslint-config-prettier@^9.0.0',
    'eslint-plugin-import@2.27.5',
    'eslint-plugin-jsx-a11y@6.7.1',
    'eslint-plugin-react@7.32.2',
    'eslint-plugin-react-hooks@4.6.0',
    'jest@^29.4.1',
    'jest-environment-jsdom@^29.4.1',
    'jest-environment-node@^29.4.1',
    'jsdom@~22.1.0',
    'nx@18.1.3',
    'prettier@^2.6.2',
    'sass@^1.55.0',
    'swc-loader@0.1.15',
    'ts-jest@^29.1.0',
    'ts-node@10.9.1',
    'typescript@~5.3.2',
    'vite@~5.0.0',
    'vite-plugin-dts@~2.3.0',
    'vitest@^1.3.1'
  ];
  executeCommand(`npm install --save-dev ${devDependencies.join(' ')}`);

  console.log('Setting up project structure...');
  // Rename 'apps' to 'src' and move the initial app inside
  fs.renameSync('apps', 'src');
  fs.mkdirSync(path.join('src', appName), { recursive: true });
  fs.renameSync(path.join('src', appName), path.join('src', appName, appName));

  // Create sonar-project.properties file
  createSonarProjectFile(appPath);

  console.log('App created successfully!');
};

// Get the app name from the command line arguments
const appName = process.argv[2];
if (!appName) {
  console.error('Please provide a name for your app.');
  process.exit(1);
}

createApp(appName);