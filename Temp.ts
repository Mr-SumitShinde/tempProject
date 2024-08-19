// index.js

// This code runs when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Select the element with the ID 'app'
    const app = document.getElementById('app');

    // Create a new div element
    const newDiv = document.createElement('div');

    // Add some content to the new div
    newDiv.innerHTML = '<h1>Hello, World!</h1><p>This is a simple JavaScript example.</p>';

    // Append the new div to the 'app' element
    app.appendChild(newDiv);
});