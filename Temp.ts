#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

// Function to execute shell commands
const executeCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`, error);
    process.exit(1);
  }
};

// Function to create the new app
const createApp = (appName) => {
  console.log(`Creating a new CLM app in ${process.cwd()}/${appName}`);

  // Create the directory for the new app
  fs.mkdirSync(appName);

  // Navigate to the new directory
  process.chdir(appName);

  // Initialize a new React app using Create React App
  executeCommand('npx create-react-app .');

  console.log('Installing additional dependencies...');
  // Add your additional dependencies here
  const dependencies = [
    'blueprintjs/core',
    'blueprintjs/icons',
    '@emotion/react',
    '@emotion/styled',
    'axios'
  ];
  executeCommand(`npm install ${dependencies.join(' ')}`);

  const devDependencies = [
    'jest',
    '@testing-library/react',
    '@testing-library/jest-dom'
  ];
  executeCommand(`npm install --save-dev ${devDependencies.join(' ')}`);

  console.log('Setting up project structure...');
  // Add any additional setup you need here
  // fs.writeFileSync('src/setupFile.js', 'console.log("Setup complete");');

  console.log('App created successfully!');
};

// Get the app name from the command line arguments
const appName = process.argv[2];
if (!appName) {
  console.error('Please provide a name for your app.');
  process.exit(1);
}

createApp(appName);

{
  "name": "create-clm-app",
  "version": "1.0.0",
  "description": "CLI to create a new CLM app",
  "main": "index.js",
  "bin": {
    "create-clm-app": "./index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "fs": "^0.0.1-security"
  }
}