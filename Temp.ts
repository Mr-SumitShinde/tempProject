npx create-nx-workspace clm-ui-demo \
  --preset=apps \
  --appName=clm-ui-demo \
  --style=scss \
  --nxCloud=false \
  --bundler=vite \
  --ci=skip \
  --linter=eslint \
  --e2eTestRunner=none \
  --framework=react



https://github.com/nrwl/nx/blob/master/docs%2Fgenerated%2Fcli%2Fcreate-nx-workspace.md


const readline = require('readline');

// Create an interface to read input from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getUserInputs(callback) {
  rl.question('Enter the application name (default: MyApp): ', (appName) => {
    if (!appName.trim()) {
      appName = 'MyApp'; // Default value for appName
    }

    rl.question('Enter the Sonar project key (default: sonar-project-key): ', (sonarProjectKey) => {
      if (!sonarProjectKey.trim()) {
        sonarProjectKey = 'sonar-project-key'; // Default value for sonarProjectKey
      }

      callback(appName, sonarProjectKey);
      rl.close();
    });
  });
}

function createApp(appName, sonarProjectKey) {
  // Your logic to create an app with the given inputs
  console.log(`Creating app with name: ${appName}`);
  console.log(`Setting up Sonar project key: ${sonarProjectKey}`);

  // Add any additional logic you want to implement
}

// Start the process and pass the inputs to the createApp function
getUserInputs(createApp);