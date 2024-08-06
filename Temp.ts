
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Function to execute shell commands
const executeCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
  }
};

// Function to validate project name
const validateProjectName = (name) => {
  const validName = /^[a-zA-Z0-9_-]+$/.test(name);
  if (!validName) {
    console.error('Invalid project name. Please use only letters, numbers, hyphens, or underscores.');
  }
  return validName;
};

// Function to validate Sonar project key
const validateSonarProjectKey = (key) => {
  const validKey = /^[a-zA-Z0-9_-]+$/.test(key);
  if (!validKey) {
    console.error('Invalid Sonar project key. Please use only letters, numbers, hyphens, or underscores.');
  }
  return validKey;
};

// Function to prompt the user for input
const promptUser = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => rl.question(query, (answer) => {
    rl.close();
    resolve(answer);
  }));
};

// Function to create the sonar-project.properties file
const createSonarProjectFile = (rootPath, sonarProjectKey) => {
  const sonarConfig = `
sonar.projectKey=${sonarProjectKey}
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
const createApp = async () => {
  let appName;
  let sonarProjectKey;

  // Prompt for app name until valid input is received
  do {
    appName = await promptUser('Enter a valid project name (letters, numbers, hyphens, underscores): ');
  } while (!validateProjectName(appName));

  // Prompt for Sonar project key until valid input is received
  do {
    sonarProjectKey = await promptUser('Enter a valid Sonar project key (letters, numbers, hyphens, underscores): ');
  } while (!validateSonarProjectKey(sonarProjectKey));

  const appPath = path.resolve(process.cwd(), appName);
  console.log(`Creating a new CLM Nx monorepo app in ${appPath}`);

  // Create the directory for the new app if it doesn't exist
  if (!fs.existsSync(appPath)) {
    fs.mkdirSync(appPath, { recursive: true });
  } else {
    console.error(`Directory ${appName} already exists. Please choose a different name or remove the existing directory.`);
    return;
  }

  // Navigate to the new directory
  process.chdir(appPath);

  // Initialize a new Nx workspace with preset values
  executeCommand(`npx create-nx-workspace@latest ${appName} --preset=react-monorepo --appName=${appName} --style=sass --nx-cloud=false --packageManager=npm`);

  // Change directory to the newly created workspace
  process.chdir(appName);

  console.log('Setting up project structure...');
  // Ensure the 'apps' directory exists and move the initial app inside it
  fs.mkdirSync('apps', { recursive: true });
  if (fs.existsSync(`apps/${appName}`)) {
    fs.renameSync(`apps/${appName}`, `apps/${appName}`);
  } else {
    console.error(`Expected initial app directory apps/${appName} not found. Setup may be incomplete.`);
  }

  // Create sonar-project.properties file
  createSonarProjectFile(appPath, sonarProjectKey);

  console.log('App created successfully!');
};

// Execute the createApp function
createApp();