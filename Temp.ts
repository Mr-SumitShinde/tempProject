// Import the CSS file at the top of your file if it's a global CSS
import './styles.css'; // Adjust the path to your CSS file

class MyApp {
  constructor() {
    // CSS loader can be added here or before registering microapps
    this.addCSSLoader();
    this.registerMicroapps();
  }

  addCSSLoader() {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = '/path-to-your-stylesheet.css'; // Replace with your CSS file path
    document.head.appendChild(linkElement);
  }

  registerMicroapps() {
    console.log('Microapps registered');
  }
}

new MyApp();