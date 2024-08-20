// Select the element where you want to display the text
const rootElement = document.getElementById('root');

// Create an h1 element
const heading = document.createElement('h1');

// Set the text content of the h1 element
heading.textContent = 'Hello World';

// Append the h1 element to the root element
rootElement.appendChild(heading);


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World Example</title>
</head>
<body>
    <div id="root"></div>
    <script src="index.js"></script>
</body>
</html>


export default function displayMessage() {
    const rootElement = document.getElementById('root');
    const heading = document.createElement('h1');
    heading.textContent = 'Hello World';
    rootElement.appendChild(heading);
}

displayMessage();