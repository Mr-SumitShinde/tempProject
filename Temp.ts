/* Loader styles */
.loader {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 6px solid #f3f3f3; /* Light grey */
  border-top: 6px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

/* Spin animation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}



// Import the CSS file if you're using a bundler like Webpack or Vite
import './styles.css';

class MyApp {
  constructor() {
    this.showLoader();

    // Simulate an async operation (e.g., registering microapps)
    setTimeout(() => {
      this.registerMicroapps();
      this.hideLoader();
    }, 3000); // Adjust the time as needed
  }

  // Function to display the loader
  showLoader() {
    const loader = document.createElement('div');
    loader.id = 'css-loader';
    loader.className = 'loader';
    document.body.appendChild(loader);
  }

  // Function to hide the loader
  hideLoader() {
    const loader = document.getElementById('css-loader');
    if (loader) {
      loader.remove();
    }
  }

  // Placeholder function for microapps registration
  registerMicroapps() {
    console.log('Microapps registered');
  }
}

// Instantiate the application
new MyApp();



<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Loader Example</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- The loader will be added dynamically via JavaScript -->
  <script src="app.js" type="module"></script>
</body>
</html>