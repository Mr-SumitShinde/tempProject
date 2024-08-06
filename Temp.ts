#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const cliProgress = require('cli-progress');

const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    const proc = exec(command, { stdio: 'inherit' });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
        return;
      }
      resolve();
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
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
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  try {
    let appName;
    let sonarProjectKey;

    do {
      appName = await promptUser('Enter a valid project name (letters, numbers, hyphens, underscores): ');
    } while (!validateProjectName(appName));

    do {
      sonarProjectKey = await promptUser('Enter a valid Sonar project key (letters, numbers, hyphens, underscores): ');
    } while (!validateSonarProjectKey(sonarProjectKey));

    const appPath = process.cwd();
    console.log(`Creating a new CLM Nx monorepo app in ${appPath}`);

    progressBar.start(100, 0);

    await executeCommand(`npx create-nx-workspace --name=cli-ui-${appName} --preset=react-monorepo --framework=none --appName=${appName} --style=scss --bundler=vite --nxCloud=skip --workspaceType=integrated --e2eTestRunner=none`);
    progressBar.update(50);

    const workspacePath = path.resolve(appPath, `cli-ui-${appName}`);
    if (fs.existsSync(workspacePath)) {
      process.chdir(workspacePath);
    } else {
      throw new Error(`Workspace directory ${workspacePath} not found. Setup may be incomplete.`);
    }

    console.log('Setting up project structure...');
    fs.mkdirSync('apps', { recursive: true });
    if (fs.existsSync(`apps/${appName}`)) {
      fs.renameSync(`apps/${appName}`, `apps/${appName}`);
    } else {
      console.error(`Expected initial app directory apps/${appName} not found. Setup may be incomplete.`);
    }

    createSonarProjectFile(workspacePath, sonarProjectKey);
    progressBar.update(100);

    console.log('App created successfully!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    progressBar.stop();
  }
};

createApp();