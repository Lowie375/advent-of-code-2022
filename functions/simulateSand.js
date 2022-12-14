const prompts = require("prompts");
const fs = require('fs');

const WALL = "█";
const SAND = ".";
const VOID = " ";
const SPWN = "+";

function insertWalls(grid, pos1, pos2, xShift) {
    for (let x = Math.min(pos1[0], pos2[0]); x <= Math.max(pos1[0], pos2[0]); x++) {
        for (let y = Math.min(pos1[1], pos2[1]); y <= Math.max(pos1[1], pos2[1]); y++) {
            grid[x-xShift][y] = WALL;
        }
    }
}

exports.run = async function() {
    const input = await prompts([{
        type: "text",
        name: "file",
        message: "Name of file to read (from ./inputs):",
        initial: exports.info.defaultData,
        validate: (file) => {fileExists = fs.existsSync(`./inputs/${file}`); return fileExists ? true : "Invalid file name."},
    }, {
        type: "confirm",
        name: "printGrid",
        message: "Print final sand grid? (WARNING: this is large!)",
        initial: false,
    }]);

    fs.readFile(`./inputs/${input.file}`, (e, text) => {
        if (e) throw e;

        let textLines = text.toString().split("\n");
        let bounds = {xMin: Infinity, xMax: -Infinity, yMax: -Infinity};
        let spawn = [500, 0];
        let walls = [];
        let grid = [];

        // get grid bounds
        for (const l of textLines) {
            let wallSplit = l.split(" -> ");
            walls.push(wallSplit);
            for (let i = 0; i < wallSplit.length; i++) {
                let pos = wallSplit[i].split(",").map((e) => parseInt(e));
                if (pos[0] > bounds.xMax)
                    bounds.xMax = pos[0];
                if (pos[0] < bounds.xMin)
                    bounds.xMin = pos[0];
                if (pos[1] > bounds.yMax)
                    bounds.yMax = pos[1];
            }
        }
        // create array
        for (let i = bounds.xMin; i <= bounds.xMax; i++) {
            grid[i-bounds.xMin] = new Array(bounds.yMax + 1).fill(VOID);
        }
        grid[spawn[0]-bounds.xMin][spawn[1]] = SPWN;

        // load in walls
        for (let i = 0; i < walls.length; i++) {
            let activeWalls = [];
            activeWalls.push(walls[i][0].split(",").map((e) => parseInt(e)));
            for (let w = 1; w < walls[i].length; w++) {
                activeWalls.push(walls[i][w].split(",").map((e) => parseInt(e)));
                insertWalls(grid, activeWalls[0], activeWalls[1], bounds.xMin);
                activeWalls.shift();
            }
        }

        // simulate sand
        let ctr;
        for (ctr = 0; ctr < grid.length * grid[0].length; ctr++) {
            let grain = [spawn[0], spawn[1]];
            let placed = false;
            while (grain[0] >= bounds.xMin && grain[0] <= bounds.xMax && grain[1] <= bounds.yMax) {
                if (grain[1]+1 >= grid[0].length || grid[grain[0]-bounds.xMin][grain[1]+1] == VOID) {
                    grain[1]++;
                } else if (grain[0]-bounds.xMin-1 < 0 || grid[grain[0]-bounds.xMin-1][grain[1]+1] == VOID) {
                    grain[1]++;
                    grain[0]--;
                } else if (grain[0]-bounds.xMin+1 >= grid.length || grid[grain[0]-bounds.xMin+1][grain[1]+1] == VOID) {
                    grain[1]++;
                    grain[0]++;
                } else {
                    grid[grain[0]-bounds.xMin][grain[1]] = SAND;
                    placed = true;
                    break;
                }
            }
            if (!placed)
                break;
        }

        // print out grid, if requested
        if (input.printGrid) {
            for (let y = 0; y < grid[0].length; y++) {
                let line = "";
                for (let x = 0; x < grid.length; x++) {
                    line += grid[x][y];
                }
                console.log(line);
            }
        }
        // print out result
        console.log(ctr);
    });
}

exports.info = {
    name: "simulateSand",
    desc: "Determine the maximum amount of sand grains that can come to rest!",
    day: 14,
    defaultData: "cavetrace.txt",
}