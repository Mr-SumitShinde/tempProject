const tar = require('tar');
const fs = require('fs-extra');
const path = require('path');
const readlineSync = require('readline-sync');

// TAR file and output folder
const tarFileName = 'valpre-ui-example.tar'; // Replace with actual file name
const outputFolder = './'; // Extract in the current directory
const oldName = 'exampleAppName'; // Placeholder text

// Extract tar file
async function extractTar() {
    try {
        await tar.x({
            file: tarFileName, // Extract from this file
            C: outputFolder // Extract to this folder
        });
        console.log(`Extracted successfully to ${outputFolder}`);
    } catch (error) {
        console.error('Error extracting file:', error);
    }
}

// Function to recursively rename files and replace content
async function replaceExampleAppName(dir, oldName, newName) {
    try {
        const files = await fs.readdir(dir); // Ensure async read
        
        for (const file of files) {
            const oldFilePath = path.join(dir, file);
            let newFilePath = path.join(dir, file.replace(oldName, newName));

            // Rename file if needed
            if (file.includes(oldName)) {
                await fs.rename(oldFilePath, newFilePath);
                console.log(`Renamed: ${oldFilePath} → ${newFilePath}`);
            } else {
                newFilePath = oldFilePath;
            }

            const stats = await fs.stat(newFilePath);

            if (stats.isDirectory()) {
                await replaceExampleAppName(newFilePath, oldName, newName);
            } else {
                // Read file content
                let content = await fs.readFile(newFilePath, 'utf8');

                if (content.includes(oldName)) {
                    content = content.replace(new RegExp(oldName, 'g'), newName);
                    await fs.writeFile(newFilePath, content, 'utf8');
                    console.log(`Updated content in: ${newFilePath}`);
                }
            }
        }
    } catch (error) {
        console.error('Error replacing text:', error);
    }
}

// Main function
async function main() {
    const newName = readlineSync.question('Enter the new name: ');

    // Step 1: Extract the tar file
    await extractTar();

    // Step 2: Replace file names and content
    await replaceExampleAppName(outputFolder, oldName, newName);

    console.log('Replacement process completed.');
}

main();