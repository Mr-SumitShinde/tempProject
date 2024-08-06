#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const executeCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
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

  // Write workspace.json
  const workspaceConfig = {
    npmScope: appName,
    defaultProject: appName,
    projects: {
      [appName]: {
        projectType: "application",
        root: `apps/${appName}`,
        sourceRoot: `apps/${appName}/src`,
        prefix: "app",
        targets: {
          build: {
            executor: "@nrwl/web:build",
            options: {
              outputPath: `dist/apps/${appName}`,
              index: `apps/${appName}/src/index.html`,
              main: `apps/${appName}/src/main.tsx`,
              polyfills: `apps/${appName}/src/polyfills.ts`,
              tsConfig: `apps/${appName}/tsconfig.app.json`,
              assets: [`apps/${appName}/src/favicon.ico`, `apps/${appName}/src/assets`],
              styles: [`apps/${appName}/src/styles.scss`],
              scripts: []
            },
            configurations: {
              production: {
                fileReplacements: [
                  {
                    replace: `apps/${appName}/src/environments/environment.ts`,
                    with: `apps/${appName}/src/environments/environment.prod.ts`
                  }
                ],
                optimization: true,
                outputHashing: "all",
                sourceMap: false,
                extractCss: true,
                namedChunks: false,
                extractLicenses: true,
                vendorChunk: false,
                buildOptimizer: true,
                budgets: [
                  {
                    type: "initial",
                    maximumWarning: "2mb",
                    maximumError: "5mb"
                  }
                ]
              }
            }
          },
          serve: {
            executor: "@nrwl/web:dev-server",
            options: {
              buildTarget: `${appName}:build`
            },
            configurations: {
              production: {
                buildTarget: `${appName}:build:production`
              }
            }
          }
        }
      }
    }
  };

  fs.writeFileSync('workspace.json', JSON.stringify(workspaceConfig, null, 2));

  executeCommand(`npx create-nx-workspace@latest --preset=empty --nx-cloud=skip --packageManager=npm --no-interactive`);

  process.chdir(appPath);

  executeCommand(`npx nx generate @nrwl/react:application ${appName} --style=sass --bundler=vite --e2eTestRunner=none`);

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