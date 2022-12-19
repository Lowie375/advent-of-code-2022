const prompts = require("prompts");
const fs = require('fs');

const nodeMap = new Map();
let faces = 0;

function checkAdjacency(x, y, z) {
    let node = nodeMap.get(`${x},${y},${z}`);
    if (node != undefined && node > 0) {
        nodeMap.set(`${x},${y},${z}`, node - 1);
        faces--;
        return 0;
    } else {
        nodeMap.set(`${x},${y},${z}`, node == undefined || node == -0.5 ? -1 : node - 1);
        return 1;
    }
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
        
        // iteration 1: fill space w/ gaps
        let min = [Infinity, Infinity, Infinity];
        let max = [-Infinity, -Infinity, -Infinity];
        for (const l of textLines) {
            let coords = l.split(",").map((e) => parseInt(e));
            for (let i = 0; i < coords.length; i++) {
                min[i] = Math.min(min[i], coords[i]);
                max[i] = Math.max(max[i], coords[i]);
            }
        }
        for (let x = min[0]; x <= max[0]; x++) {
            for (let y = min[1]; y <= max[1]; y++) {
                for (let z = min[2]; z <= max[2]; z++) {
                    nodeMap.set(`${x},${y},${z}`, -0.5);
                }
            }
        }

        // iteration 2: place nodes
        for (const l of textLines) {
            let coords = l.split(",").map((e) => parseInt(e));
            let localFaces = 0;
            for (let i = -1; i <= 1; i += 2) {
                localFaces += checkAdjacency(coords[0] + i, coords[1], coords[2]);
                localFaces += checkAdjacency(coords[0], coords[1] + i, coords[2]);
                localFaces += checkAdjacency(coords[0], coords[1], coords[2] + i);
            }
            faces += localFaces;
            nodeMap.set(l, localFaces);
        }

        // traverse gaps 
        let vis = [];
        for (const g of nodeMap) {
            if (g[1] < -0.5 && !vis.includes(g[0])) {
                let localVis = [];
                vis.push(g[0]);
                let queue = [g[0]];
                while (queue.length > 0) {
                    let curr = queue.shift();
                    let c = curr.split(",").map((e) => parseInt(e));
                    let adjObjs = 0;

                    for (let i = -1; i <= 1; i += 2) {
                        let keys = [`${c[0]+i},${c[1]},${c[2]}`, `${c[0]},${c[1]+i},${c[2]}`, `${c[0]},${c[1]},${c[2]+i}`];
                        let xNode = nodeMap.get(keys[0]);
                        let yNode = nodeMap.get(keys[1]);
                        let zNode = nodeMap.get(keys[2]);
                        // count number of valid things
                        if (xNode != undefined) {
                            adjObjs++;
                            if (xNode < 0 && !vis.includes(keys[0])) {
                                vis.push(keys[0]);
                                queue.push(keys[0]);
                            }
                        }
                        if (yNode != undefined) {
                            adjObjs++;
                            if (yNode < 0 && !vis.includes(keys[1])) {
                                vis.push(keys[1]);
                                queue.push(keys[1]);
                            }
                        }
                        if (zNode != undefined) {
                            adjObjs++;
                            if (zNode < 0 && !vis.includes(keys[2])) {
                                vis.push(keys[2]);
                                queue.push(keys[2]);
                            }
                        }
                    }
                    // push count and adjacent faces
                    let cNode = nodeMap.get(curr);
                    localVis.push([adjObjs, cNode]);
                }

                if (!localVis.some((e) => e[0] != 6)) {
                    for (const e of localVis.filter((e) => e[1] != -0.5))
                        faces += e[1];
                }
            }
        }
        console.log(faces);
    });
}

exports.info = {
    name: "computeDropletExterior",
    desc: "Calculate the exterior surface area of the given lava droplet!",
    day: 18,
    defaultData: "droplet.txt",
}