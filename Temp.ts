const fs = require('fs-extra');
const path = require('path');

async function copyFolder(sourcePath, destinationPath, newFolderName) {
    try {
        if (!fs.existsSync(sourcePath)) {
            console.error(`Error: Source folder '${sourcePath}' does not exist.`);
            return;
        }

        const newFolderPath = path.join(destinationPath, newFolderName);

        if (fs.existsSync(newFolderPath)) {
            console.error(`Error: Folder '${newFolderPath}' already exists.`);
            return;
        }

        await fs.copy(sourcePath, newFolderPath);
        console.log(`Folder copied successfully to '${newFolderPath}'`);
    } catch (error) {
        console.error('Error copying folder:', error);
    }
}

const sourceFolder = '/path/to/source/folder';
const destinationFolder = '/path/to/destination';
const newFolderName = 'copied-folder';

copyFolder(sourceFolder, destinationFolder, newFolderName);