const tar = require('tar');

// Name of your tar file (must be in the same folder as index.js)
const tarFileName = 'file.tar'; // Replace with your actual file name
const outputFolder = './extracted'; // Output folder

tar.x({
    file: tarFileName, // Extract from this file
    C: outputFolder,   // Extract to this folder
}).then(() => {
    console.log(`Extracted successfully to ${outputFolder}`);
}).catch(error => {
    console.error('Error extracting file:', error);
});


npm install tar