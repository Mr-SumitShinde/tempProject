#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const executeCommand = (command, options = {}) => {
  try {
    execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
  }
};

const validateProjectName = (name) => {
  const validName = /^[a-zA-Z0-9_-]+$/.test(name);
  if (!validName) {
    console.error('Invalid project name. Please use only letters, numbers, hyphens, or underscores.');
  }
  return validName;
};

const validateSonarProjectKey = (key) => {
  const validKey = /^[a-zA-Z0-9_-]+$/.test(key);
  if (!validKey) {
    console.error('Invalid Sonar project key. Please use only letters, numbers, hyphens, or underscores.');
  }
  return validKey;
};

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

const createApp = async () => {
  let appName;
  let sonarProjectKey;

  do {
    appName = await promptUser('Enter a valid project name (letters, numbers, hyphens, underscores): ');
  } while (!validateProjectName(appName));

  do {
    sonarProjectKey = await promptUser('Enter a valid Sonar project key (letters, numbers, hyphens, underscores): ');
  } while (!validateSonarProjectKey(sonarProjectKey));

  const appPath = path.resolve(process.cwd(), appName);
  console.log(`Creating a new CLM Nx monorepo app in ${appPath}`);

  if (!fs.existsSync(appPath)) {
    fs.mkdirSync(appPath, { recursive: true });
  } else {
    console.error(`Directory ${appName} already exists. Please choose a different name or remove the existing directory.`);
    return;
  }

  process.chdir(appPath);

  const createNxWorkspaceCommand = `
    npx create-nx-workspace@latest ${appName} --preset=react-monorepo --appName=${appName} --style=sass --nx-cloud=skip --packageManager=npm
  `;
  
  const automationScript = `
    #!/usr/bin/expect -f
    spawn ${createNxWorkspaceCommand}
    expect "Which bundler would you like to use?"
    send "vite\r"
    expect "Test runner to use for end to end (E2E) tests"
    send "none\r"
    interact
  `;
  
  fs.writeFileSync('automation_script.sh', automationScript);
  executeCommand('chmod +x automation_script.sh');
  executeCommand('./automation_script.sh');
  fs.unlinkSync('automation_script.sh');

  const workspacePath = path.resolve(appPath, appName);
  if (fs.existsSync(workspacePath)) {
    process.chdir(workspacePath);
  } else {
    console.error(`Workspace directory ${workspacePath} not found. Setup may be incomplete.`);
    return;
  }

  console.log('Setting up project structure...');
  fs.mkdirSync('apps', { recursive: true });
  if (fs.existsSync(`apps/${appName}`)) {
    fs.renameSync(`apps/${appName}`, `apps/${appName}`);
  } else {
    console.error(`Expected initial app directory apps/${appName} not found. Setup may be incomplete.`);
  }

  createSonarProjectFile(appPath, sonarProjectKey);

  console.log('App created successfully!');
};

createApp();