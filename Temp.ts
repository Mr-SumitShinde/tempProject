#!/usr/bin/env node

const tar = require('tar');
const fs = require('fs-extra');
const path = require('path');
const readlineSync = require('readline-sync');
const { execSync } = require('child_process');

const tarFileName = 'valpre.tar';
const outputFolder = './';
const oldName = 'test';

async function extractTar(newName) {
    const extractedFolder = path.join(outputFolder, newName);
    if (fs.existsSync(extractedFolder)) {
        console.error(`Folder exists with name: ${newName}`);
        process.exit(1);
    }
    await tar.x({ file: tarFileName, C: outputFolder });
    fs.renameSync(path.join(outputFolder, oldName), extractedFolder);
    return extractedFolder;
}

function findAndReplaceFolderNames(folder, oldStr, newStr) {
    fs.readdirSync(folder, { withFileTypes: true }).forEach(dirent => {
        const oldPath = path.join(folder, dirent.name);
        let newPath = oldPath;
        if (dirent.isDirectory()) {
            if (dirent.name.includes(oldStr)) {
                newPath = path.join(folder, dirent.name.replace(new RegExp(oldStr, 'g'), newStr));
                fs.renameSync(oldPath, newPath);
            }
            findAndReplaceFolderNames(newPath, oldStr, newStr);
        }
    });
}

function findAndReplaceFileNames(folder, oldStr, newStr) {
    fs.readdirSync(folder, { withFileTypes: true }).forEach(dirent => {
        const oldPath = path.join(folder, dirent.name);
        let newPath = oldPath;
        if (dirent.isDirectory()) {
            findAndReplaceFileNames(oldPath, oldStr, newStr);
        }
        if (dirent.name.includes(oldStr)) {
            newPath = path.join(folder, dirent.name.replace(new RegExp(oldStr, 'g'), newStr));
            fs.renameSync(oldPath, newPath);
        }
    });
}

function findAndReplaceFileContent(folder, oldStr, newStr) {
    fs.readdirSync(folder, { withFileTypes: true }).forEach(dirent => {
        const filePath = path.join(folder, dirent.name);
        if (dirent.isDirectory()) {
            findAndReplaceFileContent(filePath, oldStr, newStr);
        } else {
            const content = fs.readFileSync(filePath, 'utf8');
            const updatedContent = content.replace(new RegExp(oldStr, 'g'), newStr);
            fs.writeFileSync(filePath, updatedContent);
        }
    });
}

function installDependencies(folder) {
    try {
        console.log(`Running npm install in ${folder}`);
        execSync(`cd ${folder} && npm i --legacy-peer-deps`, { stdio: 'inherit' });
        console.log('Dependencies installed successfully.');
    } catch (error) {
        console.error('Error installing dependencies:', error);
    }
}

async function main() {
    const newName = readlineSync.question("Enter the new name: ");
    const extractedFolder = await extractTar(newName);
    findAndReplaceFolderNames(extractedFolder, oldName, newName);
    findAndReplaceFileNames(extractedFolder, oldName, newName);
    findAndReplaceFileContent(extractedFolder, oldName, newName);
    installDependencies(extractedFolder);
    console.log('Replacement process completed.');
}

main();


I've restored the previous version of your code with all the functions intact, including installDependencies. Let me know if you need any further modifications.

