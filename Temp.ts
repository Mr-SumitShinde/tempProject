#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

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
  const validKey = /^[a-zA-Z0-9_:-]+$/.test(key);
  if (!validKey) {
    console.error('Invalid Sonar project key. Please use only letters, numbers, hyphens, underscores, or colons.');
  }
  return validKey;
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

const createApp = async (appName, sonarProjectKey) => {
  try {
    if (!validateProjectName(appName)) {
      throw new Error('Invalid project name.');
    }

    if (!validateSonarProjectKey(sonarProjectKey)) {
      throw new Error('Invalid Sonar project key.');
    }

    const appPath = process.cwd();
    console.log(`Creating a new CLM Nx monorepo app in ${appPath}`);

    await executeCommand(`npx create-nx-workspace --name=cli-ui-${appName} --preset=react-monorepo --framework=none --appName=${appName} --style=scss --bundler=vite --nxCloud=skip --workspaceType=integrated --e2eTestRunner=none`);

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

    console.log('App created successfully!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

// Example usage: Pass project name and Sonar project key as parameters
const appName = 'exampleAppName';
const sonarProjectKey = 'PBWMCLM::UI::DOCREPOSITORY::SNSVC0069179';
createApp(appName, sonarProjectKey);