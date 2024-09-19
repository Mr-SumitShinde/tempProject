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


Here’s an example of a banking form structure based on your requirements:

### Step 1: Initial Questions with Radio Inputs
1. **Do you have an existing bank account?**
   - Yes
   - No

2. **Would you like to apply for a loan?**
   - Yes
   - No

### Step 2: Drop-down Question
3. **Select your account type:**
   - Savings Account
   - Current Account
   - Fixed Deposit
   - Recurring Deposit

### Step 3: Checkbox Question
4. **Select the services you're interested in:**
   - Internet Banking
   - Mobile Banking
   - Cheque Book
   - Debit Card

### Conditional Rendering Based on Previous Inputs

#### Case 1: If the user selects **Yes** for “Do you have an existing bank account?”
5. **Which type of existing account do you hold?**
   - Personal Account
   - Business Account

#### Case 2: If the user selects **Current Account** in the drop-down:
6. **Would you like to apply for a business loan?**
   - Yes
   - No

#### Case 3: If the user selects **Fixed Deposit** in the drop-down:
7. **Are you interested in an FD renewal?**
   - Yes
   - No

This form structure allows you to conditionally render additional questions based on previous inputs like radio button selections or the selected value from the drop-down list. Let me know if you need further adjustments or more complex logic!
