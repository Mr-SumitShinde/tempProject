const tar = require('tar');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

// Function to extract a tar.gz file
async function extractTar(tarFile, outputFolder) {
    try {
        await tar.x({
            file: tarFile,
            cwd: outputFolder,
            strip: 1 // Remove top-level folder if needed
        });
        console.log(`Extracted ${tarFile} to ${outputFolder}`);
    } catch (error) {
        console.error('Error extracting tar file:', error);
    }
}

// Function to recursively rename files and replace content
async function replaceExampleAppName(dir, oldName, newName) {
    try {
        const files = await fs.readdir(dir);
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
    const tarFileName = 'file.tar.gz'; // Your TAR file name
    const outputFolder = './unzipped'; // Extraction folder
    const oldName = 'exampleAppName'; // The placeholder text to be replaced

    // Get user input for the new name
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the new name: ', async (newName) => {
        rl.close();

        // Step 1: Extract the tar file
        await extractTar(tarFileName, outputFolder);

        // Step 2: Replace file names and content
        await replaceExampleAppName(outputFolder, oldName, newName);

        console.log('Replacement process completed.');
    });
}

main();