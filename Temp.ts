#!/usr/bin/env node

const [appName, sonarProjectKey] = process.argv.slice(2);

function createApp(appName, sonarProjectKey) {
  if (!appName) {
    console.error("Error: 'appName' is required.");
    process.exit(1);
  }
  
  console.log(`Creating app with the name: ${appName}`);
  
  if (sonarProjectKey) {
    console.log(`Sonar Project Key: ${sonarProjectKey}`);
  } else {
    console.log("No Sonar Project Key provided, using default or skipping...");
  }
}

createApp(appName, sonarProjectKey);