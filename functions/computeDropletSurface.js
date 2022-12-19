const prompts = require("prompts");
const fs = require('fs');

const nodeMap = new Map();

function checkAdjacency(x, y, z) {
    if (nodeMap.has(`${x},${y},${z}`))
        return -1;
    else
        return 1;
}

exports.run = async function() {
    const input = await prompts({
        type: "text",
        name: "file",
        message: "Name of file to read (from ./inputs):",
        initial: exports.info.defaultData,
        validate: (file) => {fileExists = fs.existsSync(`./inputs/${file}`); return fileExists ? true : "Invalid file name."},
    });

    fs.readFile(`./inputs/${input.file}`, (e, buff) => {
        if (e) throw e;

        let textLines = buff.toString().split("\n");
        let faces = 0;
        
        for (const l of textLines) {
            let coords = l.split(",").map((e) => parseInt(e));
            for (let i = -1; i <= 1; i += 2) {
                localFaces = 
                faces += checkAdjacency(coords[0] + i, coords[1], coords[2]);
                faces += checkAdjacency(coords[0], coords[1] + i, coords[2]);
                faces += checkAdjacency(coords[0], coords[1], coords[2] + i);
            }
            nodeMap.set(l, true);
        }
        console.log(faces);
    });
}

exports.info = {
    name: "computeDropletSurface",
    desc: "Calculate the exterior surface area of the given lava droplet!",
    day: 18,
    defaultData: "droplet.txt",
}