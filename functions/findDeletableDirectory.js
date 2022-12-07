const prompts = require("prompts");
const fs = require('fs');

const dirMap = new Map();
const ROOT = "~";
const DISK_SIZE = 70000000;
const SPACE_NEEDED = 30000000;

function computeSize(dirName) {
    // compute total size
    let dirStruct = dirMap.get(dirName);
    if (dirStruct) {
        if (dirStruct.totalSize != 0) {
            // already computed
            return dirStruct.totalSize;
        } else {
            // compute and save
            let totSize = dirStruct.directSize;
            for (const sd of dirStruct.subDirs) {
                totSize += computeSize(sd);
            }
            dirStruct.totalSize = totSize;
            dirMap.set(dirName, dirStruct);
            return totSize;
        }
    } else {
        console.log(`Directory ${dirName} could not be read`);
    }
}

function dirStruct() {
    return {
        directSize: 0,
        totalSize: 0,
        subDirs: [],
    }
}

exports.run = async function() {
    const input = await prompts({
        type: "text",
        name: "file",
        message: "Name of file to read (from ./inputs):",
        initial: exports.info.defaultData,
        validate: (file) => {fileExists = fs.existsSync(`./inputs/${file}`); return fileExists ? true : "Invalid file name."},
    })

    fs.readFile(`./inputs/${input.file}`, (e, text) => {
        if (e) throw e;

        // create directory structure
        let textLines = text.toString().split("\n");
        let readingActive = false;

        // set up directory tree
        let currentDir = ROOT;
        let currentDirStruct = dirStruct();
        for (const l of textLines) {
            if (readingActive) {
                // read as directory
                if (l.startsWith("$")) {
                    // new command hit, ls output done
                    dirMap.set(currentDir, currentDirStruct);
                    readingActive = false;
                } else if (l.startsWith("dir")) {
                    let subDir = l.split(" ")[1];
                    currentDirStruct.subDirs.push(`${currentDir}/${subDir}`);
                } else {
                    let fileSize = l.split(" ")[0];
                    currentDirStruct.directSize += parseInt(fileSize);
                }
            }
            if (!readingActive) {
                // read as commands
                if (l.startsWith("$ cd")) {
                    if (l.startsWith("$ cd /")) {
                        currentDir = ROOT;
                    } else if (l.startsWith("$ cd ..")) {
                        let split = currentDir.split("/");
                        split.pop();
                        currentDir = split.join("/")
                    } else {
                        let newDir = l.match(/\$ cd (.+)/i)[1];
                        currentDir += `/${newDir}`;
                    }
                } else if (l.startsWith("$ ls")) {
                    // ls executed, read output
                    readingActive = true;
                    currentDirStruct = dirStruct();
                }
            }
        }
        // save final dir
        dirMap.set(currentDir, currentDirStruct);

        // compute directory sizes + find best directory to delete
        let rootSize = computeSize(ROOT);
        let delSize = rootSize;
        for (const [dir, struct] of dirMap) {
            if (DISK_SIZE - rootSize + struct.totalSize >= SPACE_NEEDED && struct.totalSize < delSize) {
                delSize = struct.totalSize;
            }
        }

        console.log(delSize);
    });
}

exports.info = {
    name: "findDeletableDirectory",
    desc: "Find the smallest directory that, if deleted, would result in there being at least 30000000 units of free disk space!",
    day: 7,
    defaultData: "filesystem.txt",
}