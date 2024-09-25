#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter appName: ', (appName) => {
  rl.question('Enter sonarProjectKey (optional): ', (sonarProjectKey) => {
    
    function createApp(appName, sonarProjectKey) {
      console.log(`Creating app with the name: ${appName}`);
      
      if (sonarProjectKey) {
        console.log(`Sonar Project Key: ${sonarProjectKey}`);
      } else {
        console.log("No Sonar Project Key provided, using default or skipping...");
      }
    }
    
    createApp(appName, sonarProjectKey);
    rl.close();
  });
});