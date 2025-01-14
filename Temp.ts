function executeCommand(command) {
  console.log(`Executing: ${command}`);
  return new Promise((resolve, reject) => {
    // Start a timer to show a patience message after 2 minutes
    const patienceTimer = setTimeout(() => {
      console.log("This might take a while, please be patient...");
    }, 2 * 60 * 1000);

    // Simulate a long-running process (e.g., running a command)
    setTimeout(() => {
      clearTimeout(patienceTimer); // Clear the patience timer if the command finishes
      console.log(`Finished: ${command}`);
      resolve();
    }, Math.random() * 5 * 60 * 1000); // Simulated command time (up to 5 minutes)
  });
}

// Usage Example
(async function run() {
  await executeCommand("npx create-nx-workspace@18 --name=my-app");
  console.log("Command execution completed!");
})();


setTimeout(() => console.log("This is your comment after 2 minutes"), 2 * 60 * 1000);