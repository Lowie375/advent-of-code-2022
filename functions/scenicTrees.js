const prompts = require("prompts");
const fs = require('fs');

let grid = [];

function checkBlockage(scenicViews, blocked, i, val, pos, max) {
    if (blocked[i]) return;

    if (pos.x >= max || pos.y >= max || pos.x < 0 || pos.y < 0) {
        blocked[i] = true;
    } else {
        let posVal = grid[pos.x][pos.y];
        scenicViews[i]++;
        if (posVal >= val)
            blocked[i] = true;
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

        // there's probably a way to do this in quatratic time (O(n^2)), but i'm setting for cubic (O(n^3)) today
        // create grid of trees
        let textLines = text.toString().split("\n");
        let dim = {width: textLines[0].length, height: textLines.length};
        
        for (let x = 0; x < dim.width; x++) {
            let splitLine = textLines[x].split("");
            grid[x] = [];
            for (let y = 0; y < dim.height; y++) {
                grid[x][y] = splitLine[y];
            }
        }

        let scenicMax = 0;
        // iterate over non-edge cells (edges have scenic score 0)
        for (let x = 1; x < dim.width - 1; x++) {
            for (let y = 1; y < dim.height - 1; y++) {
                let scenicViews = new Array(4).fill(0);
                let blocked = new Array(4).fill(false);
                let gridVal = grid[x][y];
                for (let i = 1; i < Math.max(dim.width, dim.height); i++) {
                    checkBlockage(scenicViews, blocked, 0, gridVal, {x: x, y: y-i}, dim.height); // N = y-i
                    checkBlockage(scenicViews, blocked, 1, gridVal, {x: x+i, y: y}, dim.width);  // E = x+i
                    checkBlockage(scenicViews, blocked, 2, gridVal, {x: x, y: y+i}, dim.height); // S = y+i
                    checkBlockage(scenicViews, blocked, 3, gridVal, {x: x-i, y: y}, dim.width);  // W = x-i
                    if (blocked.filter((e) => !e).length == 0) {
                        scenicMax = Math.max(scenicMax, scenicViews.reduce((acc, curr) => acc * curr, 1));
                        break;
                    }
                }
            }
        }

        console.log(scenicMax);
    });
}

exports.info = {
    name: "scenicTrees",
    desc: "Find the highest possible scenic score for any tree on the map!",
    day: 8,
    defaultData: "trees.txt",
}